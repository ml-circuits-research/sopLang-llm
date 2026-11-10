// Builds paired item files, so every wording of a problem is scored on the same instances, and seeds
// paired run directories with records already produced for those exact items (no re-generation).
// E2/E8: 3 instances per composition, identical at L0, L1, L2. E3: the same book problems in both wordings.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const registry = fileURLToPath(new URL('../../evaluation/registry/', import.meta.url));
const read = (path) => existsSync(path) ? readFileSync(path, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line)) : [];
const idOf = (row) => row.id ?? `${row.book}/${row.folder}`;
const hash = (text) => createHash('sha256').update(text).digest('hex');

// E2: base instance = folder without the rung suffix; prefer instances already scored in most rungs.
const rungs = ['L0', 'L1', 'L2'];
const items = Object.fromEntries(rungs.map((rung) => [rung, read(resolve(registry, `items-e2/${rung}.jsonl`))]));
const baseOf = (row) => idOf(row).replace(/-L\d$/, '');
const scored = {};
for (const dir of readdirSync(registry).filter((name) => /^e[28]-.*-l[012]-?/.test(name) || /^e2-l[012]-/.test(name))) {
  for (const row of read(resolve(registry, dir, 'items.jsonl'))) (scored[row.item.replace(/-L\d$/, '')] ??= new Set()).add(dir);
}
const byComposition = {};
for (const row of items.L0) (byComposition[`${row.composition}:${row.split}`] ??= []).push(baseOf(row));
const chosen = new Set();
for (const bases of Object.values(byComposition)) {
  bases.sort((a, b) => (scored[b]?.size ?? 0) - (scored[a]?.size ?? 0) || hash(a).localeCompare(hash(b)));
  bases.slice(0, 3).forEach((base) => chosen.add(base));
}
mkdirSync(resolve(registry, 'items-e2/paired'), { recursive: true });
for (const rung of rungs) {
  const rows = items[rung].filter((row) => chosen.has(baseOf(row)));
  writeFileSync(resolve(registry, `items-e2/paired/${rung}.jsonl`), rows.map((row) => JSON.stringify(row)).join('\n') + '\n');
}
// E3: the book problems scored in the original wording, and the same problems in procedural wording.
const e3 = { original: read(resolve(registry, 'items-e3/original.jsonl')), procedural: read(resolve(registry, 'items-e3/procedural.jsonl')) };
const e3Base = (row) => idOf(row).replace(/-procedural$/, '');
const e3Chosen = new Set(read(resolve(registry, 'e3-original-exp021/items.jsonl')).map((row) => row.item.replace(/-procedural$/, '')));
mkdirSync(resolve(registry, 'items-e3/paired'), { recursive: true });
for (const wording of ['original', 'procedural']) {
  writeFileSync(resolve(registry, `items-e3/paired/${wording}.jsonl`), e3[wording].filter((row) => e3Chosen.has(e3Base(row))).map((row) => JSON.stringify(row)).join('\n') + '\n');
}
// Seed paired directories (<dir> -> <dir>-paired) with existing records of the chosen items.
let seeded = 0;
for (const dir of readdirSync(registry).filter((name) => /^(e2-l[012]-|e8-[a-z0-9]+-l[02]-|e3-(original|procedural)-)/.test(name) && !name.endsWith('-paired'))) {
  const wanted = dir.startsWith('e3-') ? (row) => e3Chosen.has(row.item.replace(/-procedural$/, '')) : (row) => chosen.has(row.item.replace(/-L\d$/, ''));
  const rows = read(resolve(registry, dir, 'items.jsonl')).filter(wanted);
  mkdirSync(resolve(registry, `${dir}-paired`), { recursive: true });
  writeFileSync(resolve(registry, `${dir}-paired`, 'items.jsonl'), rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
  seeded += rows.length;
}
console.log(`E2 paired instances: ${chosen.size} per rung; E3 paired problems: ${e3Chosen.size}; records reused: ${seeded}`);
