/**
 * Pilot runner for book-derived training data.
 *
 * The runner is the first real stage of the data pipeline described in
 * DS008-training-data. For one registered seed book it extracts the canonical
 * text, parses the problem records, matches every problem to a problem family,
 * assembles the SOP Lang circuit of that family — the compiled values in a
 * `slots` literal plus the deterministic computation wrapped in the probe
 * harness — executes the circuit in the runtime without inputs and without
 * model bindings, and compares the executed answer with the answer the book
 * printed.
 *
 * The book is chosen by id from the source registry (`teacher/sources/`), and a
 * run may be restricted to a subset of its units: a chapter number for the
 * mathematical book, a reasoning-family code for the world book. Only a
 * three-way agreement is accepted as `exact_verified`: the executed circuit
 * output, the family's independent computation, and the printed answer.
 * Everything else is preserved under `rejected/` with its reason, because
 * rejection reasons are diagnostic data rather than noise; the artifact writer
 * lives in `teacher/dataset.mjs`.
 *
 * `pilot.mjs` is the library; the command line lives in `pilot-cli.mjs`.
 * Running the library as a main module would take no flags and rewrite the
 * canonical dataset root with a full-book run, so a direct execution is
 * refused instead of silently performing the wrong command.
 */

import { pathToFileURL } from 'node:url';
import { createRuntime } from '../runtime/kernel.mjs';
import { registerDocxSource } from '../context/sources/docx.mjs';
import { DEFAULT_SOURCE_ID, getSource } from './sources/index.mjs';
import { loadFamilies, buildProgram } from './families/index.mjs';
import { orderHash, planHashOf } from './hashing.mjs';
import { answerMatches, normalizeAnswer } from './naming.mjs';
import { OUTPUT_ROOT, writeDataset } from './dataset.mjs';
import { referencesExternalContext, hasDeclaredPremise, solverText } from './statements.mjs';

export async function runPilot({
  book = DEFAULT_SOURCE_ID,
  units = null,
  limit = null,
  write = true,
  verbose = false,
  outputRoot = OUTPUT_ROOT
} = {}) {
  const source = getSource(book);
  const registration = registerDocxSource(source.path);
  const parsed = source.parse(registration.paragraphs);
  const { families } = await loadFamilies({ book, only: units === null ? null : new Set(units) });
  let problems = units === null ? parsed.problems : parsed.problems.filter((problem) => units.includes(source.unitOf(problem)));
  if (limit !== null) {
    problems = problems.slice(0, limit);
  }

  let accepted = [];
  const rejected = [];
  const runtime = createRuntime();

  for (const problem of problems) {
    const quarantine = source.quarantineRules.find((rule) => rule.test(problem));
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
    const verification = await verifyProblem({ runtime, entry, problem, source });
    if (verification.accepted) {
      // A computed_verified example ships the computed answer: the printed one
      // is reference material the statement does not determine, and the
      // verifier compares every circuit against the shipped column.
      accepted.push({
        problem,
        entry,
        verification,
        shippedAnswer:
          verification.verification.printedStatus === 'match' ? shippedAnswerOf(source, problem) : verification.computed
      });
    } else {
      rejected.push({ problem, reason: verification.reason });
    }
    if (verbose) {
      process.stdout.write(`${verification.accepted ? 'accept' : 'reject'} ${problem.id} ${problem.templateKey} ${verification.accepted ? '' : verification.reason}\n`);
    }
  }

  accepted = rejectAmbiguousStatements(accepted, rejected);
  const split = selectEvalSplit(accepted);
  if (write) {
    writeDataset({ source, registration, accepted, rejected, split, outputRoot });
  }
  return { source, accepted, rejected, split };
}

/**
 * Two shipped examples must not share the solver-visible text while carrying
 * different printed answers. When the source prints a different answer for the
 * same statement, neither the model compiling the statement nor the student
 * can know which answer is expected, and the training pair teaches guessing.
 * The group is rejected whole with `ambiguous_statement`, and every group
 * member keeps its rejection record, so the defect is visible in the report
 * instead of being hidden behind one arbitrary survivor. The gate is the
 * safety net under the family contract: the world book's land-use family, whose
 * five cases per grade repeated one constraint statement, now states the
 * selection rule its case numbering follows as a declared clarification, so
 * each case's statement differs and the group is accepted.
 *
 * `verifyProblem` already rejects a family that refuses an ambiguous variant;
 * this pass catches the same defect at dataset level, independently of what a
 * family chose to do.
 */
export function rejectAmbiguousStatements(accepted, rejected) {
  const groups = new Map();
  for (const item of accepted) {
    const key = solverText(item.entry, item.problem);
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
  }
  const conflicted = new Set();
  for (const group of groups.values()) {
    if (group.length < 2) {
      continue;
    }
    const answers = new Set(group.map((item) => normalizeAnswer(item.problem.printedAnswer)));
    if (answers.size > 1) {
      for (const item of group) {
        conflicted.add(item);
        rejected.push({
          problem: item.problem,
          reason: 'ambiguous_statement:the same statement carries different printed answers'
        });
      }
    }
  }
  if (conflicted.size === 0) {
    return accepted;
  }
  return accepted.filter((item) => !conflicted.has(item));
}

/**
 * The answer text the dataset ships for a problem. A source may normalize its
 * own printed answer when the printed form cannot enter the dataset — the
 * mathematical book prints five answers as a Romanian polarity token in an
 * English book — and the normalization is declared by the source registration
 * instead of being hidden in a family, so the shipped text is reproducible
 * from the source definition.
 */
export function shippedAnswerOf(source, problem) {
  const normalize = source?.normalizePrintedAnswer;
  const normalized = typeof normalize === 'function' ? normalize(problem) : problem.printedAnswer;
  return typeof normalized === 'string' && normalized !== '' ? normalized : problem.printedAnswer;
}

/**
 * The printed answer of a case whose task admits several valid answers, or
 * whose printed value contradicts the statement's own numbers, is not the
 * value a compiler can derive. Such a family declares
 * `printedAnswerStatus` ('alternative' or 'inconsistent') and a
 * `verifyPrinted` predicate: the shipped answer is the computed one, the class
 * becomes `computed_verified`, and the printed answer is only accepted as
 * reference material when the predicate confirms the declared status.
 */
const PRINTED_ANSWER_STATUSES = new Set(['match', 'alternative', 'inconsistent']);

/**
 * The printed-answer status of one variant. A template covers many variants, so
 * the declaration may be a function of the parsed values and the solution: the
 * scientific book's route template ties on thirteen of its twenty-five variants
 * and is exact on the other twelve, and one entry has to describe both.
 */
function printedStatusOf(entry, parsedSlots, solution) {
  const declared = entry.printedAnswerStatus ?? 'match';
  const status = typeof declared === 'function' ? declared(parsedSlots, solution) : declared;
  if (!PRINTED_ANSWER_STATUSES.has(status)) {
    throw new Error(`the family declared an unknown printed answer status "${status}"`);
  }
  return status;
}

export async function verifyProblem({ runtime, entry, problem, source = undefined }) {
  const shippedAnswer = shippedAnswerOf(source, problem);
  let printedStatus = 'match';
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
    // 10-50k scale one ambiguous variant must not abort the run. An ambiguity
    // is marked by the family with `ambiguous: true`, because an answer that
    // is chosen among several valid ones must not enter the dataset.
    if (error.ambiguous === true) {
      return { accepted: false, reason: `ambiguous_statement:${error.message}` };
    }
    return { accepted: false, reason: `oracle_failed:${error.message}` };
  }
  let expected;
  try {
    expected = entry.render(solution);
  } catch (error) {
    return { accepted: false, reason: `oracle_failed:${error.message}` };
  }
  try {
    printedStatus = printedStatusOf(entry, parsedSlots, solution);
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
  if (printedStatus === 'match' && !answerMatches(shippedAnswer, expected)) {
    return { accepted: false, reason: 'oracle_mismatch' };
  }
  const program = buildProgram(entry, parsedSlots);
  const result = await runtime.run(program, { outputs: ['answer'] });
  if (result.status !== 'completed') {
    return { accepted: false, reason: `circuit_${result.status}:${result.code}` };
  }
  const computed = String(result.outputs.answer);
  if (printedStatus === 'match' && !answerMatches(shippedAnswer, computed)) {
    return { accepted: false, reason: 'circuit_answer_mismatch' };
  }
  if (!answerMatches(expected, computed)) {
    return { accepted: false, reason: 'circuit_oracle_disagreement' };
  }
  if (printedStatus !== 'match') {
    let printedAccepted = false;
    try {
      printedAccepted = entry.verifyPrinted(parsedSlots, solution, shippedAnswer) === true;
    } catch (error) {
      return { accepted: false, reason: `printed_answer_unverified:${error.message}` };
    }
    if (!printedAccepted) {
      return { accepted: false, reason: 'printed_answer_unverified' };
    }
  }
  if (entry.category === 'knowledge') {
    const declared = await factDependencyCheck({ runtime, entry, parsedSlots, computed });
    if (declared === false) {
      return { accepted: false, reason: 'fact_not_load_bearing' };
    }
  }
  const acceptanceClass = printedStatus === 'match' ? 'exact_verified' : 'computed_verified';
  return {
    accepted: true,
    reason: acceptanceClass,
    computed,
    expected,
    program,
    solution,
    parsedSlots,
    trace: result.trace,
    verification: { class: acceptanceClass, epochs: result.epochs, printedStatus }
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

/**
 * `pilot.mjs` is the library; the command line lives in `pilot-cli.mjs`.
 * Running the library as a main module would take no flags and rewrite the
 * canonical dataset root with a full-book run, so a direct execution is
 * refused instead of silently performing the wrong command.
 */
if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.stderr.write(
    'pilot.mjs is the pilot library and takes no flags. Run the command line instead: node teacher/pilot-cli.mjs [--book <id>] [--verify] [--chapters 1,2 | --families G1,G2] [--out <dir>]\n'
  );
  process.exit(1);
}

