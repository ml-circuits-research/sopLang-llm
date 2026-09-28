import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
try {
  if (!execFileSync('convert', ['-version'], { encoding: 'utf8', timeout: 5000 }).includes('ImageMagick')) throw new Error('Unexpected convert executable');
} catch (error) {
  throw new Error('Figure rasterization requires the existing ImageMagick convert command; see skills/scientific-article/dependencies.md. No software is installed automatically.', { cause: error });
}
const results = JSON.parse(await readFile(resolve(root, 'evidence/results.json')));
const output = resolve(root, 'assets');
await mkdir(output, { recursive: true });
const esc = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;');
function text(x, y, value, size = 21, weight = 'normal', anchor = 'start') {
  return `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${esc(value)}</text>`;
}
function box(x, y, w, h, lines, fill = '#f1f1f1', size = 21) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${fill}" stroke="#222" stroke-width="2"/>`
    + lines.map((line, i) => text(x + w / 2, y + h / 2 - (lines.length - 1) * size * .62 + i * size * 1.24 + size * .32, line, size, i === 0 ? 'bold' : 'normal', 'middle')).join('');
}
function arrow(x1, y1, x2, y2, dashed = false) {
  return `<path d="M${x1},${y1} L${x2},${y2}" fill="none" stroke="#222" stroke-width="2.4"${dashed ? ' stroke-dasharray="6 4"' : ''} marker-end="url(#arrow)"/>`;
}
async function save(name, width, height, content) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#222"/></marker></defs><rect width="100%" height="100%" fill="white"/><g font-family="DejaVu Sans,Arial,sans-serif" fill="#111">${content}</g></svg>`;
  const path = resolve(output, `${name}.svg`);
  await writeFile(path, svg);
  execFileSync('convert', ['-background', 'white', '-density', '660', path,
    '-units', 'PixelsPerInch', '-density', '1200', resolve(output, `${name}.png`)], { timeout: 30000 });
}

await save('execution-contract', 1100, 410,
  box(15, 35, 170, 105, ['Problem', 'text and facts']) + arrow(190, 87, 225, 87)
  + box(235, 35, 170, 105, ['Small model', 'choose a plan']) + arrow(410, 87, 445, 87)
  + box(455, 35, 170, 105, ['Wire program', 'explicit inputs']) + arrow(630, 87, 665, 87)
  + box(675, 35, 170, 105, ['Runtime', 'execute plan']) + arrow(850, 87, 885, 87)
  + box(895, 35, 190, 105, ['Output', 'value + trace'])
  + box(55, 220, 360, 115, ['Interpretation obligation', 'Did the plan capture the question?'], '#fff', 20)
  + box(480, 220, 565, 115, ['Execution obligation', 'Valid graph, bounded code, explicit failures'], '#fff', 20)
  + arrow(320, 145, 235, 210, true) + arrow(760, 145, 760, 210, true)
  + text(550, 385, 'Both obligations are needed for a correct answer.', 22, 'bold', 'middle'));

await save('architecture-narrow', 440, 780,
  box(35, 15, 370, 100, ['Problem statement', 'all necessary premises'], '#fff', 23)
  + arrow(220, 120, 220, 160)
  + box(35, 170, 370, 110, ['Model compiler', 'select operations and arguments'], '#eee', 23)
  + arrow(220, 285, 220, 325)
  + box(35, 335, 370, 110, ['SOP Lang circuit', 'literal + declared operations'], '#fff', 23)
  + arrow(220, 450, 220, 490)
  + box(35, 500, 370, 110, ['Runtime', 'validate, schedule, execute'], '#eee', 23)
  + arrow(220, 615, 220, 655)
  + box(35, 665, 370, 95, ['Answer and trace', 'or structured failure'], '#fff', 23));

const order = [8, 9, 0, 1, 2, 3, 4, 5, 6, 7];
let bars = '';
const x0 = 210, scale = 770 / 705;
for (let i = 0; i <= 700; i += 100) {
  const x = x0 + i * scale;
  bars += `<path d="M${x} 45 V670" stroke="#ddd"/>` + text(x, 704, i, 18, 'normal', 'middle');
}
order.forEach((index, row) => {
  const arm = results.arms[index], y = 65 + row * 60;
  const label = arm.id.split('-').slice(0, 2).join('-') + ` / dv${arm.dataVersion.number}`;
  bars += text(x0 - 12, y + 26, label, 20, 'normal', 'end');
  let x = x0;
  for (const [key, fill, color] of [['answer_match', '#333', '#fff'], ['answer_mismatch', '#bdbdbd', '#000'], ['execution_error', '#fff', '#000']]) {
    const n = arm.classes[key], w = n * scale;
    bars += `<rect x="${x}" y="${y}" width="${w}" height="38" fill="${fill}" stroke="#333"/>`;
    bars += `<text x="${x + w / 2}" y="${y + 26}" font-size="21" fill="${color}" text-anchor="middle">${n}</text>`;
    x += w;
  }
});
bars += text(580, 745, 'Recorded problems per run (705)', 22, 'normal', 'middle');
for (const [x, fill, label] of [[55, '#333', 'Normalized exact match'], [430, '#bdbdbd', 'Completed mismatch'], [785, '#fff', 'Execution error']]) {
  bars += `<rect x="${x}" y="790" width="23" height="23" fill="${fill}" stroke="#333"/>` + text(x + 33, 810, label, 19);
}
await save('outcome-ladder', 1100, 850, bars);

await save('vocabulary-loop', 1100, 590,
  box(20, 40, 245, 100, ['Measure failures', 'by family and operation'])
  + arrow(270, 90, 300, 90) + box(310, 40, 235, 100, ['Propose a wire', 'contract and boundaries'])
  + arrow(550, 90, 580, 90) + box(590, 40, 225, 100, ['Verify the wire', 'oracles and mutations'])
  + arrow(820, 90, 850, 90) + box(860, 40, 220, 100, ['Train and compare', 'matched conditions'])
  + arrow(970, 145, 970, 225) + box(730, 240, 350, 110, ['Development decision', 'retain, revise, or reject'])
  + `<path d="M730 295 H140 V145" fill="none" stroke="#222" stroke-width="2.4" marker-end="url(#arrow)"/>`
  + box(65, 410, 970, 130, ['Proposed confirmation step', 'Freeze vocabulary, data, scorer and training budget', 'Evaluate new families once, across multiple training seeds'], '#fff', 24)
  + arrow(905, 355, 905, 400, true));

await save('audit-chain', 1100, 570,
  box(20, 30, 310, 120, ['Archived evidence', 'manifests + item records'])
  + arrow(335, 90, 380, 90) + box(390, 30, 310, 120, ['Deterministic audit', 'identity + counts + joins'])
  + arrow(705, 90, 750, 90) + box(760, 30, 320, 120, ['Defensible claim', 'effect + scope + limitation'])
  + box(20, 230, 310, 135, ['Identity check', 'exp-017 means Qwen3-1.7B', 'directory label is insufficient'], '#fff', 20)
  + box(390, 230, 310, 135, ['Comparison check', 'dv7 versus dv13', '655 shared item identifiers'], '#fff', 20)
  + box(760, 230, 320, 135, ['Judge check', '833 archived inputs', 'individual verdicts missing'], '#fff', 20)
  + arrow(175, 155, 175, 220, true) + arrow(545, 155, 545, 220, true)
  + arrow(920, 155, 920, 220, true)
  + box(95, 435, 910, 100, ['Human scientific responsibility', 'Approve interpretation, provenance, disclosures, and release'], '#eee', 23));

await save('epistemic-boundaries', 1100, 520,
  box(20, 35, 330, 110, ['Construction', 'agent writes task and solution'])
  + arrow(355, 90, 380, 90) + box(390, 35, 320, 110, ['Verification', 'oracle, runtime, perturbations'])
  + arrow(715, 90, 740, 90) + box(750, 35, 330, 110, ['Interpretation', 'researcher makes a claim'])
  + box(20, 220, 330, 145, ['Remaining uncertainty', 'shared assumptions', 'in the generator'], '#fff', 23)
  + box(390, 220, 320, 145, ['Remaining uncertainty', 'wrong task or', 'incomplete scoring rule'], '#fff', 23)
  + box(750, 220, 330, 145, ['Remaining uncertainty', 'overgeneralization', 'and missing comparisons'], '#fff', 23)
  + arrow(185, 150, 185, 210, true) + arrow(550, 150, 550, 210, true)
  + arrow(915, 150, 915, 210, true)
  + text(550, 440, 'Agreement inside a pipeline does not establish independence.', 25, 'bold', 'middle')
  + text(550, 483, 'Keep evidence that can challenge each stage.', 23, 'normal', 'middle'));

await save('comparator-diagnostic', 1100, 460,
  box(20, 35, 510, 110, ['Parallel-join problems, dv7', '0/100 original phrase matches'], '#eee', 24)
  + box(570, 35, 510, 110, ['Coalition problems, dv13', '5/20 original phrase matches'], '#eee', 24)
  + arrow(275, 150, 275, 215) + arrow(825, 150, 825, 215)
  + box(20, 225, 510, 145, ['Restricted tuple comparison', '64/100 time + feasibility matches', '26 unclassified; 2 wrong; 8 failed'], '#fff', 23)
  + box(570, 225, 510, 145, ['Restricted coalition comparison', '20/20 coalition + seat matches', '15 additional matches from separators'], '#fff', 23)
  + text(550, 429, 'Retrospective diagnostics; no general semantic score is inferred.', 23, 'bold', 'middle'));

await save('wire-admission-narrow', 440, 750,
  box(25, 15, 390, 100, ['Observed failure', 'a recurring computation'], '#fff', 23)
  + arrow(220, 120, 220, 155)
  + box(25, 165, 390, 100, ['Candidate contract', 'inputs, outputs, exclusions'], '#eee', 23)
  + arrow(220, 270, 220, 305)
  + box(25, 315, 390, 100, ['Executable checks', 'reference and adversarial cases'], '#fff', 23)
  + arrow(220, 420, 220, 455)
  + box(25, 465, 390, 100, ['Matched comparison', 'new wire versus general code'], '#eee', 23)
  + arrow(220, 570, 220, 605)
  + box(25, 615, 390, 115, ['Transfer decision', 'correctness and selection errors', 'on previously frozen families'], '#fff', 22));

console.log('Wrote eight SVG figures and compatible PNG exports.');
