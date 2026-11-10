// Whole-number guards in the training programs, per book, before and after the final data version relaxed them
// (Informatica, Section 5.4). A guard is a probe(...) call whose condition uses Number.isInteger.
// Reads training/data/all-books.jsonl at the commits whose SHA-256 equals the runs' recorded dataset_sha256.
// Usage: node article/scripts/whole-number-guards.mjs
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const VERSIONS = [['dv5 probe clean-up', '6f950605c'], ['dv12 statement simplification (exp-025)', 'e494ddbf5'], ['dv13 final data (exp-026, exp-027)', 'df3602594']];
const GUARD = /probe\([^;]*Number\.isInteger/g;
for (const [label, commit] of VERSIONS) {
  const rows = execFileSync('git', ['show', `${commit}:training/data/all-books.jsonl`], { cwd: root, maxBuffer: 1 << 30, encoding: 'utf8' })
    .split('\n').filter(Boolean).map((line) => JSON.parse(line));
  const perBook = {};
  for (const row of rows) {
    const program = row.messages.find((message) => message.role === 'assistant').content;
    const book = row.meta.book;
    perBook[book] ??= { programs: 0, withGuard: 0 };
    perBook[book].programs++;
    if ((program.match(GUARD) ?? []).length > 0) perBook[book].withGuard++;
  }
  const bookDerived = Object.entries(perBook).filter(([book]) => book !== 'procedural-arithmetic');
  const total = bookDerived.reduce((sum, [, value]) => sum + value.withGuard, 0);
  console.log(`${label} @ ${commit}: book-derived programs with a whole-number guard ${total}; ${bookDerived.map(([book, value]) => `${book} ${value.withGuard}/${value.programs}`).join(', ')}; procedural ${perBook['procedural-arithmetic'].withGuard}/${perBook['procedural-arithmetic'].programs}`);
}
