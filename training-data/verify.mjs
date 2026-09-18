/**
 * Dataset verifier.
 *
 * The verifier enforces the dataset circuit contract over a shipped tree
 * instead of trusting the writer. It scans every `solution.sop` for the shape
 * rules (no `input` wire, no `modelCall` wire, and the probe harness in every
 * `jsEval` stage), fails a tree whose identical statements carry different
 * printed answers, executes every circuit without inputs and without model
 * bindings and compares the executed answer with the printed answer of its
 * manifest row, and probes answer provenance by perturbing each `slots`
 * literal. The readers live in `dataset-manifest.mjs` and the provenance
 * machinery in `provenance.mjs`.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCircuit } from '../runtime/parser.mjs';
import { createRuntime } from '../runtime/kernel.mjs';
import { probeCount } from '../teacher/families/probes.mjs';
import { answerMatches, normalizeAnswer } from '../teacher/naming.mjs';
import { DEFAULT_ROOT, bookRoots, expectedAnswersOf, solutionFilesOf, statementBodyOf } from './dataset-manifest.mjs';
import { verifyProvenance } from './provenance.mjs';

const FORBIDDEN_COMMANDS = new Map([
  ['input', 'an input wire re-states data the compiled plan already carries'],
  ['modelCall', 'the compiling model already read the problem; a circuit must not re-parse its own input']
]);
const MINIMUM_PROBES = 3;

/**
 * Scan every circuit for the forbidden commands and for a `jsEval` stage
 * without the probe harness. The scan never stops at the first violation, so
 * one run reports every file that needs attention.
 */
export function scanShape(root, files) {
  const violations = [];
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    const parsed = parseCircuit(source, { sourceName: relative(root, file) });
    for (const wire of parsed.wires) {
      if (FORBIDDEN_COMMANDS.has(wire.command)) {
        violations.push({
          file: relative(root, file),
          wire: wire.name,
          command: wire.command,
          why: FORBIDDEN_COMMANDS.get(wire.command)
        });
      }
      const probes = probeCount(wire.body);
      if (wire.command === 'jsEval' && probes < MINIMUM_PROBES) {
        violations.push({
          file: relative(root, file),
          wire: wire.name,
          command: wire.command,
          why: `a dataset jsEval stage asserts its inputs and its output with the probe harness (at least ${MINIMUM_PROBES} probe(...) calls), found ${probes}`
        });
      }
    }
  }
  return violations;
}

/**
 * Execute every circuit without inputs and without model bindings and compare
 * the answer with the expected answer of its manifest row. A circuit that
 * needs an input binding or a model call cannot complete this run, which is
 * the structural proof of the shape rule.
 */
export async function verifyExecution(root, files, { runtime = createRuntime() } = {}) {
  const expected = expectedAnswersOf(root);
  const failures = [];
  let matched = 0;
  const startedAll = performance.now();
  const durations = [];
  for (const file of files) {
    const folder = relative(root, file).replace(/\/solution\.sop$/, '');
    const entry = expected.get(folder);
    if (entry === undefined) {
      failures.push({ file: relative(root, file), reason: 'no manifest row for this folder' });
      continue;
    }
    const expectedAnswer = entry.answer;
    const source = readFileSync(file, 'utf8');
    const startedCircuit = performance.now();
    let result;
    try {
      result = await runtime.run(source, { outputs: ['answer'] });
    } catch (error) {
      failures.push({ file: relative(root, file), reason: `run threw: ${error.message}` });
      continue;
    }
    const circuitMs = performance.now() - startedCircuit;
    durations.push({ file: relative(root, file), ms: circuitMs });
    if (result.status !== 'completed') {
      failures.push({
        file: relative(root, file),
        reason: `run ended ${result.status}:${result.code}`,
        detail: result.error?.message ?? ''
      });
      continue;
    }
    const computed = String(result.outputs.answer);
    if (!answerMatches(expectedAnswer, computed)) {
      failures.push({
        file: relative(root, file),
        reason: 'answer mismatch',
        detail: `expected "${expectedAnswer}" but computed "${computed}"`
      });
      continue;
    }
    matched += 1;
  }
  const totalMs = performance.now() - startedAll;
  const bootMs = durations.length === 0 ? 0 : durations[0].ms;
  const settledEntries = durations.slice(1);
  const sorted = settledEntries.map((entry) => entry.ms).sort((left, right) => left - right);
  const slowest = settledEntries.reduce((winner, entry) => (winner === null || entry.ms > winner.ms ? entry : winner), null);
  return {
    matched,
    failures,
    timings: {
      totalMs,
      averageMs: durations.length === 0 ? 0 : totalMs / durations.length,
      bootMs,
      medianMs: sorted.length === 0 ? 0 : sorted[Math.floor(sorted.length / 2)],
      slowest,
      durations
    }
  };
}

/** Verify one book dataset: shape first, execution only when the shape holds. */
export async function verifyBook(root, { runtime } = {}) {
  const files = solutionFilesOf(root);
  const startedScan = performance.now();
  const violations = scanShape(root, files);
  const scanMs = performance.now() - startedScan;
  if (violations.length > 0) {
    return { circuits: files.length, violations, executed: false, matched: 0, failures: [], timings: { scanMs } };
  }
  const ambiguous = verifyAmbiguity(root, files);
  if (ambiguous.length > 0) {
    return { circuits: files.length, violations: [], executed: false, matched: 0, failures: ambiguous, timings: { scanMs } };
  }
  const execution = await verifyExecution(root, files, runtime === undefined ? {} : { runtime });
  const provenance = await verifyProvenance(root, files, { runtime });
  return {
    circuits: files.length,
    violations: [],
    executed: true,
    matched: execution.matched,
    failures: execution.failures,
    provenance,
    timings: { scanMs, ...execution.timings, provenanceMs: provenance.timings.provenanceMs }
  };
}

/**
 * Statement ambiguity in the shipped tree. Two examples may ship the same
 * solver-visible statement only when they carry the same printed answer;
 * otherwise the statement does not determine its answer, and the pair teaches
 * the reader (and the student) to guess. The check reads the statement body of
 * `problem.md` — the file without its identity heading — and fails every
 * member of a conflicting group, so a hand-edited dataset cannot reintroduce
 * the defect the pilot rejects at generation time.
 */
export function verifyAmbiguity(root, files) {
  const expected = expectedAnswersOf(root);
  const groups = new Map();
  for (const file of files) {
    const folder = relative(root, file).replace(/\/solution\.sop$/, '');
    const problemPath = join(root, folder, 'problem.md');
    if (!existsSync(problemPath)) {
      continue;
    }
    const statement = statementBodyOf(readFileSync(problemPath, 'utf8'));
    const group = groups.get(statement) ?? [];
    group.push({ folder, answer: expected.get(folder)?.answer });
    groups.set(statement, group);
  }
  const failures = [];
  for (const group of groups.values()) {
    if (group.length < 2) {
      continue;
    }
    const answers = new Set(group.filter((entry) => entry.answer !== undefined).map((entry) => normalizeAnswer(entry.answer)));
    if (answers.size < 2) {
      continue;
    }
    for (const entry of group) {
      failures.push({
        file: `${entry.folder}/solution.sop`,
        reason: 'ambiguous statement',
        detail: `the same statement carries ${answers.size} different printed answers; this item prints "${entry.answer}"`
      });
    }
  }
  return failures;
}

/**
 * Answer provenance.
 *
 * A circuit can reproduce the printed answer in two ways: by computing it from
 * the instance values, or by carrying the text of the answer inside the
 * program. Output alone cannot tell them apart, so the check perturbs the
 * instance: it rewrites the `slots` literal with modified values, re-executes
 * the circuit, and asks whether the answer reacted. A computation that never
 * reacts to any perturbation is not computing its answer; when the printed
 * text also occurs literally in the program, the evidence is reported as a
 * hardcoded answer. The plan fingerprint keeps the verdict fair: when every
 * circuit of one plan is invariant and they all print the same answer, the
 * plan is a constant-answer template by design, which the caller reports as
 * information rather than as a warning.
 */

function formatMs(milliseconds) {
  return `${milliseconds.toFixed(2)} ms`;
}

const HELP = `training-data/verify.mjs — dataset circuit verifier

Usage:
  node training-data/verify.mjs [book-id] [--root <dir>] [--timings]

Arguments:
  book-id            Verify only this book dataset under the root, for example
                     mathematical-thinking. Omitted: every dataset with a
                     manifest/ directory under the root is verified.
  --root <dir>       Verify the book datasets under another directory. Default:
                     the directory of this tool, training-data/.
  --timings          After the summary, print the measured duration of every
                     individual circuit execution, one line per solution.sop.
  --provenance       List the circuits whose computed-versus-stored answer
                     could not be proven either way. These notes never fail the
                     run; they only record a limit of the provenance probe.
  --help, -h         Print this text and exit.

What it checks:
  1. The shape rule, per solution.sop: a dataset circuit must not contain an
     input wire (nothing injects a binding into it) and must not contain a
     modelCall wire (the compiling model already read the problem), and every
     jsEval stage must carry the probe harness (at least three probe(...)
     assertions on the slots wire and on the computed answer). Each offending
     wire is printed as a warning, and execution is skipped while a violation
     exists.
  2. Statement ambiguity: two shipped examples must not share the
     solver-visible statement while printing different answers, because the
     statement then does not determine its answer. Every member of a
     conflicting group is reported, and execution is skipped while a conflict
     exists.
  3. Execution, when the shape holds: every circuit is executed by the runtime
     without inputs and without model bindings, and the executed answer is
     compared with the printed answer of its manifest row.
  4. Answer provenance: the slots literal of every circuit is perturbed and the
     circuit is re-executed. The perturbations cover number shifts, zeroing,
     booleans flipped, strings mirrored into palindromes, characters flipped,
     array lengths changed, same-shaped sibling objects aligned, scalar pairs
     aligned and swapped, and values composed from scalar strings, so a
     computation that depends on its inputs reacts to at least one. An answer
     that never reacts is reported per file with the answer text and its
     consequence: a hardcoded answer (the answer wire reads no input value
     outside its probe assertions) fails the run, while an unverifiable verdict
     is a note, never a failure, when every circuit of the plan prints that
     same answer; notes are listed only with --provenance.

Exit codes:
  0  no violations, no ambiguous statement, every executed circuit reproduced
     its printed answer, and no non-constant plan carried an invariant or
     hardcoded answer
  1  at least one shape warning, ambiguous statement, execution mismatch,
     missing manifest row, or non-constant-plan provenance warning
`;

async function main() {
  const argumentsList = process.argv.slice(2);
  if (argumentsList.includes('--help') || argumentsList.includes('-h')) {
    process.stdout.write(HELP);
    process.exit(0);
  }
  const rootIndex = argumentsList.indexOf('--root');
  const root = rootIndex === -1 ? DEFAULT_ROOT : argumentsList[rootIndex + 1];
  const requestedBook = argumentsList.find((argument) => !argument.startsWith('--') && argument !== root) ?? null;

  const books = bookRoots({ root, book: requestedBook });
  if (books.length === 0) {
    process.stderr.write(
      requestedBook === null
        ? `No book dataset with a manifest/ directory found under ${root}.\n`
        : `No book dataset "${requestedBook}" with a manifest/ directory found under ${root}.\n`
    );
    process.exit(1);
  }

  let failed = false;
  for (const book of books) {
    const bookRoot = join(root, book);
    const result = await verifyBook(bookRoot);
    process.stdout.write(`${book}: ${result.circuits} circuits\n`);
    if (result.violations.length > 0) {
      failed = true;
      process.stdout.write(`  shape rule violated in ${result.violations.length} wire(s):\n`);
      for (const violation of result.violations) {
        process.stdout.write(
          `    warning ${violation.file}: wire "${violation.wire}" uses "${violation.command}" — ${violation.why}\n`
        );
      }
      process.stdout.write(`  shape scan: ${formatMs(result.timings.scanMs)} (${result.circuits} files parsed, ${FORBIDDEN_COMMANDS.size} forbidden commands)\n`);
      process.stdout.write('  execution skipped while a shape violation exists\n');
      continue;
    }
    if (!result.executed) {
      failed = true;
      for (const failure of result.failures) {
        process.stdout.write(
          `    failed ${failure.file}: ${failure.reason}${failure.detail === undefined ? '' : ` — ${failure.detail}`}\n`
        );
      }
      process.stdout.write('  execution skipped while an ambiguous statement exists\n');
      continue;
    }
    process.stdout.write(`  executed ${result.circuits}, reproduced the printed answer ${result.matched}\n`);
    const { timings, provenance } = result;
    const slowest = timings.slowest ?? { ms: 0, file: 'n/a' };
    process.stdout.write(
      `  timings: scan ${formatMs(timings.scanMs)}, execution ${formatMs(timings.totalMs)} total, ${formatMs(timings.averageMs)} per circuit, median ${formatMs(timings.medianMs)}, boot ${formatMs(timings.bootMs)}, slowest ${formatMs(slowest.ms)} (${slowest.file}), provenance ${formatMs(timings.provenanceMs)}\n`
    );
    if (argumentsList.includes('--timings')) {
      for (const entry of timings.durations) {
        process.stdout.write(`    ${formatMs(entry.ms)}  ${entry.file}\n`);
      }
    }
    if (provenance !== undefined) {
      const unproven = provenance.invariant.length;
      process.stdout.write(
        `  answer provenance: ${provenance.computed} of ${result.circuits} answers changed when their inputs changed; ${unproven} could not be proven either way (no impact on this run's verdict; --provenance lists them); ${provenance.skipped.length} could not be probed\n`
      );
      if (argumentsList.includes('--provenance')) {
        for (const skipped of provenance.skipped) {
          process.stdout.write(
            `    note ${skipped.file}: this circuit has nothing to perturb (${skipped.reason}), so the probe cannot judge it. Consequence: none for this verdict.\n`
          );
        }
      }
      const expected = expectedAnswersOf(bookRoot);
      const byPlan = new Map();
      for (const finding of provenance.invariant) {
        const group = byPlan.get(finding.plan) ?? [];
        group.push(finding);
        byPlan.set(finding.plan, group);
      }
      for (const [plan, findings] of byPlan) {
        const planAnswers = new Set();
        let planCircuits = 0;
        for (const entry of expected.values()) {
          if (entry.plan === plan) {
            planAnswers.add(entry.answer);
            planCircuits += 1;
          }
        }
        for (const finding of findings) {
          if (!finding.usesInputs) {
            failed = true;
            process.stdout.write(
              `    warning ${finding.file}: the answer "${finding.answer}" stayed the same through all ${finding.perturbations} input perturbations and its answer wire reads no input value outside its probe assertions, so the text is stored, not computed — hardcoded answer (plan ${plan})\n`
            );
            continue;
          }
          if (planAnswers.size === 1) {
            if (argumentsList.includes('--provenance')) {
              process.stdout.write(
                `    note ${finding.file}: the answer "${finding.answer}" stayed the same through all ${finding.perturbations} input perturbations, and all ${planCircuits} circuit(s) of this plan print that same answer, so the probe cannot tell a computed verdict from a stored one. Consequence: none for this verdict — the answer is still verified against the printed answer; this note only records a limit of the probe.\n`
              );
            }
            continue;
          }
          failed = true;
          process.stdout.write(
            `    warning ${finding.file}: the answer "${finding.answer}" stayed the same through all ${finding.perturbations} input perturbations${finding.echoed ? ' and the printed text appears literally in the program' : ''}, while other circuits of this plan print different answers — the answer looks stored, not computed (plan ${plan})\n`
          );
        }
      }
    }
    if (result.failures.length > 0) {
      failed = true;
      for (const failure of result.failures) {
        process.stdout.write(
          `    failed ${failure.file}: ${failure.reason}${failure.detail === undefined ? '' : ` — ${failure.detail}`}\n`
        );
      }
    }
  }

  process.stdout.write(failed ? 'verify: FAILED\n' : 'verify: OK\n');
  process.exit(failed ? 1 : 0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}

