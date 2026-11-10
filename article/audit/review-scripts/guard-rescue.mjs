import fs from 'node:fs';
import { answerMatches } from '../../../teacher/naming.mjs';
const rows = fs.readFileSync('evaluation/registry/exp-025-1.7b-qwen3-dv12/items/holdout.jsonl', 'utf8').trim().split('\n').map(JSON.parse).filter(r => r.book === 'common-sense' && /probe failed/.test(r.detail || ''));
let ran = 0, exact = 0, numeric = 0, other = 0;
for (const r of rows) {
  const parts = r.completion.split(/^@/m).filter(Boolean);
  const wires = {};
  for (const p of parts) { const nl = p.indexOf('\n'); const [name, cmd] = p.slice(0, nl).trim().split(/\s+/); wires[name] = { cmd, body: p.slice(nl + 1) }; }
  if (Object.keys(wires).length !== 2 || !wires.slots || !wires.answer) { other++; continue; }
  try {
    const slots = JSON.parse(wires.slots.body);
    const fn = new Function('$slots', 'probe', wires.answer.body);
    const out = fn(slots, () => {});
    ran++;
    if (answerMatches(r.oracle, String(out))) exact++;
    const on = (r.oracle.match(/-?\d+(\.\d+)?/g) || []).join(','); const an = (String(out).match(/-?\d+(\.\d+)?/g) || []).join(',');
    if (on && on === an) numeric++;
  } catch (e) { other++; }
}
console.log({ probeFailures: rows.length, ranWithoutGuards: ran, exactMatchUnderScorer: exact, sameNumbers: numeric, notRun: other });
