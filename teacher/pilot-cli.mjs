/**
 * Pilot command line.
 *
 * Usage:
 *   node teacher/pilot-cli.mjs --verify --chapters 1,2            verify families without writing artifacts
 *   node teacher/pilot-cli.mjs --out /tmp/pilot-subset --chapters 1   write a subset to its own root
 *   node teacher/pilot-cli.mjs --book world-as-a-system --verify --families G3
 *   node teacher/pilot-cli.mjs                                    verify and write every registered book
 *
 * The verifier is the loop a family author runs while writing a unit: it prints
 * one line per problem with the acceptance decision and the rejection reason, so
 * a wrong parse or a wrong answer format is visible immediately.
 *
 * A unit is a chapter number for the mathematical book and a reasoning-family
 * code for the world book. The canonical dataset roots are only ever rewritten
 * by a full-book run. A subset run (`--chapters`, `--families`, or `--limit`)
 * must name its own `--out` root, because a partial run would otherwise clobber
 * the complete dataset with a smaller one. Malformed values are refused before
 * any extraction or write.
 */

import { runPilot } from './pilot.mjs';
import { DEFAULT_SOURCE_ID, getSource, sourceIds } from './sources/index.mjs';

const argumentsList = process.argv.slice(2);

function flag(name) {
  return argumentsList.includes(`--${name}`);
}

function option(name) {
  const index = argumentsList.indexOf(`--${name}`);
  return index === -1 ? null : argumentsList[index + 1];
}

function fail(message) {
  process.stderr.write(`pilot-cli: ${message}\n`);
  process.exit(1);
}

if (flag('help') || flag('h')) {
  process.stdout.write(
    [
      'Usage:',
      '  node teacher/pilot-cli.mjs [--book <id>] --verify [--chapters 1,2 | --families G1,G2]',
      '  node teacher/pilot-cli.mjs [--book <id>] --out <dir> [--chapters 1,2 | --families G1,G2] [--limit N]',
      '  node teacher/pilot-cli.mjs [--book <id>]',
      '',
      `Books: ${sourceIds().join(', ')} (default ${DEFAULT_SOURCE_ID}).`,
      'A unit is a chapter number for mathematical-thinking and a family code',
      '(for example G3 or N12) for world-as-a-system.',
      ''
    ].join('\n')
  );
  process.exit(0);
}

const bookId = option('book') ?? DEFAULT_SOURCE_ID;
let source;
try {
  source = getSource(bookId);
} catch (error) {
  fail(error.message);
}

const chaptersArgument = option('chapters');
const familiesArgument = option('families');
if (chaptersArgument !== null && familiesArgument !== null) {
  fail('--chapters and --families select the same thing; pass one of them.');
}

let units = null;
if (chaptersArgument !== null) {
  if (source.unitKind !== 'number') {
    fail(`book ${source.id} is organized in ${source.unitNoun}; use --families <codes> instead of --chapters.`);
  }
  if (!/^\d+(,\d+)*$/.test(chaptersArgument.trim())) {
    fail(`--chapters takes a comma-separated list of ${source.unitNoun}, not "${chaptersArgument}".`);
  }
  units = chaptersArgument.split(',').map((value) => Number(value.trim()));
} else if (familiesArgument !== null) {
  if (source.unitKind !== 'code') {
    fail(`book ${source.id} is organized in ${source.unitNoun}; use --chapters <numbers> instead of --families.`);
  }
  if (!/^[A-Za-z]\d{1,2}(,[A-Za-z]\d{1,2})*$/.test(familiesArgument.trim())) {
    fail(`--families takes a comma-separated list of family codes such as G3,N12, not "${familiesArgument}".`);
  }
  units = familiesArgument.split(',').map((value) => value.trim().toUpperCase());
}

const limitArgument = option('limit');
let limit = null;
if (limitArgument !== null) {
  if (!/^\d+$/.test(limitArgument.trim()) || Number(limitArgument) === 0) {
    fail(`--limit takes a positive integer, not "${limitArgument}".`);
  }
  limit = Number(limitArgument);
}

const verify = flag('verify');
const out = option('out');
const subset = units !== null || limit !== null;
if (!verify && subset && out === null) {
  fail('a subset run rewrites only its own root: pass --out <dir>, or run without --chapters/--families/--limit to rebuild the whole dataset.');
}

let result;
try {
  result = await runPilot({
    book: source.id,
    units,
    limit,
    write: !verify,
    verbose: flag('verbose') || units !== null,
    ...(out === null ? {} : { outputRoot: out })
  });
} catch (error) {
  fail(error.message);
}

const reasons = new Map();
for (const item of result.rejected) {
  const reason = item.reason.split(':')[0];
  reasons.set(reason, (reasons.get(reason) ?? 0) + 1);
}
process.stdout.write(
  `${source.id}: accepted ${result.accepted.length}, rejected ${result.rejected.length}, eval ${result.split.size}\n`
);
for (const [reason, count] of [...reasons].sort()) {
  process.stdout.write(`  reject ${reason}: ${count}\n`);
}
