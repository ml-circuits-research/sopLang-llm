// Data-derived figures for the September 2026 portfolio revision; no image-generation model is used.
// Counts are read from the per-item evaluation records and from evidence/early-series-verification.json.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const registry = resolve(root, '../evaluation/registry');
const output = resolve(root, 'assets');
try {
  if (!execFileSync('convert', ['-version'], { encoding: 'utf8', timeout: 5000 }).includes('ImageMagick')) throw new Error('Unexpected executable');
} catch (cause) { throw new Error('Figure export requires the existing ImageMagick installation.', { cause }); }

const C = { ink: '#162c3a', muted: '#55636c', rule: '#b8c5cd', pale: '#f2f6f8', s1: '#7fb0d6', s2: '#3f7fb3', s3: '#17466b', rust: '#a64b25', teal: '#16776b' };
const xml = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const text = (x, y, value, size = 24, color = C.ink, weight = 400, anchor = 'start') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}" text-anchor="${anchor}">${xml(value)}</text>`;
const rect = (x, y, w, h, fill, stroke = 'none', r = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="1.5" rx="${r}"/>`;
const line = (x1, y1, x2, y2, color = C.rule, width = 2) => `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
const manifest = [];
async function save(name, width, height, content, description) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img"><title>${xml(description)}</title><rect width="100%" height="100%" fill="white"/><g font-family="DejaVu Sans,Arial,sans-serif">${content}</g></svg>`;
  const path = resolve(output, name + '.svg');
  await writeFile(path, svg);
  execFileSync('convert', ['-background', 'white', '-density', '660', path, '-units', 'PixelsPerInch', '-density', '1200', resolve(output, name + '.png')], { timeout: 30000 });
  manifest.push({ name, width, height, description });
}
const records = async experiment => (await readFile(resolve(registry, experiment, 'items/holdout.jsonl'), 'utf8')).trim().split('\n').map(line => JSON.parse(line));
const family = row => row.folder.split('/').at(-2);

// Figure: the plan-coverage ladder of the first full fine-tuning run at learning rate 1e-4.
const verification = JSON.parse(await readFile(resolve(root, 'evidence/early-series-verification.json')));
const ladder = verification.detail.ladderResults['exp-003-sft-lr1e-4'];
const winner = ladder.split.find(row => row.checkpoint === ladder.winner);
const holdout003 = await records('exp-003-sft-lr1e-4');
const rungs = [
  ['Trained program, new values', winner.seenMatch, winner.seen],
  ['Untrained program, trained type', winner.unseenMatch, winner.unseen],
  ['Type absent from training', holdout003.filter(r => r.class === 'answer_match').length, holdout003.length],
];
let ladderSvg = text(30, 44, 'Correct answers after fine-tuning (0.5B model)', 30, C.ink, 700);
const x0 = 470, scale = 6.2;
rungs.forEach(([label, n, d], i) => {
  const y = 95 + i * 92, value = 100 * n / d;
  ladderSvg += text(30, y + 32, label, 25) + text(30, y + 62, `${n} of ${d} problems`, 22, C.muted)
    + rect(x0, y + 8, Math.max(3, value * scale), 40, C.s3)
    + text(x0 + Math.max(3, value * scale) + 12, y + 38, Math.floor(value + 0.5) + '%', 25, C.ink, 700);
});
ladderSvg += line(x0, 380, x0 + 100 * scale, 380, C.rule, 1.5);
for (const p of [0, 50, 100]) ladderSvg += text(x0 + p * scale, 410, p + '%', 21, C.muted, 400, 'middle');
ladderSvg += text(30, 460, 'Every held-out program parsed as SOP Lang and formed a valid graph; wire bodies compile only when they run.', 22, C.muted);
await save('coverage-ladder', 1200, 480, ladderSvg, 'Accuracy falls from trained plans to untrained plans to untrained families');

// Figure: the vocabulary boundary under the composition-inventory curriculum.
const original = ['below-largest-add-rate', 'above-count-double', 'below-total-per-unit-subtract-rate', 'above-largest-add-rate'];
const census = ['above-total-modulo', 'above-total-percent-discount', 'above-third-largest-percent', 'keep-below-total-ratio'];
const slices = [
  ['Unseen compositions of taught operations', r => r.book === 'procedural-arithmetic' && original.includes(family(r))],
  ['Unseen compositions with a new operation', r => r.book === 'procedural-arithmetic' && census.includes(family(r))],
  ['Withheld type outside the inventory', r => family(r) === 'depletion-days-and-lead-time'],
  ['Book types outside the inventory', r => r.book !== 'procedural-arithmetic'],
];
const systems = [['0.5B, first inventory', 'exp-011-compositions', C.s1], ['0.5B, extended inventory', 'exp-012-census', C.s2], ['1.5B, extended inventory', 'exp-013-1.5b', C.s3]];
const rows = {};
for (const [, id] of systems) rows[id] = await records(id);
let boundary = text(30, 44, 'Held-out problems solved, by relation to the curriculum', 30, C.ink, 700);
systems.forEach(([label, , color], i) => { boundary += rect(30 + i * 380, 72, 26, 22, color, C.ink) + text(66 + i * 380, 91, label, 22); });
const bx = 500, bscale = 4.6;
slices.forEach(([label, test], i) => {
  const y = 130 + i * 150;
  boundary += text(30, y + 50, label, 23) ;
  systems.forEach(([, id, color], j) => {
    const selected = rows[id].filter(test), yy = y + j * 38;
    if (!selected.length) { boundary += text(bx + 8, yy + 26, 'not in this inventory', 20, C.muted); return; }
    const n = selected.filter(r => r.class === 'answer_match').length, value = 100 * n / selected.length;
    boundary += rect(bx, yy + 6, Math.max(3, value * bscale), 28, color, C.ink)
      + text(bx + Math.max(3, value * bscale) + 10, yy + 28, `${value.toFixed(value < 10 && value > 0 ? 1 : 0)}%  (${n} of ${selected.length})`, 20, C.ink);
  });
  if (i < slices.length - 1) boundary += line(30, y + 136, 1170, y + 136, C.pale, 2);
});
await save('vocabulary-boundary', 1200, 740, boundary, 'Generalization is complete within the taught operator vocabulary, partial for newly added operators, and absent outside it');

// Figure: held-out compositions solved as the wording moves away from the training generator.
// The same 24 held-out problems (the 8 compositions within the inventory-era runs' inventory, three
// instances each) at every wording, semantic level (exact, or accepted by both blind judges).
const comparisonDir = resolve(root, 'evidence/comparison');
const readLines = async path => (await readFile(path, 'utf8')).trim().split('\n').map(line => JSON.parse(line));
const verdictsOf = async letter => new Map((await readLines(resolve(comparisonDir, `judge-${letter}.jsonl`))).map(row => [row.jid, row.verdict]));
const judgeA = await verdictsOf('A'), judgeB = await verdictsOf('B');
const { createHash } = await import('node:crypto');
const jid = (directory, row) => createHash('sha256').update(`${directory}::${row.item}#${row.sample ?? 0}`).digest('hex').slice(0, 12);
const lateOperation = /(elapsed|path-exists|rectangle-area)/;
async function heldOutRate(directory) {
  const selected = (await readLines(resolve(registry, directory, 'items.jsonl'))).filter(row => row.split === 'held-out' && !lateOperation.test(row.item));
  const solved = selected.filter(row => row.class === 'answer_match' || (judgeA.get(jid(directory, row)) === 'same' && judgeB.get(jid(directory, row)) === 'same')).length;
  return { value: 100 * solved / selected.length, n: selected.length };
}
const wordings = ['Original', 'Paraphrase', 'Narrative'];
const series = [
  { label: '0.5B fine-tuned', color: C.s1, dash: '', points: [await heldOutRate('e2-l0-exp012-paired'), await heldOutRate('e2-l1-exp012-paired'), await heldOutRate('e2-l2-exp012-paired')] },
  { label: '1.5B fine-tuned', color: C.s2, dash: '', points: [await heldOutRate('e2-l0-exp013-paired'), await heldOutRate('e2-l1-exp013-paired'), await heldOutRate('e2-l2-exp013-paired')] },
  { label: '1.7B fine-tuned', color: C.s3, dash: '', points: [await heldOutRate('e2-l0-exp021-paired'), await heldOutRate('e2-l1-exp021-paired'), await heldOutRate('e2-l2-exp021-paired')] },
  { label: '1.7B untuned, JavaScript', color: C.rust, dash: '10 8', points: [await heldOutRate('e8-js1-l0-qwen3-17-paired'), null, await heldOutRate('e8-js1-l2-qwen3-17-paired')] },
  { label: 'Haiku and Sonnet, JavaScript', color: C.teal, dash: '4 6', points: [await heldOutRate('m-haiku-e8-l0-js'), null, await heldOutRate('m-haiku-e8-l2-js')], also: [await heldOutRate('m-sonnet-e8-l0-js'), null, await heldOutRate('m-sonnet-e8-l2-js')] },
];
const sx = [220, 450, 680], sy = value => 560 - value * 4.3;
let slopes = text(30, 44, 'Held-out compositions solved under rewording', 30, C.ink, 700)
  + text(30, 82, 'The same 24 problems at every wording; percent solved', 23, C.muted);
for (const p of [0, 25, 50, 75, 100]) slopes += line(170, sy(p), 720, sy(p), C.pale, 2) + text(155, sy(p) + 8, p + '%', 22, C.muted, 400, 'end');
wordings.forEach((label, i) => { slopes += text(sx[i], 602, label, 24, C.ink, 400, 'middle'); });
const labelY = [];
for (const s of series) {
  const known = s.points.map((point, i) => point && [sx[i], sy(point.value)]).filter(Boolean);
  slopes += `<path d="${known.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')}" fill="none" stroke="${s.color}" stroke-width="4" ${s.dash ? `stroke-dasharray="${s.dash}"` : ''}/>`;
  for (const [x, y] of known) slopes += `<circle cx="${x}" cy="${y}" r="7" fill="${s.color}"/>`;
  const last = s.points[2];
  let y = sy(last.value) + 7;
  while (labelY.some(other => Math.abs(other - y) < 30)) y += 30;
  labelY.push(y);
  const shown = [last, ...(s.also ? [s.also[2]] : [])].map(point => Math.floor(point.value + 0.5));
  const both = ` (${[...new Set(shown)].map(value => value + '%').join(' and ')})`;
  slopes += text(sx[2] + 24, y, s.label + both, 23, s.color, 700);
}
await save('rewording-slopes', 1200, 630, slopes, 'Fine-tuned small models lose held-out compositions when the same problems are reworded; the untuned 1.7B model writing JavaScript and two larger models do not');

const previous = JSON.parse(await readFile(resolve(output, 'figure-manifest.json')));
const names = new Set(manifest.map(entry => entry.name));
await writeFile(resolve(output, 'figure-manifest.json'), JSON.stringify([...previous.filter(entry => !names.has(entry.name)), ...manifest], null, 2) + '\n');
console.log(`Wrote ${manifest.length} portfolio figures.`);
