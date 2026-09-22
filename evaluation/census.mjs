// Full operation census: both compute syntaxes, all seven books.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const roots = ['mathematical-thinking','adult-reasoning','common-sense','decompose-to-solve','logical-reasoning','scientific-reasoning','world-as-a-system'];
const patterns = {
  percentage: /\/\s*100|percent|%\s*\)|0\.\d+\s*\*/,
  ratio: /\/\s*\$?[a-z_]+[;)]|divided|per\s+[a-z]/i,
  timeArithmetic: /Date|hours|minutes|elapsed|duration|clock|\bday\b|\bweek\b/,
  geometry: /area|perimeter|angle|degree|triangle|rectangle|circle|side/,
  money: /price|cost|coin|dollar|cent|discount|change/,
  sorting: /\.sort\(|rank|order|position/,
  setOps: /new Set|Set\(|unique|distinct|\.every\(|\.some\(/,
  stringOps: /\.split|\.join|\.replace|\.slice|\.length|charAt|includes|startsWith|toLowerCase/,
  listOps: /\.filter\(|\.map\(|\.reduce\(|\.indexOf|Math\.max|Math\.min/,
  divisibility: /%|modulo|remainder|divisib|multiple/,
  probability: /probab|outcome|chance|favor/,
  graphTraversal: /neighbor|neighbour|edge|node|path|route|border|graph/,
  balanceLedger: /balance|ledger|deposit|withdraw|account/,
};
const perPattern = new Map();
const perBook = new Map();
let bodies = 0;
for (const root of roots) {
  const dir = join('/home/salboaie/work/sopLang-llm/teacher/families', root);
  const bookHits = new Map();
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.mjs')) continue;
    const text = readFileSync(join(dir, file), 'utf8');
    for (const match of text.matchAll(/compute:\s*\[([\s\S]*?)\]\s*\.join|COMPUTE\s*=\s*\[([\s\S]*?)\]\s*\.join/g)) {
      const body = match[1] ?? match[2] ?? '';
      if (body.trim() === '') continue;
      bodies += 1;
      for (const [name, re] of Object.entries(patterns)) {
        if (re.test(body)) {
          perPattern.set(name, (perPattern.get(name) ?? 0) + 1);
          bookHits.set(name, true);
        }
      }
    }
  }
  perBook.set(root, bookHits);
}
console.log(`compute bodies scanned: ${bodies} (of 941 plans)`);
console.log('\noperation pattern | bodies | books');
for (const [name, count] of [...perPattern.entries()].sort((a, b) => b[1] - a[1])) {
  const books = [...perBook.values()].filter((m) => m.has(name)).length;
  console.log(`  ${name.padEnd(18)} ${String(count).padStart(4)}   ${books}`);
}
