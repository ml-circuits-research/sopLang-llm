import fs from 'node:fs';
import { joinValue } from '../../scripts/restricted-comparators.mjs';
const oracleValue = (t) => { const j = joinValue(t); if (j) return j; const m = /^(\d+) minutes: (not )?feasible\.?$/.exec((t||'').trim()); return m ? JSON.stringify({ minutes: Number(m[1]), feasible: !m[2] }) : null; };
const arms = fs.readdirSync('evaluation/registry').filter(d => /^exp-0(1[4-9]|2\d)/.test(d) && fs.existsSync(`evaluation/registry/${d}/items/holdout.jsonl`));
for (const e of arms) {
  const rows = fs.readFileSync(`evaluation/registry/${e}/items/holdout.jsonl`, 'utf8').trim().split('\n').map(JSON.parse).filter(r => r.folder.includes('dependency-chain-and-join'));
  const c = { match: 0, mismatch: 0, outside: 0, exec: 0, oracleUnparsed: 0 };
  for (const r of rows) { const o = oracleValue(r.oracle); if (!o) c.oracleUnparsed++; if (r.class === 'execution_error' || r.answer == null) { c.exec++; continue; } const a = joinValue(r.answer) || oracleValue(r.answer); if (!a) c.outside++; else if (a === o) c.match++; else c.mismatch++; }
  console.log(e, rows.length, JSON.stringify(c));
}
