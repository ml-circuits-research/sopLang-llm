// Agreement between the two independent incident codings and the register cross-tabulations.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const root = fileURLToPath(new URL('../evidence/', import.meta.url));
const load = async name => JSON.parse(await readFile(resolve(root, name), 'utf8'));
const [a, b, register] = await Promise.all([load('incident-coding-A.json'), load('incident-coding-B.json'), load('incident-register.json')]);
const byId = rows => new Map(rows.map(row => [row.id, row]));
const A = byId(a), B = byId(b);
const ids = register.incidents.map(incident => incident.id);
function kappa(labelOf) {
  const pairs = ids.map(id => [labelOf(A.get(id)), labelOf(B.get(id))]);
  const agree = pairs.filter(([x, y]) => x === y).length / pairs.length;
  const labels = [...new Set(pairs.flat())];
  const expected = labels.reduce((sum, label) => sum + (pairs.filter(p => p[0] === label).length / pairs.length) * (pairs.filter(p => p[1] === label).length / pairs.length), 0);
  return { observed: agree, kappa: (agree - expected) / (1 - expected), agreements: pairs.filter(([x, y]) => x === y).length, n: pairs.length };
}
const category = kappa(row => row.category);
const full = kappa(row => row.category + (row.seam ? ':' + row.seam : ''));
const disagreements = ids.filter(id => (A.get(id).category + (A.get(id).seam ?? '')) !== (B.get(id).category + (B.get(id).seam ?? '')))
  .map(id => ({ id, A: [A.get(id).category, A.get(id).seam, A.get(id).confidence, A.get(id).reason], B: [B.get(id).category, B.get(id).seam, B.get(id).confidence, B.get(id).reason] }));
await writeFile(resolve(root, 'incident-agreement.json'), JSON.stringify({ category, categoryAndSeam: full, disagreements }, null, 2) + '\n');
console.log('category', category, '\ncategory+seam', full);
for (const d of disagreements) console.log(d.id, JSON.stringify(d.A), '\n     ', JSON.stringify(d.B));
