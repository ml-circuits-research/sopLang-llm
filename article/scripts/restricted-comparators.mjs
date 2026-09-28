// These parsers accept complete, restricted utterances, not bags of numbers.
// Rejection means unclassified by this audit, not semantically incorrect.
export function coalitionValue(text) {
  if (typeof text !== 'string') return null;
  const parts = text.trim().replace(/\.$/, '').split(/\s*[;,]\s*/);
  const pairs = [];
  for (const part of parts) {
    const match = /^([ABC]+) with (\d+) seats$/.exec(part);
    if (!match || new Set(match[1]).size !== match[1].length || !Number.isSafeInteger(Number(match[2]))) return null;
    pairs.push([match[1].split('').sort().join(''), Number(match[2])]);
  }
  if (new Set(pairs.map(pair => pair[0])).size !== pairs.length) return null;
  return JSON.stringify(pairs.sort((a, b) => a[0].localeCompare(b[0])));
}
export function joinValue(text) {
  if (typeof text !== 'string') return null;
  const stripped = text.trim().replace(
    / The critical insight is that B and C are parallel branches whose maximum duration controls the join\.$/, '');
  const match = /^The earliest safe completion time is (\d+) minutes, so the plan (is feasible|is not feasible|meets the limit|does not meet the limit)\.$/.exec(stripped);
  if (!match || !Number.isSafeInteger(Number(match[1]))) return null;
  return JSON.stringify({ minutes: Number(match[1]),
    feasible: ['is feasible', 'meets the limit'].includes(match[2]) });
}
