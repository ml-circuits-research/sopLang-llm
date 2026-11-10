#!/usr/bin/env node
/**
 * Build the item files of experiment E2, the surface ladder
 * (article/experiments/no-training-plan.md, "Generator or vocabulary").
 *
 * Inputs:
 * - the 40 held-out problems of each of the 11 held-out compositions, read from
 *   `training-data/procedural-arithmetic/eval/no-knowledge/<id>/*` and parsed back
 *   into slots by the composition family's own `parse`, with the oracle taken from
 *   the book manifest exactly as `evaluation/slices.mjs` does for the holdout;
 * - 20 fresh instances of each of 4 trained control compositions, drawn by the
 *   family's own sampler with seed 20260928 and excluding any statement that
 *   already occurs in the training tree.
 *
 * Every instance is rendered at four rungs (L0 the generator's statement, L1 a
 * paraphrase, L2 book style, L3 book style without a procedure; see
 * `surface-phrases.mjs`). The reference answer of every rung is the family's own
 * `render(solve(slots))`, and the build refuses to write anything unless that
 * value equals the manifest oracle for every held-out item, an independent walk
 * of the operators agrees, L0 reproduces the shipped statement, and every
 * rewritten statement passes the mechanical checks of `item-checks.mjs`.
 *
 * Output: evaluation/registry/items-e2/{L0,L1,L2,L3}.jsonl, checks.json, README.md.
 *
 * Usage: node article/experiments/build-surface-ladder.mjs
 */

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

import { COMPOSITIONS, HELD_OUT, OPERATORS } from '../../teacher/procedural/compositions.mjs';
import { compositionFamily } from '../../teacher/procedural/composition-families.mjs';
import { sampleInstances } from '../../teacher/procedural/random.mjs';
import { expectedAnswersOf, statementBodyOf } from '../../training-data/dataset-manifest.mjs';
import { RENDERERS } from './surface-phrases.mjs';
import { checkSurfaceRow } from './item-checks.mjs';

export const REPOSITORY_ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const OUTPUT_DIRECTORY = join(REPOSITORY_ROOT, 'evaluation', 'registry', 'items-e2');
export const BOOK = 'procedural-arithmetic';
export const CONTROL_SEED = 20260928;
export const RUNGS = Object.freeze(['L0', 'L1', 'L2', 'L3']);
/**
 * Trained compositions that reuse the held-out operators: the two filters, the
 * total and largest aggregates, and the addRate, subtractRate, perUnit, percentOf,
 * and elapsed stages. None of them is in HELD_OUT.
 */
export const CONTROLS = Object.freeze([
  'above-total-percent',
  'below-total-add-rate',
  'above-largest-per-unit-subtract-rate',
  'above-total-elapsed'
]);
const HELD_OUT_PER_COMPOSITION = 40;
const CONTROLS_PER_COMPOSITION = 20;

const BOOK_ROOT = join(REPOSITORY_ROOT, 'training-data', BOOK);

function compositionOf(id) {
  const composition = COMPOSITIONS.find((entry) => entry.id === id);
  if (composition === undefined) throw new Error(`unknown composition ${id}`);
  return composition;
}

/** An independent walk of the chain with the operators' own `apply`, rendered in the family's report form. */
function independentAnswer(composition, slots) {
  let current = slots.values;
  for (const name of composition.chain) current = OPERATORS[name].apply(current, slots);
  const terminal = OPERATORS[composition.chain.at(-1)];
  return terminal.report ? terminal.report.render(current, slots) : `${current} units.`;
}

/** The held-out instances of one composition: statement, slots, and the manifest oracle. */
function heldOutInstances(composition, family, oracles) {
  const directory = join(BOOK_ROOT, 'eval', 'no-knowledge', composition.id);
  const instances = [];
  for (const name of readdirSync(directory).sort()) {
    const folder = `eval/no-knowledge/${composition.id}/${name}`;
    const statement = statementBodyOf(readFileSync(join(directory, name, 'problem.md'), 'utf8')).trimEnd();
    const expected = oracles.get(folder);
    if (expected === undefined) throw new Error(`no manifest row for ${folder}`);
    const slots = family.parse(statement);
    const reference = family.render(family.solve(slots));
    if (reference !== expected.answer) throw new Error(`${folder}: the family computes "${reference}" but the manifest oracle is "${expected.answer}"`);
    if (independentAnswer(composition, slots) !== expected.answer) throw new Error(`${folder}: the independent walk disagrees with the oracle`);
    if (family.statement(slots) !== statement) throw new Error(`${folder}: the family does not reproduce the shipped statement`);
    instances.push({ key: name, folderBase: `eval/no-knowledge/${composition.id}/${name}`, statement, slots, oracle: expected.answer, split: 'held-out' });
  }
  if (instances.length !== HELD_OUT_PER_COMPOSITION) throw new Error(`${composition.id}: ${instances.length} held-out problems, expected ${HELD_OUT_PER_COMPOSITION}`);
  return instances;
}

/** Every statement the training tree already holds for a composition, so a control is never a training row. */
function trainingStatements(id) {
  const statements = new Set();
  for (const category of ['no-knowledge', 'knowledge', 'eval']) {
    let names;
    try {
      names = readdirSync(join(BOOK_ROOT, category, id));
    } catch {
      continue;
    }
    for (const name of names) {
      statements.add(statementBodyOf(readFileSync(join(BOOK_ROOT, category, id, name, 'problem.md'), 'utf8')).trimEnd());
    }
  }
  return statements;
}

/** Fresh control instances of one trained composition, drawn with the family's own sampler. */
function controlInstances(composition, family) {
  const known = trainingStatements(composition.id);
  if (known.size === 0) throw new Error(`${composition.id}: no training rows found, so it is not a trained control`);
  const drawn = sampleInstances({ family, seed: CONTROL_SEED, count: CONTROLS_PER_COMPOSITION * 3 });
  const fresh = drawn.filter((instance) => !known.has(instance.statement)).slice(0, CONTROLS_PER_COMPOSITION);
  if (fresh.length !== CONTROLS_PER_COMPOSITION) throw new Error(`${composition.id}: only ${fresh.length} fresh control instances`);
  return fresh.map((instance, index) => {
    const parsed = family.parse(instance.statement);
    if (!isDeepStrictEqual(parsed, instance.slots)) throw new Error(`${composition.id}: control ${index + 1} does not round-trip through parse`);
    const oracle = family.render(family.solve(instance.slots));
    if (independentAnswer(composition, instance.slots) !== oracle) throw new Error(`${composition.id}: control ${index + 1}: the independent walk disagrees`);
    const number = String(index + 1).padStart(3, '0');
    return { key: `control-${number}`, folderBase: `control/${composition.id}/${number}`, statement: instance.statement, slots: instance.slots, oracle, split: 'trained-control' };
  });
}

/** The four rung rows of one instance. */
function rungRows(composition, instance) {
  return RUNGS.map((rung) => {
    const rendered = rung === 'L0'
      ? { statement: instance.statement, distractor: null }
      : RENDERERS[rung](composition.chain, instance.slots, `e2:${composition.id}:${instance.key}:${rung}`);
    if (rung !== 'L0' && rendered.statement === instance.statement) throw new Error(`${composition.id} ${instance.key} ${rung}: the rewrite equals the original`);
    return {
      book: BOOK,
      folder: `${instance.folderBase}-${rung}`,
      plan: null,
      category: 'no-knowledge',
      statement: rendered.statement,
      oracle: instance.oracle,
      split: instance.split,
      composition: composition.id,
      rung,
      chain: composition.chain,
      slots: instance.slots,
      distractor: rendered.distractor
    };
  });
}

/** Run every mechanical check and tally passes per rung and check. */
export function tallyChecks(rows) {
  const tally = {};
  const failures = [];
  for (const row of rows) {
    const results = checkSurfaceRow(row);
    const rung = tally[row.rung] ??= { items: 0 };
    rung.items += 1;
    for (const [check, messages] of Object.entries(results)) {
      const entry = rung[check] ??= { passed: 0, failed: 0 };
      if (messages.length === 0) entry.passed += 1;
      else {
        entry.failed += 1;
        failures.push({ folder: row.folder, check, messages });
      }
    }
  }
  return { tally, failures };
}

function exampleBlock(row) {
  return [
    `- \`${row.folder}\` (${row.split}, ${row.composition}), oracle \`${row.oracle}\``,
    '',
    `  > ${row.statement}`,
    ''
  ].join('\n');
}

function readme(rowsByRung, checks) {
  const lines = [
    '# Experiment E2 items: the surface ladder',
    '',
    'Built by `article/experiments/build-surface-ladder.mjs` for experiment E2 of `article/experiments/no-training-plan.md`. No model was run to build these files.',
    '',
    '## Construction',
    '',
    `- Held-out items: the ${HELD_OUT.length} held-out compositions (${HELD_OUT.join(', ')}), ${HELD_OUT_PER_COMPOSITION} problems each, read from \`training-data/procedural-arithmetic/eval/no-knowledge/<composition>/*/problem.md\` (body after the heading, trailing newline removed) and parsed into slots by the composition family's own \`parse\`. The oracle is the manifest answer the holdout resolver uses; the build asserts that the family's \`render(solve(slots))\` and an independent walk of \`OPERATORS[*].apply\` both reproduce it, and that the family's \`statement(slots)\` reproduces the shipped statement.`,
    `- Controls: ${CONTROLS.length} trained compositions (${CONTROLS.join(', ')}), ${CONTROLS_PER_COMPOSITION} fresh instances each, drawn by \`sampleInstances\` with seed ${CONTROL_SEED}; statements already present in the training tree are skipped, each control round-trips through \`parse\`, and the oracle is \`render(solve(slots))\`, checked against the independent walk.`,
    '- Rungs: L0 is the generator statement (identical to the shipped `problem.md` body except that the trailing newline the holdout resolver passes on is removed, for every rung alike); L1 is a paraphrase with the same structure (ledger, step list, report instruction); L2 is book style (scenario, one distractor sentence with an irrelevant number, the operations as narrative prose, the question last); L3 is book style with a single question naming the quantity and no step list. The phrase banks are in `article/experiments/surface-phrases.mjs`; each choice is drawn from a stream seeded by the composition, the instance, and the rung.',
    '- Row shape: `book`, `folder`, `plan` (null), `category`, `statement`, `oracle`, `split` (`held-out` or `trained-control`), `composition`, `rung`, plus `chain`, `slots`, and `distractor`, which the checks and `article/experiments/items.test.mjs` read. `evaluation/run-items.mjs --items` reads only the statement and oracle for the prompt and the score.',
    '',
    '## Mechanical checks (`checks.json`)',
    '',
    '- `numbers`: the digits in the statement are exactly the slot numbers with multiplicity (the ledger, each stage parameter, the edges and target of a path stage), plus the declared distractor at L2 and L3, which never equals a slot number.',
    '- `threshold`: at least one mention of the threshold reads as the filter\'s exclusive side ("above T", "greater than T", "discard every entry of T or less" for keepAbove, and the mirror for keepBelow), and no mention reads as the opposite side or an inclusive boundary.',
    '- `parameters`: each stage states its parameter in an unambiguous phrase (factor, fixed charge or deduction, labels per record, divisor, percent, rank ordinal, rectangle width, conversion factor and target unit, path target node and edge list), and the ledger unit is named.',
    '- `numberWords`: L1 to L3 contain no English number word (one, two, twice, double, half, and so on), except the ordinal of the `nthLargest` rank. L0 is exempt, because the generator\'s own wording says "double it by the factor of N" and is kept verbatim.',
    '',
    '## Counts',
    '',
    '| rung | items | held-out | trained-control |',
    '| --- | --- | --- | --- |'
  ];
  for (const rung of RUNGS) {
    const rows = rowsByRung[rung];
    lines.push(`| ${rung} | ${rows.length} | ${rows.filter((row) => row.split === 'held-out').length} | ${rows.filter((row) => row.split === 'trained-control').length} |`);
  }
  lines.push('', `Check failures: ${checks.failures.length}.`, '', '## Known limitations', '');
  lines.push('- `nthLargest` (above-third-largest-percent) counts repeated values separately, as the generator does. L0 does not say so; L1 and L2 say "rank ... from largest to smallest and take the third", and L3 says "the third-largest of the readings above T", so the tie convention is as implicit as in the original.');
  lines.push('- The L3 phrase of a deep chain is a nested noun phrase (for example "the amount left after a fixed deduction of 5 is taken off the number of labels for the sum of the readings below 20 at 3 labels per unit"); it names every stage once, in nesting order, but it is harder to read than the original list.');
  lines.push('- The distractor sentence is one of three templates (parking spaces, months of service, a gate number); the distractor for elapsed compositions is a number of months, which is a time unit, and is kept deliberately as a distractor.');
  lines.push('', '## Examples');
  for (const rung of RUNGS) {
    lines.push('', `### ${rung}`, '');
    const rows = rowsByRung[rung];
    const picks = [rows.find((row) => row.composition === 'above-third-largest-percent'), rows.find((row) => row.composition === 'below-largest-path-exists'), rows.find((row) => row.split === 'trained-control')];
    for (const row of picks) lines.push(exampleBlock(row));
  }
  return `${lines.join('\n')}\n`;
}

export function buildSurfaceLadder() {
  const oracles = expectedAnswersOf(BOOK_ROOT);
  const rowsByRung = Object.fromEntries(RUNGS.map((rung) => [rung, []]));
  const plan = [...HELD_OUT.map((id) => ({ id, held: true })), ...CONTROLS.map((id) => ({ id, held: false }))];
  for (const { id, held } of plan) {
    if (!held && HELD_OUT.includes(id)) throw new Error(`${id} is held out and cannot be a control`);
    const composition = compositionOf(id);
    const family = compositionFamily(composition);
    const instances = held ? heldOutInstances(composition, family, oracles) : controlInstances(composition, family);
    for (const instance of instances) {
      for (const row of rungRows(composition, instance)) rowsByRung[row.rung].push(row);
    }
  }
  const allRows = RUNGS.flatMap((rung) => rowsByRung[rung]);
  const checks = tallyChecks(allRows);
  if (checks.failures.length > 0) {
    throw new Error(`${checks.failures.length} rows fail the mechanical checks, e.g. ${JSON.stringify(checks.failures.slice(0, 3), null, 2)}`);
  }
  mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
  for (const rung of RUNGS) {
    writeFileSync(join(OUTPUT_DIRECTORY, `${rung}.jsonl`), rowsByRung[rung].map((row) => JSON.stringify(row)).join('\n') + '\n');
  }
  const summary = {
    experiment: 'E2',
    builtBy: 'article/experiments/build-surface-ladder.mjs',
    dataVersion: readFileSync(join(REPOSITORY_ROOT, 'training-data', 'VERSION'), 'utf8').trim(),
    heldOut: HELD_OUT,
    controls: CONTROLS,
    controlSeed: CONTROL_SEED,
    oracleVerification: {
      heldOutItems: HELD_OUT.length * HELD_OUT_PER_COMPOSITION,
      familyReferenceEqualsManifestOracle: HELD_OUT.length * HELD_OUT_PER_COMPOSITION,
      independentWalkEqualsOracle: allRows.length / RUNGS.length,
      l0EqualsShippedStatement: HELD_OUT.length * HELD_OUT_PER_COMPOSITION,
      controlsRoundTripThroughParse: CONTROLS.length * CONTROLS_PER_COMPOSITION
    },
    rungs: checks.tally,
    failures: checks.failures
  };
  writeFileSync(join(OUTPUT_DIRECTORY, 'checks.json'), JSON.stringify(summary, null, 2) + '\n');
  writeFileSync(join(OUTPUT_DIRECTORY, 'README.md'), readme(rowsByRung, checks));
  return { rowsByRung, checks };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { rowsByRung } = buildSurfaceLadder();
  for (const rung of RUNGS) process.stdout.write(`${rung}: ${rowsByRung[rung].length} items\n`);
}
