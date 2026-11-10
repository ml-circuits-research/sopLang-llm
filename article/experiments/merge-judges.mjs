// Merges the two blind judges' verdicts, reports agreement and calibration, and expands pair verdicts to records.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { joinValue, coalitionValue } from '../scripts/restricted-comparators.mjs';
const dir = fileURLToPath(new URL('../evidence/comparison/', import.meta.url));
const read = (name) => readFileSync(resolve(dir, name), 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
// Every judging round present on disk: judge-pairs-<n>.jsonl with its two verdict files.
const rounds = readdirSync(dir).map((name) => name.match(/^judge-pairs-(\d+)\.jsonl$/)).filter(Boolean).map((match) => Number(match[1])).sort((a, b) => a - b);
const judge = (letter) => new Map(rounds.flatMap((i) => read(`judge-${letter}-${i}.jsonl`)).map((row) => [row.pid, row.verdict]));
const A = judge('A'), B = judge('B');
const pairs = new Map(rounds.flatMap((i) => read(`judge-pairs-${i}.jsonl`)).map((row) => [row.pid, row]));
const pids = [...pairs.keys()];
const missing = pids.filter((pid) => !A.has(pid) || !B.has(pid));
const labels = ['same', 'different', 'unclear'];
const agree = pids.filter((pid) => A.get(pid) === B.get(pid)).length / pids.length;
const expected = labels.reduce((sum, label) => sum + (pids.filter((p) => A.get(p) === label).length / pids.length) * (pids.filter((p) => B.get(p) === label).length / pids.length), 0);
const kappa = (agree - expected) / (1 - expected);
// Calibration: injected known-wrong pairs, and pairs a deterministic restricted parser proves equivalent.
const key = JSON.parse(readFileSync(resolve(dir, 'judge-calibration-key.json'), 'utf8'));
// The key once listed one pair twice; count each injected pair once.
const negatives = [...new Map(key.filter((row) => row.truth === 'different').map((row) => [row.pid, row])).values()];
const falseAccept = (J) => negatives.filter((row) => J.get(row.pid) === 'same').length;
const parserPositive = pids.filter((pid) => {
  const { reference, candidate } = pairs.get(pid);
  const join = joinValue(reference), coalition = coalitionValue(reference);
  return (join && join === joinValue(candidate)) || (coalition && coalition === coalitionValue(candidate));
});
const falseReject = (J) => parserPositive.filter((pid) => J.get(pid) !== 'same').length;
const calibration = {
  knownWrong: negatives.length, acceptedByA: falseAccept(A), acceptedByB: falseAccept(B),
  parserEquivalent: parserPositive.length, notAcceptedByA: falseReject(A), notAcceptedByB: falseReject(B)
};
// Expand to record-level jids; an injected calibration pair has no records.
const map = JSON.parse(readFileSync(resolve(dir, 'judge-pair-map.json'), 'utf8'));
const expand = (J) => Object.entries(map).flatMap(([pid, jids]) => jids.map((jid) => JSON.stringify({ jid, pid, verdict: J.get(pid) ?? null }))).join('\n') + '\n';
writeFileSync(resolve(dir, 'judge-A.jsonl'), expand(A));
writeFileSync(resolve(dir, 'judge-B.jsonl'), expand(B));
const injected = new Set(key.map((row) => row.pid).filter((pid) => !map[pid]));
const summary = { pairs: pids.length, answerPairs: pids.filter((pid) => map[pid]).length, injectedPairs: pids.filter((pid) => injected.has(pid)).length, missing: missing.length, observedAgreement: agree, kappa,
  bothSame: pids.filter((p) => A.get(p) === 'same' && B.get(p) === 'same').length,
  disputed: pids.filter((p) => A.get(p) !== B.get(p)).length, calibration };
writeFileSync(resolve(dir, 'judge-agreement.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
