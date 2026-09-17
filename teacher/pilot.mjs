/**
 * Pilot runner for book-derived training data.
 *
 * The runner is the first real stage of the data pipeline described in
 * DS008-training-data. For one registered seed book it extracts the canonical
 * text, parses the problem records, matches every problem to a problem family,
 * assembles the SOP Lang circuit of that family, executes the circuit in the
 * runtime with the family's reference parse bound to the `modelCall` stage, and
 * compares the executed answer with the answer the book printed.
 *
 * Only a three-way agreement is accepted as `exact_verified`: the executed
 * circuit output, the family's independent computation, and the printed answer.
 * Everything else is preserved under `rejected/` with its reason, because
 * rejection reasons are diagnostic data rather than noise.
 *
 * Text artifacts are the canonical form of the dataset (DS008):
 *
 *   <source>/no-knowledge/<type>/<problem>/{problem.md,solution.sop,explanation.md}
 *   <source>/knowledge/<type>/<problem>/{problem.md,solution.sop,explanation.md}
 *   <source>/eval/<category>/<type>/<problem>/{problem.md,solution.sop,explanation.md}
 *   <source>/rejected/<problem>/{problem.md,rejection.md}
 *   <source>/manifest.md, <source>/report.md, sources.md
 *
 * A variant of one template shares the same circuit text, so the report can
 * measure distinct latent plans by counting distinct circuit hashes.
 */

import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { sha256 } from '../runtime/hashing.mjs';
import { createRuntime } from '../runtime/kernel.mjs';
import { registerDocxSource } from '../context/sources/docx.mjs';
import { BOOK_ID, BOOK_PATH, parseMathThinking, BOOK_QUARANTINE_RULES } from './sources/math-thinking.mjs';
import { loadFamilies, buildProgram, planFingerprint } from './families/index.mjs';
import { answerMatches } from './naming.mjs';
import { assertEnglishContent } from './language.mjs';

const OUTPUT_ROOT = 'training-data';

export function contentHash(text) {
  return sha256(String(text)).slice(0, 12);
}

export function orderHash(text) {
  return sha256(String(text));
}

/**
 * The plan hash of an accepted item: the hash a reader can recompute from the
 * family to identify the latent plan of the example across its variants.
 */
export function planHashOf(item) {
  return contentHash(planFingerprint(item.entry));
}

export async function runPilot({ chapters = null, limit = null, write = true, verbose = false, outputRoot = OUTPUT_ROOT } = {}) {
  const source = registerDocxSource(BOOK_PATH);
  const parsed = parseMathThinking(source.paragraphs);
  const { families } = await loadFamilies({ only: chapters === null ? null : new Set(chapters) });
  let problems = chapters === null ? parsed.problems : parsed.problems.filter((problem) => chapters.includes(problem.chapter));
  if (limit !== null) {
    problems = problems.slice(0, limit);
  }

  const accepted = [];
  const rejected = [];
  const runtime = createRuntime();

  for (const problem of problems) {
    const quarantine = BOOK_QUARANTINE_RULES.find((rule) => rule.test(problem));
    if (quarantine !== undefined) {
      rejected.push({ problem, reason: `quarantine:${quarantine.id}` });
      continue;
    }
    const entry = families.get(problem.templateKey);
    if (entry === undefined) {
      rejected.push({ problem, reason: 'family_not_implemented' });
      continue;
    }
    if (referencesExternalContext(problem) && !hasDeclaredPremise(entry)) {
      rejected.push({ problem, reason: 'unresolved_reference' });
      continue;
    }
    const verification = await verifyProblem({ runtime, entry, problem });
    if (verification.accepted) {
      accepted.push({ problem, entry, verification });
    } else {
      rejected.push({ problem, reason: verification.reason });
    }
    if (verbose) {
      process.stdout.write(`${verification.accepted ? 'accept' : 'reject'} ${problem.id} ${problem.templateKey} ${verification.accepted ? '' : verification.reason}\n`);
    }
  }

  const split = selectEvalSplit(accepted);
  if (write) {
    writeDataset({ source, accepted, rejected, split, outputRoot });
  }
  return { source, accepted, rejected, split };
}

/**
 * Some printed statements hand their premise to the previous problem ("Using
 * the same dictionary"). A solver that receives the statement alone cannot
 * recover that data, so the family must declare it: `sharedPremise` states the
 * referenced fact in one sentence, and the artifact writer prints it as a
 * labelled referenced-context line in `problem.md`. A statement that still
 * references outside data without a declared premise is rejected instead of
 * being shipped as an unanswerable example.
 */
const REFERENCE_PATTERN = /\b(previous problem|previous|same (dictionary|data|code|table|rules?|convention|map))\b/i;

function referencesExternalContext(problem) {
  return REFERENCE_PATTERN.test(problem.statement);
}

function hasDeclaredPremise(entry) {
  return typeof entry.sharedPremise === 'string' && entry.sharedPremise.trim() !== '';
}

/**
 * The exact text a solver receives and `problem.md` carries: the statement,
 * plus the declared referenced context when the family materializes one.
 */
export function solverText(entry, problem) {
  if (!hasDeclaredPremise(entry)) {
    return problem.statement;
  }
  return `${problem.statement}\n\nReferenced context: ${entry.sharedPremise}`;
}

export async function verifyProblem({ runtime, entry, problem }) {
  const solverInput = solverText(entry, problem);
  let parsedSlots;
  try {
    parsedSlots = entry.parse(solverInput);
  } catch (error) {
    return { accepted: false, reason: `parse_failed:${error.message}` };
  }
  let solution;
  try {
    solution = entry.solve(parsedSlots);
  } catch (error) {
    // A family may refuse a variant by design (ambiguity, non-unique orders,
    // out-of-vocabulary words). That is a rejection reason, never a crash: at
    // 10-50k scale one ambiguous variant must not abort the run.
    return { accepted: false, reason: `oracle_failed:${error.message}` };
  }
  let expected;
  try {
    expected = entry.render(solution);
  } catch (error) {
    return { accepted: false, reason: `oracle_failed:${error.message}` };
  }
  try {
    entry.explain(parsedSlots, solution);
  } catch (error) {
    // The explanation is part of the artifact contract, so a family whose
    // explanation fails is rejected instead of aborting the dataset build.
    return { accepted: false, reason: `explain_failed:${error.message}` };
  }
  if (!answerMatches(problem.printedAnswer, expected)) {
    return { accepted: false, reason: 'oracle_mismatch' };
  }
  const program = buildProgram(entry, parsedSlots);
  const result = await runtime.run(program, { outputs: ['answer'] });
  if (result.status !== 'completed') {
    return { accepted: false, reason: `circuit_${result.status}:${result.code}` };
  }
  const computed = String(result.outputs.answer);
  if (!answerMatches(problem.printedAnswer, computed)) {
    return { accepted: false, reason: 'circuit_answer_mismatch' };
  }
  if (!answerMatches(expected, computed)) {
    return { accepted: false, reason: 'circuit_oracle_disagreement' };
  }
  if (entry.category === 'knowledge') {
    const declared = await factDependencyCheck({ runtime, entry, parsedSlots, computed });
    if (declared === false) {
      return { accepted: false, reason: 'fact_not_load_bearing' };
    }
  }
  return {
    accepted: true,
    reason: 'exact_verified',
    computed,
    expected,
    program,
    solution,
    parsedSlots,
    trace: result.trace,
    verification: { class: 'exact_verified', epochs: result.epochs }
  };
}

/**
 * A knowledge circuit must declare and read its fact wire: the fact is a real
 * dependency, not a passenger. The check removes the facts wire and re-runs the
 * circuit. If the run still completes with the same answer, nothing in the
 * program reads the fact — the wire can be deleted without a trace — and the
 * item is rejected as `fact_not_load_bearing`. A consumed fact makes the answer
 * wire unresolvable without its wire (the run ends `partial` with
 * `unresolved_dependencies`), which is the structural evidence the acceptance
 * asks for. Content-level consumption is additionally enforced by the loader's
 * rejection of substring guards on the fact text.
 */
async function factDependencyCheck({ runtime, entry, parsedSlots, computed }) {
  const result = await runtime.run(buildProgram({ ...entry, facts: undefined }, parsedSlots), { outputs: ['answer'] });
  if (result.status === 'completed' && answerMatches(String(result.outputs.answer), computed)) {
    return false;
  }
  return true;
}

/**
 * The evaluation holdout is one percent of the accepted examples, selected
 * deterministically from a hash ordering, stratified by category, and taken in
 * whole clusters so neither a template nor a near-identical plan straddles a
 * split.
 *
 * The selection unit is a cluster of template groups merged whenever two of
 * them share a plan fingerprint: template groups that compile to the same
 * deterministic plan must land on the same side, because an eval item whose
 * plan appears in the training rows overstates generalization (the model is
 * evaluated on a program it has effectively seen). Inside a category, clusters
 * are visited in hash order and a cluster is taken whole when it fits the
 * remaining budget; the first non-fitting cluster is still taken whole when
 * nothing fits, so the holdout never collapses to empty.
 */
export function selectEvalSplit(accepted) {
  const groups = new Map();
  for (const item of accepted) {
    const key = `${item.entry.category}|${item.problem.type}|${item.problem.templateKey}`;
    const group = groups.get(key) ?? { category: item.entry.category, keys: [key], items: [], hashes: new Set() };
    group.items.push(item);
    group.hashes.add(planHashOf(item));
    groups.set(key, group);
  }

  // Union template groups that share at least one circuit hash.
  const groupList = [...groups.values()];
  const parent = new Map(groupList.map((group) => [group, group]));
  const find = (group) => {
    while (parent.get(group) !== group) {
      parent.set(group, parent.get(parent.get(group)));
      group = parent.get(group);
    }
    return group;
  };
  const byHash = new Map();
  for (const group of groupList) {
    for (const hash of group.hashes) {
      if (byHash.has(hash)) {
        parent.set(find(group), find(byHash.get(hash)));
      } else {
        byHash.set(hash, group);
      }
    }
  }
  const clusters = new Map();
  for (const group of groupList) {
    const root = find(group);
    const cluster = clusters.get(root) ?? { category: root.category, keys: [], items: [], hashes: new Set() };
    cluster.keys.push(...group.keys);
    cluster.items.push(...group.items);
    for (const hash of group.hashes) {
      cluster.hashes.add(hash);
    }
    clusters.set(root, cluster);
  }

  const categories = [...new Set(groupList.map((group) => group.category))].sort();
  const ordered = new Map();
  for (const category of categories) {
    ordered.set(
      category,
      [...clusters.values()]
        .filter((cluster) => cluster.category === category)
        .sort((left, right) => (orderHash(left.keys.slice().sort().join('|')) < orderHash(right.keys.slice().sort().join('|')) ? -1 : 1))
    );
  }

  const target = Math.max(1, Math.round(accepted.length * 0.01));
  const chosen = new Set();
  const cursors = new Map(categories.map((category) => [category, 0]));
  const take = (category, index) => {
    const cluster = ordered.get(category)[index];
    for (const item of cluster.items) {
      chosen.add(item.problem.id);
    }
    cursors.set(category, index + 1);
    return cluster.items.length;
  };

  let remaining = target;
  while (remaining > 0) {
    let progressed = false;
    for (const category of categories) {
      const list = ordered.get(category);
      for (let index = cursors.get(category); index < list.length; index += 1) {
        if (list[index].items.length > remaining) {
          continue;
        }
        remaining -= take(category, index);
        progressed = true;
        break;
      }
      if (remaining <= 0) {
        break;
      }
    }
    if (progressed) {
      continue;
    }
    for (const category of categories) {
      const list = ordered.get(category);
      if (cursors.get(category) >= list.length) {
        continue;
      }
      remaining -= take(category, cursors.get(category));
      progressed = true;
      break;
    }
    if (!progressed) {
      break;
    }
  }
  return chosen;
}

function writeDataset({ source, accepted, rejected, split, outputRoot }) {
  const root = join(outputRoot, BOOK_ID);

  // Every file is generated and gated before anything is written, so a policy
  // violation can never leave a partial dataset behind.
  const files = [];
  const rows = [];
  for (const item of accepted) {
    const inEval = split.has(item.problem.id);
    const category = item.entry.category;
    const relative = inEval
      ? ['eval', category, item.problem.type, item.problem.folder].join('/')
      : [category, item.problem.type, item.problem.folder].join('/');
    const problemText = problemFile(item.problem, item.entry);
    const solutionText = `${item.verification.program}\n`;
    const explanationText = explanationFile(item);
    files.push({ relative: join(relative, 'problem.md'), content: problemText });
    files.push({ relative: join(relative, 'solution.sop'), content: solutionText });
    files.push({ relative: join(relative, 'explanation.md'), content: explanationText });
    assertEnglishContent(item.problem.printedAnswer, `${relative} printed answer`);
    rows.push({
      relative,
      problem: item.problem.id,
      title: item.problem.title,
      chapter: item.problem.chapter,
      template: item.problem.templateKey,
      type: item.problem.type,
      category,
      split: inEval ? 'eval' : 'train',
      paragraphs: `${item.problem.paragraphSpan.from}-${item.problem.paragraphSpan.to}`,
      answer: item.problem.printedAnswer,
      planHash: planHashOf(item),
      hashes: [contentHash(problemText), contentHash(solutionText), contentHash(explanationText)]
    });
  }

  for (const item of rejected) {
    const relative = join('rejected', item.problem.folder);
    files.push({ relative: join(relative, 'problem.md'), content: problemFile(item.problem) });
    // The rejection record quotes the printed answer verbatim as provenance,
    // so it is the one generated file the English gate does not scan.
    files.push({ relative: join(relative, 'rejection.md'), content: rejectionFile(item), gated: false });
  }

  // Split integrity: no eval example may share its plan fingerprint with a
  // training row. A compiled circuit embeds the values it was compiled from,
  // so the plan fingerprint — the facts and compute body — is what would make
  // an eval item a near-copy of a training item. The clustering in
  // selectEvalSplit guarantees this, and the assertion makes the guarantee
  // load-bearing instead of incidental.
  const trainPlans = new Set(rows.filter((row) => row.split === 'train').map((row) => row.planHash));
  for (const row of rows.filter((candidate) => candidate.split === 'eval')) {
    if (trainPlans.has(row.planHash)) {
      throw new Error(`Holdout example ${row.problem} shares its plan fingerprint ${row.planHash} with a training row.`);
    }
  }

  const sourcesContent = sourcesFile(source);
  const blemishes = findTextBlemishes(accepted.map((item) => item.problem));
  files.push(...buildManifestFiles(rows));
  files.push({ relative: 'report.md', content: reportFile({ source, accepted, rejected, split, rows, blemishes }) });

  // Gate every generated file before anything is written: the manifest and
  // report inherit printed answers and titles from the source, so they are
  // scanned exactly like the per-problem artifacts, and a violation leaves the
  // previous dataset intact instead of a half-rewritten tree.
  for (const file of files) {
    if (file.gated !== false) {
      assertEnglishContent(file.content, file.relative);
    }
  }
  assertEnglishContent(sourcesContent, 'sources.md');

  if (existsSync(root)) {
    rmSync(root, { recursive: true, force: true });
  }
  mkdirSync(root, { recursive: true });
  for (const file of files) {
    const target = join(root, file.relative);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, file.content);
  }
  mkdirSync(outputRoot, { recursive: true });
  writeFileSync(join(outputRoot, 'sources.md'), sourcesContent);
}

function problemFile(problem, entry = undefined) {
  const body = entry === undefined ? problem.statement : solverText(entry, problem);
  return [`# ${problem.id} — ${problem.title}`, '', body, ''].join('\n');
}

function explanationFile(item) {
  const { problem, entry, verification } = item;
  const { solution, parsedSlots } = verification;
  const steps = entry.explain(parsedSlots, solution);
  const sourceSteps = problem.steps.map((step, index) => `${index + 1}. ${step}`);
  return [
    `# Explanation ${problem.id} — ${problem.title}`,
    '',
    '## Explanation',
    '',
    ...steps.map((step, index) => `${index + 1}. ${step}`),
    '',
    `Reference solution as printed in the source (chapter ${problem.chapter}, ${problem.steps.length} steps):`,
    '',
    ...sourceSteps,
    '',
    '## Result',
    '',
    `**Answer.** ${problem.printedAnswer}`,
    '',
    `**Verification.** ${verification.verification.class}: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in \`report.md\`.`,
    '',
    '**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).',
    ''
  ].join('\n');
}

function rejectionFile(item) {
  return [
    `# Rejection ${item.problem.id} — ${item.problem.title}`,
    '',
    `**Reason.** ${item.reason}`,
    '',
    `**Printed answer.** ${item.problem.printedAnswer}`,
    ''
  ].join('\n');
}

function manifestHeader(title) {
  return [
    `# ${title}`,
    '',
    'One row per accepted example. `split` is `train` or `eval`, and an `eval` example is excluded from the training sets. The three hashes identify `problem.md`, `solution.sop`, and `explanation.md`; `plan` fingerprints the deterministic plan (facts and compute body) of the circuit, which is what the variants of one template share.',
    '',
    '| folder | problem | chapter | template | type | category | split | paragraphs | answer | plan | problem | solution | explanation |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |'
  ];
}

function manifestRow(row) {
  return `| ${row.relative} | ${row.problem} | ${row.chapter} | ${row.template} | ${row.type} | ${row.category} | ${row.split} | ${row.paragraphs} | ${row.answer} | ${row.planHash} | ${row.hashes[0]} | ${row.hashes[1]} | ${row.hashes[2]} |`;
}

/**
 * Builds the manifest files as content, so the writer can gate every page
 * before the dataset root is touched. The index records the count and the
 * content hash of every chapter file, which is what makes the index and the
 * chapter manifests verifiable against each other.
 */
function buildManifestFiles(rows) {
  const byChapter = new Map();
  for (const row of rows) {
    const list = byChapter.get(row.chapter) ?? [];
    list.push(row);
    byChapter.set(row.chapter, list);
  }
  const index = [
    '# Manifest',
    '',
    'The manifest is split by chapter so a thousand-row table stays reviewable. Each chapter manifest holds one row per accepted example, and the index records the counts and the content hash of every chapter file. `distinct plans` counts the plan fingerprints of the chapter: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.',
    '',
    '| chapter | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |'
  ];
  const files = [];
  for (const chapter of [...byChapter.keys()].sort((left, right) => left - right)) {
    const chapterRows = [...byChapter.get(chapter)].sort(compareProblems);
    const lines = [manifestHeader(`Manifest, chapter ${chapter}`), ...chapterRows.map(manifestRow), ''];
    const content = lines.join('\n');
    const relative = `manifest/chapter-${String(chapter).padStart(2, '0')}.md`;
    files.push({ relative, content });
    const distinct = new Set(chapterRows.map((row) => row.planHash)).size;
    index.push(
      `| ${chapter} | ${chapterRows.length} | ${chapterRows.filter((row) => row.split === 'train').length} | ${chapterRows.filter((row) => row.split === 'eval').length} | ${chapterRows.filter((row) => row.category === 'knowledge').length} | ${chapterRows.filter((row) => row.category === 'no-knowledge').length} | ${distinct} | ${relative} | ${contentHash(content)} |`
    );
  }
  index.push('', `Total accepted examples: ${rows.length}.`, '');
  files.push({ relative: 'manifest.md', content: index.join('\n') });
  return files;
}

function sourcesFile(source) {
  return [
    '# Sources',
    '',
    'Source inventory of the pilot pipeline. Rights status is recorded per source and determines whether a derivative may appear in a released artifact.',
    '',
    '| source | path | role | raw hash | canonical hash | extractor | paragraphs | rights | permitted use |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    `| ${BOOK_ID} | ${BOOK_PATH} | seed book | ${source.rawHash} | ${source.canonicalHash} | ${source.extractor} | ${source.paragraphs.length} | project-owned seed book, research use | internal training and evaluation; no public redistribution of source text |`,
    ''
  ].join('\n');
}

/**
 * Family integrity checks. Acceptance already proves that the executed circuit
 * computed the printed answer from the statement, so a family cannot pass by
 * copying the source label. What remains reportable is how much recomputation
 * the accepted variants actually exercise: a template whose variants all print
 * one answer does not test that the computation reacts to its input, and a
 * template with several variants and several answers does.
 */
function integrityFindings(accepted) {
  const byTemplate = new Map();
  for (const item of accepted) {
    const group = byTemplate.get(item.problem.templateKey) ?? { variants: 0, answers: new Set(), type: item.problem.type };
    group.variants += 1;
    group.answers.add(item.problem.printedAnswer);
    byTemplate.set(item.problem.templateKey, group);
  }
  let multiVariant = 0;
  let multiAnswer = 0;
  const constantAnswer = [];
  for (const [template, group] of byTemplate) {
    if (group.variants > 1) {
      multiVariant += 1;
      if (group.answers.size > 1) {
        multiAnswer += 1;
      } else {
        constantAnswer.push(`${template} (${group.variants} variants, one printed answer)`);
      }
    }
  }
  return {
    templates: byTemplate.size,
    multiVariant,
    multiAnswer,
    constantAnswer: constantAnswer.sort()
  };
}

/**
 * Source-owned text blemishes. The extractor is faithful to the printed page:
 * when the book itself prints a word glued to a digit ("0 or1"), the canonical
 * text carries the defect and the pipeline records it instead of silently
 * rewriting the statement. The scan runs before the manifest is locked, and the
 * report lists every finding next to the accepted counts, so a reviewer sees
 * the residual source defects rather than discovering them downstream.
 */
const GLUED_WORD_PATTERN = /([a-z]{2,})(\d)|(\d)([a-z]{2,})\b/g;
const ORDINAL_SUFFIX = /^(st|nd|rd|th)$/;

export function findTextBlemishes(problems) {
  const findings = [];
  for (const problem of problems) {
    const text = `${problem.title} ${problem.statement}`;
    for (const match of text.matchAll(GLUED_WORD_PATTERN)) {
      if (match[4] !== undefined && ORDINAL_SUFFIX.test(match[4])) {
        continue;
      }
      findings.push(`${problem.id}: ${match[0]}`);
    }
  }
  return findings;
}

function reportFile({ source, accepted, rejected, split, rows, blemishes = [] }) {
  const byCategory = countBy(accepted, (item) => item.entry.category);
  const byType = countBy(accepted, (item) => `${item.entry.category}/${item.problem.type}`);
  const byChapter = countBy(accepted, (item) => item.problem.chapter);
  const byReason = countBy(rejected, (item) => item.reason.split(':')[0]);
  const distinctPlans = new Set(rows.map((row) => row.planHash));
  const distinctCircuits = new Set(rows.map((row) => row.hashes[1]));
  const evaluated = rows.filter((row) => row.split === 'eval').length;
  const lines = [
    '# Dataset report',
    '',
    `Source: \`${source.path}\` (raw ${source.rawHash.slice(0, 16)}, canonical ${source.canonicalHash.slice(0, 16)}, extractor ${source.extractor}).`,
    '',
    `Accepted examples: ${accepted.length}. Rejected candidates: ${rejected.length}. Evaluation holdout: ${evaluated} (${((evaluated / Math.max(1, accepted.length)) * 100).toFixed(1)}%). Distinct plans: ${distinctPlans.size}. Distinct compiled circuits: ${distinctCircuits.size} (a circuit embeds the values it was compiled from, so the count equals the accepted set unless two problems compile to identical text).`,
    '',
    'Acceptance class: every accepted example is `exact_verified` in the qualified sense defined by `DS008-training-data`: the executed circuit produced the printed answer, and the family computation reproduced it from the same reference parse. The independence that qualifies is stated under Limitations.',
    '',
    '## Accepted by category',
    ''
  ];
  for (const [category, count] of [...byCategory].sort()) {
    lines.push(`- ${category}: ${count}`);
  }
  lines.push('', '## Accepted by problem type', '');
  const typeEntries = [...byType]
    .sort((left, right) => (left[0] < right[0] ? -1 : 1))
    .map(([type, count]) => `${type} (${count})`);
  let currentLine = '';
  for (const entry of typeEntries) {
    if (currentLine.length + entry.length > 180) {
      lines.push(currentLine.trimEnd());
      currentLine = '';
    }
    currentLine += `${entry}, `;
  }
  if (currentLine !== '') {
    lines.push(currentLine.replace(/, $/, ''));
  }
  lines.push('');
  lines.push('', '## Accepted by chapter', '');
  for (const [chapter, count] of [...byChapter].sort((left, right) => left[0] - right[0])) {
    lines.push(`- chapter ${chapter}: ${count}`);
  }
  lines.push('', '## Rejected by reason', '');
  for (const [reason, count] of [...byReason].sort()) {
    lines.push(`- ${reason}: ${count}`);
  }
  const findings = integrityFindings(accepted);
  lines.push(
    '',
    '## Family integrity checks',
    '',
    `Templates covered: ${findings.templates}, of which ${findings.multiVariant} have several variants and ${findings.multiAnswer} of those print several distinct answers, which is what shows that the computation reacts to its input.`
  );
  if (findings.constantAnswer.length === 0) {
    lines.push('', 'No template with several variants prints one answer for every variant.');
  } else {
    lines.push('', 'Templates whose variants all print one answer, so the variants do not test recomputation:');
    for (const entry of findings.constantAnswer) {
      lines.push(`- ${entry}`);
    }
  }
  lines.push(
    '',
    '## Text blemishes',
    '',
    blemishes.length === 0
      ? 'The statement scan found no missing-space artifacts around digits.'
      : 'The source itself prints these missing-space artifacts around digits (a word glued to a digit); the extraction is faithful and does not repair them:',
    ...(blemishes.length === 0 ? [] : blemishes.map((finding) => `- ${finding}`))
  );
  lines.push(
    '',
    '## Limitations',
    '',
    '- The compiled values of every circuit come from the reference parse of its problem family, because the pilot runs without a teacher model: the shipped circuit is the plan a model would emit after reading the statement. The stage that replaces the reference parse with a real model call keeps the same acceptance checks.',
    '- `exact_verified` certifies that the circuit executed, that the family computation agreed with the printed answer, and that the executed circuit agreed with the family computation. The family `solve` and the circuit `jsEval` body are two transcriptions of one algorithm over one shared reference parse: for a template with several variants the agreement is checked over every variant, and for a single-variant template it certifies one instance. The circuit compute bodies keep the validity guards of their `solve` so a circuit never returns a value the oracle would reject. A structurally different oracle (for example the printed step list) is the next stage of independence and is not claimed here.',
    '- Problems without an implemented family are preserved under `rejected/` with the reason `family_not_implemented` and are the next work item of the pilot.',
    '- Statements that reference data of an earlier problem carry the referenced premise in `problem.md` under a labelled `Referenced context` line; an item without that context is rejected as `unresolved_reference` instead of shipping as an unanswerable example.',
    '- The evaluation holdout is selected deterministically from a hash ordering rather than by a random seed, so it is reproducible. Selection units are template clusters merged by shared plan fingerprint (the facts and compute body), so no eval example repeats a plan that appears in the training rows.',
    ''
  );
  return lines.join('\n');
}

function compareProblems(left, right) {
  const [leftChapter, leftSection] = left.problem.split('.').map(Number);
  const [rightChapter, rightSection] = right.problem.split('.').map(Number);
  if (leftChapter !== rightChapter) {
    return leftChapter - rightChapter;
  }
  return leftSection - rightSection;
}

function countBy(items, keyOf) {
  const counts = new Map();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

/**
 * `pilot.mjs` is the library; the command line lives in `pilot-cli.mjs`.
 * Running the library as a main module would take no flags and rewrite the
 * canonical dataset root with a full-book run, so a direct execution is
 * refused instead of silently performing the wrong command.
 */
if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.stderr.write(
    'pilot.mjs is the pilot library and takes no flags. Run the command line instead: node teacher/pilot-cli.mjs [--verify] [--chapters 1,2] [--out <dir>]\n'
  );
  process.exit(1);
}
