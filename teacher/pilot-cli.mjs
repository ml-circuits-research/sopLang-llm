/**
 * Pilot command line.
 *
 * Usage:
 *   node teacher/pilot-cli.mjs --verify --chapters 1,2   verify families without writing artifacts
 *   node teacher/pilot-cli.mjs --out /tmp/pilot-subset --chapters 1   write a subset to its own root
 *   node teacher/pilot-cli.mjs                           verify and write the whole book
 *
 * The verifier is the loop a family author runs while writing a chapter: it
 * prints one line per problem with the acceptance decision and the rejection
 * reason, so a wrong parse or a wrong answer format is visible immediately.
 *
 * The canonical dataset root is only ever rewritten by a full-book run. A
 * subset run (`--chapters` or `--limit`) must name its own `--out` root,
 * because a partial run would otherwise clobber the complete dataset with a
 * smaller one. Malformed values are refused before any extraction or write.
 */

import { runPilot } from './pilot.mjs';

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
      '  node teacher/pilot-cli.mjs --verify [--chapters 1,2]',
      '  node teacher/pilot-cli.mjs --out <dir> [--chapters 1,2] [--limit N]',
      '  node teacher/pilot-cli.mjs',
      ''
    ].join('\n')
  );
  process.exit(0);
}

const chaptersArgument = option('chapters');
let chapters = null;
if (chaptersArgument !== null) {
  if (!/^\d+(,\d+)*$/.test(chaptersArgument.trim())) {
    fail(`--chapters takes a comma-separated list of chapter numbers, not "${chaptersArgument}".`);
  }
  chapters = chaptersArgument.split(',').map((value) => Number(value.trim()));
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
const subset = chapters !== null || limit !== null;
if (!verify && subset && out === null) {
  fail('a subset run rewrites only its own root: pass --out <dir>, or run without --chapters/--limit to rebuild the whole dataset.');
}

let result;
try {
  result = await runPilot({
    chapters,
    limit,
    write: !verify,
    verbose: flag('verbose') || chaptersArgument !== null,
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
  `accepted ${result.accepted.length}, rejected ${result.rejected.length}, eval ${result.split.size}\n`
);
for (const [reason, count] of [...reasons].sort()) {
  process.stdout.write(`  reject ${reason}: ${count}\n`);
}
