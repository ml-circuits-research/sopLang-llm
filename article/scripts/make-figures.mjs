// Exact, data-derived publication figures; no image-generation model is used.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
try {
  if (!execFileSync('convert', ['-version'], { encoding: 'utf8', timeout: 5000 }).includes('ImageMagick')) throw new Error('Unexpected executable');
} catch (cause) { throw new Error('Figure export requires the existing ImageMagick installation; see the skill dependency record.', { cause }); }
const evidence = JSON.parse(await readFile(resolve(root, 'evidence/results.json')));
const output = resolve(root, 'assets');
await mkdir(output, { recursive: true });
const C = { ink: '#162c3a', blue: '#225e88', teal: '#16776b', rust: '#a64b25', gray: '#63717b', pale: '#f2f6f8', rule: '#b8c5cd' };
const xml = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const text = (x, y, value, size = 26, color = C.ink, weight = 400, anchor = 'start', mono = false) => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}" text-anchor="${anchor}"${mono ? ' font-family="DejaVu Sans Mono,monospace"' : ''}>${xml(value)}</text>`;
const lines = (x, y, values, size = 26, color = C.ink, weight = 400, gap = 36) => values.map((value, i) => text(x, y + gap * i, value, size, color, weight)).join('');
const rect = (x, y, width, height, fill = C.pale, stroke = 'none', radius = 6) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" stroke="${stroke}" stroke-width="2" rx="${radius}"/>`;
const line = (x1, y1, x2, y2, color = C.rule, width = 2) => `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
function arrowHead(x1, y1, x2, y2) {
  const angle = Math.atan2(y2 - y1, x2 - x1), length = 15, half = 7;
  const bx = x2 - length * Math.cos(angle), by = y2 - length * Math.sin(angle);
  const points = [[x2, y2], [bx + half * Math.sin(angle), by - half * Math.cos(angle)], [bx - half * Math.sin(angle), by + half * Math.cos(angle)]];
  return '<polygon points="' + points.map(point => point.join(',')).join(' ') + '" fill="' + C.ink + '"/>';
}
const arrow = (x1, y1, x2, y2) => line(x1, y1, x2, y2, C.ink, 2.6) + arrowHead(x1, y1, x2, y2);
function pathArrow(d) {
  let x = 0, y = 0, px = 0, py = 0;
  for (const match of d.matchAll(/([MLHV])([\d .-]+)/g)) {
    const numbers = match[2].trim().split(/\s+/).map(Number);
    px = x; py = y;
    if (match[1] === 'M' || match[1] === 'L') [x, y] = numbers;
    if (match[1] === 'H') x = numbers[0];
    if (match[1] === 'V') y = numbers[0];
  }
  return '<path d="' + d + '" fill="none" stroke="' + C.ink + '" stroke-width="2.6"/>' + arrowHead(px, py, x, y);
}
const pct = (n, total, digits = 1) => (100 * n / total).toFixed(digits) + '%';
const arm = prefix => evidence.arms.find(value => value.id.startsWith(prefix));
const assets = [];
async function save(name, width, height, content, description) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img"><title>${xml(description)}</title><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="${C.ink}"/></marker></defs><rect width="100%" height="100%" fill="white"/><g font-family="DejaVu Sans,Arial,sans-serif">${content}</g></svg>`;
  const path = resolve(output, name + '.svg');
  await writeFile(path, svg);
  execFileSync('convert', ['-background', 'white', '-density', '660', path, '-units', 'PixelsPerInch', '-density', '1200', resolve(output, name + '.png')], { timeout: 30000 });
  assets.push({ name, width, height, description });
}
function node(x, y, label, r = 28) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="white" stroke="${C.blue}" stroke-width="3"/>` + text(x, y + 10, label, 30, C.blue, 700, 'middle');
}
function graph(xs, y, directed = false) {
  return (directed ? arrow(xs[1] - 32, y, xs[0] + 34, y) + arrow(xs[2] - 32, y, xs[1] + 34, y)
    : line(xs[0] + 30, y, xs[1] - 30, y, C.blue, 3) + line(xs[1] + 30, y, xs[2] - 30, y, C.blue, 3))
    + xs.map((x, i) => node(x, y, ['A', 'B', 'C'][i])).join('');
}

await save('sop-program-anatomy', 1200, 535,
  text(30, 42, 'A complete compiled solution', 32, C.ink, 700)
  + rect(30, 68, 1140, 60) + text(50, 107, 'Problem: three packs, four cells per pack. How many cells?', 28)
  + text(48, 173, 'GENERATED PROGRAM', 22, C.gray, 700)
  + rect(30, 191, 745, 239, '#f6f8fa')
  + text(50, 235, '@slots literal', 28, C.blue, 700, 'start', true)
  + text(50, 277, '{"packs":3,"perPack":4}', 28, C.ink, 400, 'start', true)
  + text(50, 349, '@answer jsEval', 28, C.blue, 700, 'start', true)
  + text(50, 391, 'return $slots.packs * $slots.perPack;', 28, C.ink, 400, 'start', true)
  + text(835, 173, 'VALUE DEPENDENCY', 22, C.gray, 700)
  + rect(830, 193, 340, 82, '#e8f1f7', C.blue)
  + text(1000, 226, 'slots', 28, C.blue, 700, 'middle') + text(1000, 257, 'packs = 3; perPack = 4', 24, C.ink, 400, 'middle')
  + arrow(1000, 281, 1000, 336) + text(1020, 316, '$slots', 24, C.blue, 400, 'start', true)
  + rect(830, 345, 340, 85, '#e8f4ef', C.teal)
  + text(1000, 379, 'answer', 28, C.teal, 700, 'middle') + text(1000, 413, '3 × 4 = 12', 28, C.ink, 400, 'middle')
  + text(32, 477, '@name command starts a wire; its body follows on the next line.', 26)
  + text(32, 517, '$name reads a value. The reference determines execution order.', 26),
  'SOP Lang declaration, body, value reference, and dependency for a complete arithmetic example');

await save('sop-program-anatomy-narrow', 600, 710,
  lines(25, 37, ['Three packs × four cells', 'What program returns the total?'], 28, C.ink, 700, 37)
  + rect(20, 104, 560, 285, '#f6f8fa')
  + text(40, 147, '@slots literal', 26, C.blue, 700, 'start', true)
  + text(40, 187, '{"packs":3,"perPack":4}', 26, C.ink, 400, 'start', true)
  + text(40, 252, '@answer jsEval', 26, C.blue, 700, 'start', true)
  + text(40, 292, 'return $slots.packs', 26, C.ink, 400, 'start', true)
  + text(40, 332, '  * $slots.perPack;', 26, C.ink, 400, 'start', true)
  + lines(25, 430, ['@name command: declaration', 'Body: JSON or JavaScript here', '$slots: read the named value'], 25, C.ink, 400, 38)
  + rect(25, 550, 225, 96, '#e8f1f7', C.blue) + rect(350, 550, 225, 96, '#e8f4ef', C.teal)
  + text(138, 585, 'slots', 28, C.blue, 700, 'middle') + text(138, 625, '3 and 4', 26, C.ink, 400, 'middle')
  + arrow(260, 598, 340, 598)
  + text(462, 585, 'answer', 28, C.teal, 700, 'middle') + text(462, 625, '12', 28, C.ink, 400, 'middle')
  + text(25, 690, 'Runtime order follows the reference.', 25),
  'Column-width guide to declarations, bodies, value references, and execution order');

await save('reachability-contract', 600, 565,
  text(25, 42, 'Question: can A reach C?', 30, C.ink, 700)
  + text(25, 101, 'SUPPORTED: undirected links', 25, C.blue, 700)
  + graph([100, 300, 500], 167) + text(300, 241, 'A can reach C: yes', 28, C.blue, 700, 'middle')
  + line(25, 276, 575, 276)
  + text(25, 318, 'EXCLUDED: direction matters', 25, C.rust, 700)
  + graph([100, 300, 500], 382, true) + text(300, 456, 'A can reach C: no', 28, C.rust, 700, 'middle')
  + lines(25, 510, ['graphPath represents undirected links.', 'Dropping direction changes the task.'], 24, C.ink, 400, 35),
  'Undirected and directed reachability require different command semantics');

function pairedBars(x, y, title, labels, values, denominator, color) {
  const bx = x + 215, bw = 225;
  let result = text(x, y, title, 25, C.ink, 700);
  values.forEach((value, i) => {
    const yy = y + 29 + i * 50;
    result += text(x, yy + 25, labels[i], 23) + rect(bx, yy, bw * value / denominator, 31, i ? color : C.gray, 'none', 0)
      + text(bx + bw * value / denominator + 10, yy + 25, pct(value, denominator), 24, i ? color : C.gray, 700);
  });
  result += line(bx, y + 123, bx + bw, y + 123);
  for (const p of [0, 50, 100]) result += line(bx + bw * p / 100, y + 123, bx + bw * p / 100, y + 130)
    + text(bx + bw * p / 100, y + 154, p + '%', 20, C.gray, 400, 'middle');
  return result;
}
const a0 = arm('exp-014'), a1 = arm('exp-016'), b0 = arm('exp-021'), b1 = arm('exp-022');
await save('abstraction-comparison', 1200, 665,
  text(30, 43, 'A  Add specialized commands', 30, C.blue, 700)
  + text(630, 43, 'B  Split target programs', 30, C.rust, 700)
  + text(30, 85, 'Same base within each pair', 24, C.gray)
  + text(630, 85, 'Same tasks within each pair', 24, C.gray)
  + line(595, 24, 595, 640)
  + pairedBars(30, 143, 'Exact match · 705 problems', ['General code', 'Specialized wires'], [a0.classes.answer_match, a1.classes.answer_match], 705, C.blue)
  + pairedBars(630, 143, 'Exact match · 705 problems', ['Compact targets', 'Split targets'], [b0.classes.answer_match, b1.classes.answer_match], 705, C.rust)
  + pairedBars(30, 361, 'Execution failure · 480 procedural tasks', ['General code', 'Specialized wires'], [a0.books['procedural-arithmetic'].classes.execution_error, a1.books['procedural-arithmetic'].classes.execution_error], 480, C.blue)
  + pairedBars(630, 361, 'Execution failure · 705 problems', ['Compact targets', 'Split targets'], [b0.classes.execution_error, b1.classes.execution_error], 705, C.rust)
  + rect(25, 557, 550, 87, '#e8f1f7') + lines(43, 591, ['+8.7 percentage points in exact match', '−10.4 points in procedural failures'], 24, C.blue, 700, 33)
  + rect(625, 557, 550, 87, '#fcf0e8') + lines(643, 591, ['−1.7 percentage points in exact match', '+11.1 points in execution failures'], 24, C.rust, 700, 33),
  'Paired percentages for abstraction and decomposition with denominators and direct condition labels');

await save('wire-discovery-design', 1200, 625,
  text(30, 43, 'Proposed test of one new executable abstraction', 32, C.ink, 700)
  + rect(30, 74, 1140, 65) + text(52, 115, 'Shared base revision, training-token budget, checkpoint rule, and decoding', 27)
  + arrow(385, 142, 385, 174) + arrow(850, 142, 850, 174)
  + rect(170, 185, 430, 147, '#e8f1f7', C.blue)
  + lines(190, 222, ['Target A: generate the algorithm', 'JavaScript scheduling code', 'Durations + predecessor relations'], 25, C.blue, 400, 40)
  + rect(635, 185, 430, 147, '#e8f4ef', C.teal)
  + lines(655, 222, ['Target B: select the operation', 'A dependency-join command', 'The same durations and relations'], 25, C.teal, 400, 40)
  + pathArrow('M385 338 V385 H850 V424') + arrow(850, 338, 850, 380)
  + text(45, 380, 'Train several seeds', 25, C.gray)
  + rect(30, 445, 350, 112, 'white', C.ink)
  + lines(50, 474, ['Sealed transfer families', 'Not used for', 'command design'], 24, C.ink, 700, 33)
  + arrow(387, 500, 437, 500)
  + rect(445, 440, 725, 128, C.pale)
  + lines(465, 475, ['Compare task correctness and error types', 'Wrong operation · wrong arguments · execution failure', 'Also measure generated length and computational cost'], 24, C.ink, 400, 35)
  + text(30, 608, 'Candidate design uses development failures; transfer results test the frozen choice.', 25, C.gray),
  'A future paired experimental design separates command development from sealed transfer evaluation');

const cohort = evidence.comparisons.find(row => row.left.startsWith('exp-021') && row.right.startsWith('exp-027'));
await save('claim-evidence-map', 1200, 650,
  text(30, 45, 'The artifact needed depends on the claim', 32, C.ink, 700)
  + ['Record inspected', 'Audit finding', 'Supported interpretation'].map((value, i) => text(30 + i * 400, 106, value, 27, C.gray, 700)).join('')
  + line(30, 129, 1170, 129)
  + lines(30, 182, ['1  Model manifest', 'Resolve the released model', 'behind a misleading label'], 25, C.ink, 400, 39)
  + lines(430, 182, ['Qwen3-1.7B', 'The apparent tenfold size', 'contrast is absent'], 25, C.blue, 400, 39)
  + lines(830, 182, ['Compare actual systems.', 'Keep the observed outputs;', 'correct the size claim.'], 25, C.ink, 400, 39)
  + line(30, 302, 1170, 302)
  + lines(30, 349, ['2  Evaluation identifiers', 'Both versions contain', '705 evaluated problems'], 25, C.ink, 400, 39)
  + lines(430, 349, [pct(cohort.common, 705) + ' shared identifiers', pct(cohort.onlyLeftIds, 705) + ' replaced', 'Some shared answers change'], 25, C.blue, 400, 39)
  + lines(830, 349, ['Equal sample size does', 'not establish the same test.', 'Join items before comparing.'], 25, C.ink, 400, 39)
  + line(30, 469, 1170, 469)
  + lines(30, 516, ['3  Judgment records', '833 judge inputs retained', 'Individual verdicts absent'], 25, C.ink, 400, 39)
  + lines(430, 516, ['Input ≠ decision', 'The semantic aggregate', 'cannot be reconstructed'], 25, C.rust, 400, 39)
  + lines(830, 516, ['Withhold that aggregate.', 'Retain the documented', 'evidence gap.'], 25, C.ink, 400, 39),
  'Specific model-identity, population, and judgment checks bound the scientific interpretation');

await save('shared-assumption-example', 1200, 710,
  text(30, 43, 'Constructed counterexample: agreement with a shared mistake', 30, C.ink, 700)
  + text(30, 91, 'STATED TASK: directed links; can A reach C?', 26, C.blue, 700)
  + graph([125, 325, 525], 165, true)
  + text(790, 157, 'Correct answer: no', 32, C.blue, 700)
  + text(790, 204, 'The arrows point toward A.', 25)
  + arrow(325, 205, 325, 306)
  + text(350, 267, 'A shared parse drops direction', 26, C.rust, 700)
  + rect(30, 320, 550, 233, '#fcf0e8', C.rust)
  + text(52, 365, 'THE PARSED TASK IS NOW DIFFERENT', 24, C.rust, 700)
  + graph([125, 305, 495], 429)
  + text(52, 515, 'Undirected links permit A to reach C.', 25)
  + pathArrow('M585 433 H640 V369 H700') + pathArrow('M640 433 V505 H700')
  + rect(715, 323, 455, 94, '#f6f8fa', C.rule)
  + lines(738, 359, ['Generated solver', 'returns yes'], 26, C.ink, 400, 37)
  + rect(715, 459, 455, 94, '#f6f8fa', C.rule)
  + lines(738, 495, ['Reference computation', 'returns yes'], 26, C.ink, 400, 37)
  + text(600, 625, 'Both computations agree.', 31, C.ink, 700, 'middle')
  + text(600, 674, 'Both answer a different graph problem.', 29, C.rust, 400, 'middle'),
  'A constructed directed-graph example shows how common parsing assumptions defeat evidential independence');

const small = arm('exp-026'), large = arm('exp-027');
let families = text(30, 43, 'Execution failure by family', 32, C.ink, 700)
  + rect(32, 80, 28, 22, C.gray) + text(75, 100, 'Qwen2.5-Coder-0.5B', 26)
  + rect(600, 80, 28, 22, C.blue) + text(643, 100, 'Qwen3-1.7B', 26);
for (const [i, [book, title]] of [['procedural-arithmetic', 'Procedural computations'], ['decompose-to-solve', 'Dependency joins'], ['world-as-a-system', 'Coalition enumeration']].entries()) {
  const y = 159 + i * 119, n = small.books[book].items;
  families += text(30, y + 24, title, 27, C.ink, 700) + text(30, y + 62, `${n} problems in each condition`, 24, C.gray);
  for (const [j, system] of [small, large].entries()) {
    const val = 100 * system.books[book].classes.execution_error / n, yy = y + j * 43;
    families += rect(470, yy, Math.max(2, val * 5.25), 29, j ? C.blue : C.gray, 'none', 0)
      + text(485 + val * 5.25, yy + 24, val.toFixed(1) + '%', 25, j ? C.blue : C.gray, 700);
  }
}
families += line(470, 511, 995, 511);
for (const p of [0, 25, 50, 75, 100]) families += text(470 + 5.25 * p, 547, p + '%', 23, C.gray, 400, 'middle');
await save('family-failures', 1200, 575, families, 'A paired model comparison improves some task families and worsens dependency-join execution');

const diag = evidence.diagnostics.find(value => value.id.startsWith('exp-021') && value.book === 'decompose-to-solve');
let scoring = text(30, 43, 'One retained scheduling example', 29, C.ink, 700)
  + text(690, 43, 'All scheduling cases', 29, C.ink, 700)
  + rect(30, 78, 590, 124, C.pale) + text(52, 116, 'REFERENCE ANSWER EXCERPT', 23, C.gray, 700)
  + lines(52, 154, ['46 minutes', '“is not feasible”'], 28, C.ink, 400, 34)
  + rect(30, 227, 590, 124, '#e8f1f7') + text(52, 265, 'MODEL ANSWER EXCERPT', 23, C.blue, 700)
  + lines(52, 303, ['46 minutes', '“does not meet the limit”'], 28, C.ink, 400, 34)
  + arrow(325, 359, 325, 415) + rect(30, 429, 590, 79, '#e8f4ef', C.teal)
  + text(52, 477, '(minutes = 46, feasible = false)', 26, C.teal, 700)
  + text(690, 89, '100 problems · declared grammar', 24, C.gray);
for (const [i, [key, title, color]] of [['restricted_match', 'Restricted match', C.teal], ['outside_grammar', 'Unclassified', C.gray], ['restricted_mismatch', 'Disagreement', C.rust], ['execution_failure', 'Execution failure', C.ink]].entries()) {
  const value = 100 * (diag.counts[key] ?? 0) / diag.items, yy = 137 + 91 * i;
  scoring += text(690, yy, title, 25) + rect(690, yy + 14, value * 4.2, 30, color, 'none', 0)
    + text(705 + value * 4.2, yy + 39, value.toFixed(0) + '%', 26, color, 700);
}
scoring += text(30, 564, 'Only complete supported answers are classified; unsupported prose remains unclassified.', 25, C.gray);
await save('scoring-diagnostic', 1200, 590, scoring, 'Declared duration-and-feasibility equivalence and the complete restricted diagnostic partition');

await writeFile(resolve(output, 'figure-manifest.json'), JSON.stringify(assets, null, 2) + '\n');
console.log(`Wrote ${assets.length} redesigned SVG figures and high-resolution PNG exports.`);
