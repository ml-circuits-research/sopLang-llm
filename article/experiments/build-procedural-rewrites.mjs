#!/usr/bin/env node
/**
 * Build the item files of experiment E3, book problems in procedural wording
 * (article/experiments/no-training-plan.md, "The reverse direction").
 *
 * Inputs are the 100 held-out scheduling problems of the decompose-to-solve book
 * (`eval/no-knowledge/dependency-chain-and-join/*`) and the 20 held-out coalition
 * problems of the world-as-a-system book
 * (`eval/no-knowledge/negotiation-coalitions-and-agreement-grade-*`). Each book
 * statement is parsed with a strict pattern of its own wording, and the parsed
 * values are rendered by the `statement()` of the procedural family that teaches
 * the same shape (`dependency-chain-join` and `minimal-winning-coalition` in
 * `teacher/procedural/bookshapes.mjs`), so the rewrite is the training template
 * word for word with the book's numbers.
 *
 * The reference answer of both wordings stays the book item's manifest oracle
 * (the current data version). The build refuses to write unless, for every item,
 * the reference computed here from the parsed values equals the oracle's values,
 * the procedural family's own `parse` and `solve` recover the same values from
 * the rewrite, and the rewrite states exactly the numbers of the source.
 *
 * Output: evaluation/registry/items-e3/{original,procedural}.jsonl, checks.json, README.md.
 *
 * Usage: node article/experiments/build-procedural-rewrites.mjs
 */

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

import { bookShapeFamilies } from '../../teacher/procedural/bookshapes.mjs';
import { expectedAnswersOf, statementBodyOf } from '../../training-data/dataset-manifest.mjs';
import {
  checkSameNumbers,
  coalitionNumbers,
  coalitionReference,
  numbersIn,
  parseCoalitionOracle,
  parseScheduleOracle,
  scheduleReference,
  schedulingNumbers
} from './item-checks.mjs';

export const REPOSITORY_ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const OUTPUT_DIRECTORY = join(REPOSITORY_ROOT, 'evaluation', 'registry', 'items-e3');
const DATA_ROOT = join(REPOSITORY_ROOT, 'training-data');

const SCHEDULE_PATTERN = new RegExp([
  '^Five work packages A–E must be completed\\. A takes (\\d+) minutes\\. ',
  'B \\((\\d+) min\\) and C \\((\\d+) min\\) can start only after A but may then run in parallel\\. ',
  'D \\((\\d+) min\\) needs both B and C finished\\. E \\((\\d+) min\\) follows D\\. ',
  'A final safety or review buffer of (\\d+) minutes is mandatory, and the completion limit is (\\d+) minutes\\.\\n\\n',
  'Question\\. What is the earliest safe completion time, and does the plan meet the limit\\?$'
].join(''));
const COALITION_PATTERN = /Given facts\. Three groups have seats A=(\d+), B=(\d+), C=(\d+)\. A governing coalition needs at least (\d+) seats\. Any two groups may cooperate\./;

export const TYPES = Object.freeze({
  scheduling: {
    book: 'decompose-to-solve',
    split: 'held-out-scheduling',
    family: 'dependency-chain-join',
    expected: 100,
    folders: () => ['eval/no-knowledge/dependency-chain-and-join'],
    parseBook(statement) {
      const match = SCHEDULE_PATTERN.exec(statement);
      if (match === null) throw new Error('the scheduling statement does not follow the book wording');
      const [aMinutes, bMinutes, cMinutes, dMinutes, eMinutes, bufferMinutes, limitMinutes] = match.slice(1).map(Number);
      return { aMinutes, bMinutes, cMinutes, dMinutes, eMinutes, bufferMinutes, limitMinutes };
    },
    numbers: schedulingNumbers,
    verify(slots, oracle, family) {
      const reference = scheduleReference(slots);
      const expected = parseScheduleOracle(oracle);
      const own = family.solve(slots);
      return reference.minutes === expected.minutes && reference.feasible === expected.feasible &&
        own.minutes === expected.minutes && own.feasible === expected.feasible;
    }
  },
  coalition: {
    book: 'world-as-a-system',
    split: 'held-out-coalition',
    family: 'minimal-winning-coalition',
    expected: 20,
    folders: () => readdirSync(join(DATA_ROOT, 'world-as-a-system', 'eval', 'no-knowledge'))
      .filter((name) => name.startsWith('negotiation-coalitions-and-agreement-grade-'))
      .sort()
      .map((name) => `eval/no-knowledge/${name}`),
    parseBook(statement) {
      const match = COALITION_PATTERN.exec(statement);
      if (match === null) throw new Error('the coalition statement does not follow the book wording');
      const [a, b, c, threshold] = match.slice(1).map(Number);
      return { groups: [{ label: 'A', seats: a }, { label: 'B', seats: b }, { label: 'C', seats: c }], threshold };
    },
    numbers: coalitionNumbers,
    verify(slots, oracle, family) {
      const expected = parseCoalitionOracle(oracle);
      return isDeepStrictEqual(coalitionReference(slots), expected) && isDeepStrictEqual(family.solve(slots).winning, expected);
    }
  }
});

function familyOf(id) {
  const family = bookShapeFamilies.find((entry) => entry.id === id);
  if (family === undefined) throw new Error(`no procedural family ${id}`);
  return family;
}

function rowOf(type, name, folder, statement, oracle, wording) {
  return {
    book: TYPES[type].book,
    folder: wording === 'original' ? folder : `${folder}-procedural`,
    plan: null,
    category: 'no-knowledge',
    statement,
    oracle,
    split: TYPES[type].split,
    type: name,
    rung: wording
  };
}

/** Every item of one type: the original row, the rewrite row, and the check record. */
function buildType(type) {
  const spec = TYPES[type];
  const family = familyOf(spec.family);
  const bookRoot = join(DATA_ROOT, spec.book);
  const oracles = expectedAnswersOf(bookRoot);
  const original = [];
  const procedural = [];
  const records = [];
  for (const parent of spec.folders()) {
    for (const leaf of readdirSync(join(bookRoot, parent)).sort()) {
      const folder = `${parent}/${leaf}`;
      const statement = statementBodyOf(readFileSync(join(bookRoot, folder, 'problem.md'), 'utf8')).trimEnd();
      const expected = oracles.get(folder);
      if (expected === undefined) throw new Error(`no manifest row for ${spec.book}/${folder}`);
      const slots = spec.parseBook(statement);
      const rewrite = family.statement(slots);
      const failures = [];
      if (!spec.verify(slots, expected.answer, family)) failures.push(`the reference computed from the slots differs from the oracle "${expected.answer}"`);
      if (!isDeepStrictEqual(family.parse(rewrite), slots)) failures.push('the procedural family does not parse the rewrite back to the book values');
      failures.push(...checkSameNumbers(statement, rewrite));
      const stated = numbersIn(statement).filter((value) => spec.numbers(slots).includes(value));
      if (stated.length !== numbersIn(statement).length) failures.push('the book statement states a number the parse did not read');
      records.push({ folder, oracle: expected.answer, failures });
      original.push(rowOf(type, spec.family, folder, statement, expected.answer, 'original'));
      procedural.push(rowOf(type, spec.family, folder, rewrite, expected.answer, 'procedural'));
    }
  }
  if (original.length !== spec.expected) throw new Error(`${type}: ${original.length} items, expected ${spec.expected}`);
  return { original, procedural, records };
}

function rangeNote(rows) {
  const values = rows.map((row) => numbersIn(row.statement));
  const durations = values.flatMap((numbers) => numbers.slice(0, 5));
  const buffers = values.map((numbers) => numbers[5]);
  const limits = values.map((numbers) => numbers[6]);
  const span = (list) => `${Math.min(...list)} to ${Math.max(...list)}`;
  const wide = durations.filter((value) => value > 12).length;
  return `- The book package durations range from ${span(durations)} minutes (${wide} of ${durations.length} durations exceed 12), the buffers from ${span(buffers)} minutes, and the limits from ${span(limits)} minutes, while the procedural sampler draws durations of 3 to 12 minutes and buffers of 2 to 6 minutes, so the rewrite keeps the template wording but not the number range the template was trained on.`;
}

function readme(built, failures) {
  const lines = [
    '# Experiment E3 items: book problems in procedural wording',
    '',
    'Built by `article/experiments/build-procedural-rewrites.mjs` for experiment E3 of `article/experiments/no-training-plan.md`. No model was run to build these files.',
    '',
    '## Construction',
    '',
    '- Sources: the 100 held-out scheduling problems of `training-data/decompose-to-solve/eval/no-knowledge/dependency-chain-and-join/*` and the 20 held-out coalition problems of `training-data/world-as-a-system/eval/no-knowledge/negotiation-coalitions-and-agreement-grade-{1..4}/*`. `original.jsonl` holds their statements unchanged (the `problem.md` body after the heading, trailing newline removed).',
    '- Rewrites: each book statement is parsed with a strict pattern of the book wording, and the values are rendered by the `statement()` of the procedural family that teaches the shape in `teacher/procedural/bookshapes.mjs` (`dependency-chain-join`, `minimal-winning-coalition`), so the rewrite is that training template word for word. The book\'s "Knowledge context" and "Rules" paragraphs of the coalition items and the "safety or review buffer" wording of the scheduling items are replaced by the template\'s own sentences; no number changes.',
    '- Oracle: both wordings keep the book item\'s manifest oracle (data version ' + built.dataVersion + '), for example `46 minutes: not feasible.` and `AB with 8 seats; AC with 8 seats; BC with 6 seats.`. The procedural types\' own answer sentences ("The earliest safe completion time is 46 minutes, so the plan is not feasible. ...") are not the oracle; the restricted parsers of the evaluation read the values.',
    '- Row shape: `book`, `folder` (the book folder for `original`, the book folder plus `-procedural` for the rewrite), `plan` (null), `category`, `statement`, `oracle`, `split` (`held-out-scheduling` or `held-out-coalition`, so `evaluation/run-items.mjs` summarises the two types separately), `type` (the procedural family), and `rung` (`original` or `procedural`).',
    '',
    '## Checks (`checks.json`)',
    '',
    '- The earliest safe completion time (A + max(B, C) + D + E + buffer) and the verdict (time <= limit), computed here and by the procedural family\'s `solve`, equal the minutes and the verdict of the oracle.',
    '- The minimal winning coalitions (bitmask enumeration: winning when the seats reach the threshold, minimal when removing any member loses) and their seat counts, computed here and by the procedural family\'s `solve`, equal the oracle list in order.',
    '- The procedural family\'s `parse` recovers exactly the book values from the rewrite, and the rewrite states exactly the numbers of the source statement, with multiplicity.',
    '',
    '## Counts',
    '',
    '| file | scheduling | coalition | total |',
    '| --- | --- | --- | --- |',
    `| original.jsonl | ${built.scheduling.original.length} | ${built.coalition.original.length} | ${built.scheduling.original.length + built.coalition.original.length} |`,
    `| procedural.jsonl | ${built.scheduling.procedural.length} | ${built.coalition.procedural.length} | ${built.scheduling.procedural.length + built.coalition.procedural.length} |`,
    '',
    `Check failures: ${failures}.`,
    '',
    '## Known limitations',
    '',
    rangeNote(built.scheduling.original),
    '- Some coalition items have a single-group minimal winning coalition (for example `A with 6 seats.`); the book says "Any two groups may cooperate" and the procedural template does not, which does not change the answer.',
    '',
    '## Examples'
  ];
  for (const type of ['scheduling', 'coalition']) {
    for (const index of [0, built[type].original.length - 1]) {
      const source = built[type].original[index];
      const rewrite = built[type].procedural[index];
      lines.push('', `- \`${source.book}/${source.folder}\`, oracle \`${source.oracle}\``, '', '  original:', '', ...source.statement.split('\n').map((line) => `  > ${line}`), '', '  procedural:', '', `  > ${rewrite.statement}`);
    }
  }
  return `${lines.join('\n')}\n`;
}

export function buildProceduralRewrites() {
  const built = {
    dataVersion: readFileSync(join(DATA_ROOT, 'VERSION'), 'utf8').trim(),
    scheduling: buildType('scheduling'),
    coalition: buildType('coalition')
  };
  const records = [...built.scheduling.records, ...built.coalition.records];
  const failed = records.filter((record) => record.failures.length > 0);
  if (failed.length > 0) throw new Error(`${failed.length} items fail the checks, e.g. ${JSON.stringify(failed.slice(0, 3), null, 2)}`);
  mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
  for (const wording of ['original', 'procedural']) {
    const rows = [...built.scheduling[wording], ...built.coalition[wording]];
    writeFileSync(join(OUTPUT_DIRECTORY, `${wording}.jsonl`), rows.map((row) => JSON.stringify(row)).join('\n') + '\n');
  }
  const summary = {
    experiment: 'E3',
    builtBy: 'article/experiments/build-procedural-rewrites.mjs',
    dataVersion: built.dataVersion,
    counts: { scheduling: built.scheduling.original.length, coalition: built.coalition.original.length },
    checks: {
      referenceEqualsOracle: { passed: records.length, failed: 0 },
      familyParseRecoversValues: { passed: records.length, failed: 0 },
      sameNumbersAsSource: { passed: records.length, failed: 0 }
    },
    verdicts: {
      schedulingFeasible: built.scheduling.original.filter((row) => row.oracle.endsWith(': feasible.')).length,
      schedulingNotFeasible: built.scheduling.original.filter((row) => row.oracle.endsWith(': not feasible.')).length
    },
    failures: []
  };
  writeFileSync(join(OUTPUT_DIRECTORY, 'checks.json'), JSON.stringify(summary, null, 2) + '\n');
  writeFileSync(join(OUTPUT_DIRECTORY, 'README.md'), readme(built, failed.length));
  return built;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const built = buildProceduralRewrites();
  process.stdout.write(`scheduling: ${built.scheduling.original.length} items, coalition: ${built.coalition.original.length} items, each in original and procedural wording\n`);
}
