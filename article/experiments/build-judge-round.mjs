// Builds one more round of blind judging for records added after the earlier rounds, with the same
// protocol: every answered record that is not an exact match is judged; a (reference, candidate) pair
// already judged in an earlier round is not judged again (its verdicts are reused through the pair map);
// new pairs go to judge-pairs-<round>.jsonl together with injected known-wrong pairs for calibration.
// Usage: node article/experiments/build-judge-round.mjs <round> <registry directory>...
import { existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
const registry = resolve(root, 'evaluation/registry');
const dir = resolve(root, 'article/evidence/comparison');
const read = (path) => existsSync(path) ? readFileSync(path, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line)) : [];
const sha = (text) => createHash('sha256').update(text).digest('hex').slice(0, 12);
const [round, ...directories] = process.argv.slice(2);
if (!round || !directories.length) throw new Error('usage: build-judge-round.mjs <round> <directory>...');
if (existsSync(resolve(dir, `judge-pairs-${round}.jsonl`))) throw new Error(`judge-pairs-${round}.jsonl already exists`);

// Statements of every item source the new directories use.
const statements = new Map();
const idOf = (row) => row.id ?? `${row.book}/${row.folder}`;
for (const file of ['items-e3/paired-nl/original.jsonl', 'items-e3/paired-nl/procedural.jsonl', 'items-e9/depletion.jsonl']) {
  for (const row of read(resolve(registry, file))) statements.set(idOf(row), row.statement);
}
// Pairs judged in earlier rounds.
const earlier = new Map();
for (const name of readdirSync(dir).filter((file) => /^judge-pairs-\d+\.jsonl$/.test(file))) for (const row of read(resolve(dir, name))) earlier.set(row.pid, row);
const pairMap = JSON.parse(readFileSync(resolve(dir, 'judge-pair-map.json'), 'utf8'));

const fresh = new Map();
let records = 0, reused = 0;
for (const directory of directories) {
  for (const row of read(resolve(registry, directory, 'items.jsonl'))) {
    if (row.class === 'answer_match' || row.answer === null || row.answer === undefined) continue;
    records++;
    const jid = sha(`${directory}::${row.item}#${row.sample ?? 0}`);
    const candidate = String(row.answer).slice(0, 1500);
    const pid = sha(`${row.oracle}\u0000${candidate}`);
    const jids = pairMap[pid] ??= [];
    if (!jids.includes(jid)) jids.push(jid);
    if (earlier.has(pid)) { reused++; continue; }
    const statement = statements.get(row.item) ?? statements.get(row.item.replace(/-procedural$/, ''));
    if (!statement) throw new Error(`no statement for ${row.item}`);
    if (!fresh.has(pid)) fresh.set(pid, { pid, statement, reference: row.oracle, candidate });
  }
}
// Injected known-wrong pairs: a real statement and reference, with a candidate that changes the value,
// the verdict, or the selection. Their pids have no records, so they never affect a score.
const pool = [...fresh.values()];
const pick = (test) => pool.find(test);
const injected = [];
const schedule = pick((row) => /minutes: (not )?feasible/.test(row.reference));
if (schedule) {
  const [, minutes, not] = schedule.reference.match(/(\d+) minutes: (not )?feasible/);
  injected.push({ ...schedule, candidate: `The earliest safe completion time is ${minutes} minutes, so the plan ${not ? 'meets' : 'does not meet'} the limit.` });
  injected.push({ ...schedule, candidate: `The earliest safe completion time is ${Number(minutes) + 3} minutes, so the plan ${not ? 'does not meet' : 'meets'} the limit.` });
}
const stock = pick((row) => /whole days, so the order can wait/.test(row.reference));
if (stock) {
  const [, days] = stock.reference.match(/covers (\d+) whole days/);
  injected.push({ ...stock, candidate: `The stock covers ${days} whole days, so the order must be placed today.` });
  injected.push({ ...stock, candidate: `The stock covers ${Number(days) - 2} whole days, so the order can wait.` });
}
const coalition = pick((row) => /\{[A-Z, ]+\}/.test(row.reference) || /coalition/i.test(row.statement));
if (coalition) injected.push({ ...coalition, candidate: 'The only minimal winning coalition is {A, B, C}.' });
const calibration = injected.map((row) => {
  const pid = sha(`${row.reference}\u0000${row.candidate}\u0000injected-${round}`);
  return { pid, statement: row.statement, reference: row.reference, candidate: row.candidate };
});
const rows = [...fresh.values(), ...calibration].sort((a, b) => a.pid.localeCompare(b.pid));
writeFileSync(resolve(dir, `judge-pairs-${round}.jsonl`), rows.map((row) => JSON.stringify(row)).join('\n') + '\n');
writeFileSync(resolve(dir, 'judge-pair-map.json'), JSON.stringify(pairMap, null, 2) + '\n');
const key = JSON.parse(readFileSync(resolve(dir, 'judge-calibration-key.json'), 'utf8'));
writeFileSync(resolve(dir, 'judge-calibration-key.json'), JSON.stringify([...key, ...calibration.map((row) => ({ pid: row.pid, truth: 'different' }))], null, 2) + '\n');
console.log(`round ${round}: ${records} records needing judgement, ${reused} reuse earlier verdicts, ${fresh.size} new pairs, ${calibration.length} injected known-wrong pairs`);
