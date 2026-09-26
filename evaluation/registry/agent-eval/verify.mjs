import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createRuntime } from '../../../runtime/kernel.mjs';
import { answerMatches } from '../../../teacher/naming.mjs';

const items = JSON.parse(`[${readFileSync('evaluation/registry/agent-eval/items.jsonl', 'utf8').trim().split('\n').join(',')}]`);
const dir = 'evaluation/registry/agent-eval/solutions';
const files = readdirSync(dir).filter(f => f.endsWith('.sop')).sort();
let pass = 0, fail = 0, voids = 0;
const results = [];
for (const f of files) {
  const idx = Number(f.split('.')[0]);
  const item = items[idx];
  const source = readFileSync(`${dir}/${f}`, 'utf8');
  const refPath = `training-data/${item.book}/${item.folder}/solution.sop`;
  const ref = existsSync(refPath) ? readFileSync(refPath, 'utf8') : null;
  const identical = ref !== null && source.trim() === ref.trim();
  let status, computed = null;
  try {
    const runtime = createRuntime();
    const result = await runtime.run(source, { outputs: ['answer'] });
    computed = result.status === 'completed' ? String(result.outputs.answer) : null;
    if (identical) { voids += 1; status = 'VOID (identical to shipped solution)'; }
    else if (computed !== null && answerMatches(item.answer, computed)) { pass += 1; status = 'PASS'; }
    else { fail += 1; status = 'FAIL'; }
  } catch (e) {
    fail += 1; status = 'ERROR: ' + e.message.slice(0, 80);
  }
  results.push({ idx, book: item.book, folder: item.folder.split('/').pop(), status,
    expected: (item.answer || '').slice(0, 60), computed: (computed || '').slice(0, 60) });
}
for (const r of results) console.log(`${String(r.idx).padStart(2)} ${r.status.padEnd(40)} ${r.book.split('-')[0].padEnd(12)} ${r.folder}  exp="${r.expected}" got="${r.computed}"`);
console.log(`\nTOTAL: ${pass} pass, ${fail} fail, ${voids} void (copies) of ${files.length}`);
