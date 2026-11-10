// Size of the generated programs for the held-out path-question type before and after the graphPath command
// (Informatica, Section 5.2): computation wires and non-blank, non-comment body lines, over all 40 problems.
// Usage: node article/scripts/graphpath-program-size.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { parseCircuit } from '../../runtime/parser.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const TYPE = /below-largest-path-exists/;
for (const [run, label] of [['exp-014-deep-chains', '1.5B, before the command'], ['exp-016-wires', '1.5B, with the command']]) {
  const rows = readFileSync(resolve(root, 'evaluation/registry', run, 'items/holdout.jsonl'), 'utf8').split('\n').filter(Boolean)
    .map((line) => JSON.parse(line)).filter((row) => TYPE.test(row.folder));
  let wires = 0, lines = 0, searchLines = 0, commandUses = 0;
  for (const row of rows) {
    const computation = parseCircuit(row.completion).wires.filter((wire) => wire.command !== 'literal');
    wires += computation.length;
    for (const wire of computation) {
      const code = wire.body.split('\n').filter((line) => line.trim() && !line.trim().startsWith('//'));
      lines += code.length;
      if (wire.command === 'graphPath') commandUses++;
      // The inline breadth-first search: from the adjacency map to the end of the traversal loop.
      const start = code.findIndex((line) => /new Map\(\)/.test(line)), end = code.findIndex((line) => /\? "yes" : "no"/.test(line));
      if (start >= 0 && end > start) searchLines += end - start;
    }
  }
  const n = rows.length;
  console.log(`${run} (${label}): ${n} programs, correct ${rows.filter((row) => row.class === 'answer_match').length}; computation wires per program ${(wires / n).toFixed(1)}; body lines per program ${(lines / n).toFixed(1)}; inline search lines per program ${(searchLines / n).toFixed(1)}; programs declaring graphPath ${commandUses}`);
}
