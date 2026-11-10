// Regenerates the incident-register numbers used in the Empirical Software Engineering manuscript
// (Tables 1-3, the detection-coverage shares, the entry-to-detection lags, the sensitivity check,
// sources per incident, the commit-screen counts, and the census of human-addressed log messages)
// from article/evidence/incident-register.json, incident-coding-final.json, the version history,
// and the operational logs. It reads only; it writes nothing. Run from anywhere:
//   node article/scripts/incident-tables.mjs            (Markdown report)
//   node article/scripts/incident-tables.mjs --json     (machine-readable summary)
//
// Dating rules (the register records times as text; these rules turn the text into times):
// 1. Times are local (+0200). A time marked Z is UTC and is converted by adding two hours; in a range
//    such as "21:15-21:45Z" the Z applies to the whole range. A range contributes its first time.
//    Approximate markers ("~", "before") are read as the stated time; "before" makes the lag an upper bound.
// 2. Entry is the first record that shows the defect affecting a record, decision, or artifact. When the
//    register's entry text names such a record ("first documented instance", "first consequential",
//    "first misreading"), its time is the entry. Otherwise an entry text that begins with "unknown" is
//    undated, and any other entry text contributes its first date and time.
// 3. Detection is the first record that shows awareness of the defect: the first date and time in the
//    register's detection text. Detections by the final audit carry only a date (28 September) and are not
//    used in lag statistics. A detection text with a date but no time is undated.
// 4. The lag is detection minus entry, in hours, for incidents whose entry and detection are both dated.
// The lagHours stored in incident-coding-final.json were computed before these rules were written; they
// read "~09:00" and date-only texts as 12:00 of that day and took the first time in a text even when it was
// UTC. This script prints where the two differ.

import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const evidence = resolve(repo, 'article/evidence');
const load = async name => JSON.parse(await readFile(resolve(evidence, name), 'utf8'));
const [register, finalCoding] = await Promise.all([load('incident-register.json'), load('incident-coding-final.json')]);
const coding = new Map(finalCoding.map(row => [row.id, row]));
const incidents = register.incidents.map(incident => ({ ...incident, ...pick(coding.get(incident.id)) }));
function pick(row) { return { category: row.category, seam: row.seam, storedLag: row.lagHours }; }

const CATEGORIES = [['C', 'Code defect'], ['R', 'Representation error'], ['I', 'Inference or reporting error'], ['E', 'Environment failure']];
const ROUTES = [
  ['item-reading by the working thread', 'Reading individual records (working thread)'],
  ['operational failure', 'Operational failure'],
  ['separate review', 'Separate review'],
  ['final audit', 'Final audit'],
  ['test', 'Test suite'],
];
const FIRST_REVIEW = Date.UTC(2026, 8, 22, 7, 0); // header of the day-5 review: 07:00-07:05 UTC
const AUDIT_DAY = '2026-09-28';

// ---------- time parsing ----------
const DATE = /2026-09-(\d\d)/;
function firstTimeAfter(text, from) {
  const rest = text.slice(from);
  const match = /(\d\d):(\d\d)(?:-(\d\d):(\d\d))?(Z)?/.exec(rest);
  if (!match) return null;
  return { hour: +match[1], minute: +match[2], utc: Boolean(match[5]) };
}
function parseMoment(text) {
  const date = DATE.exec(text);
  if (!date) return null;
  const time = firstTimeAfter(text, date.index + date[0].length);
  if (!time) return { day: +date[1], dateOnly: true };
  const local = time.utc ? time.hour + 2 : time.hour;
  return { day: +date[1], hours: local + time.minute / 60, upperBound: /before/.test(text.slice(date.index, date.index + 40)) };
}
function toMs(moment) { return Date.UTC(2026, 8, moment.day, 0, 0) + (moment.hours - 2) * 3600e3; }
function entryOf(incident) {
  const text = incident.entered.when;
  const marker = /(first documented instance|first consequential(?: on)?|first misreading)\s+(2026-09-\d\d[^;,)]*)/.exec(text);
  if (marker) return { ...parseMoment(marker[2]), rule: marker[1].replace(' on', '') };
  if (/^unknown/.test(text)) return null;
  const moment = parseMoment(text);
  return moment && !moment.dateOnly ? { ...moment, rule: 'first date and time' } : null;
}
function detectionOf(incident) {
  if (incident.detection_route === 'final audit') return { audit: true };
  const moment = parseMoment(incident.detected.when);
  return moment && !moment.dateOnly ? moment : null;
}
const round1 = value => Math.round(value * 10) / 10;
for (const incident of incidents) {
  incident.entry = entryOf(incident);
  incident.detection = detectionOf(incident);
  incident.lag = incident.entry && incident.detection && !incident.detection.audit
    ? round1((toMs(incident.detection) - toMs(incident.entry)) / 3600e3) : null;
  incident.lagIsUpperBound = Boolean(incident.detection?.upperBound);
  incident.enteredAfterFirstReview = incident.entry ? toMs(incident.entry) > FIRST_REVIEW : null;
}

// ---------- helpers ----------
const count = (rows, test) => rows.filter(test).length;
const median = values => {
  const sorted = [...values].sort((a, b) => a - b);
  if (!sorted.length) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : round1((sorted[mid - 1] + sorted[mid]) / 2);
};
const byCategory = code => incidents.filter(incident => incident.category === code);
const table = (header, rows) => [`| ${header.join(' | ')} |`, `| ${header.map(() => '---').join(' | ')} |`, ...rows.map(row => `| ${row.join(' | ')} |`)].join('\n');
const clock = moment => moment ? `${moment.day} Sep ${String(Math.floor(moment.hours)).padStart(2, '0')}:${String(Math.round((moment.hours % 1) * 60)).padStart(2, '0')}` : 'undated';

// ---------- Table 1: screening funnel ----------
const funnel = register.funnel;
const mappedBySource = {}; const excludedBySource = {};
for (const entry of funnel.candidate_map) mappedBySource[entry.source] = (mappedBySource[entry.source] ?? 0) + 1;
for (const entry of funnel.excluded) excludedBySource[entry.source] = (excludedBySource[entry.source] ?? 0) + 1;
const candidatesBySource = {
  a: funnel.candidates_by_source.a_review_round_1_R1_R9 + funnel.candidates_by_source.a_review_round_2_commit_176b8a38a,
  b: funnel.candidates_by_source.b_keyword_commits_18_to_28_Sep,
  c: funnel.candidates_by_source.c_claim_ledger_table_1 + funnel.candidates_by_source.c_claim_ledger_table_2 + funnel.candidates_by_source.c_baseline_audit,
  d: funnel.candidates_by_source.d_documents_and_history,
};
const sourceNames = { a: 'Findings of the two separate reviews', b: 'Commits whose subject line matches a correction term (of 240)', c: "Rows of the final audit's correction ledger and baseline audit", d: 'Operational rules, analysis log, status notes, logs' };
const funnelRows = Object.keys(sourceNames).map(source => [sourceNames[source], candidatesBySource[source], mappedBySource[source], excludedBySource[source]]);
funnelRows.push(['Total', funnel.candidates_by_source.total, funnel.mapped_to_incidents, funnel.excluded_count]);

// ---------- sources per incident ----------
const sourcesOf = new Map(incidents.map(incident => [incident.id, new Set()]));
for (const entry of funnel.candidate_map) for (const id of entry.incident.split(/,\s*/)) sourcesOf.get(id)?.add(entry.source);
const sourceCounts = {}; for (const [, set] of sourcesOf) sourceCounts[set.size] = (sourceCounts[set.size] ?? 0) + 1;
const auditOnly = [...sourcesOf].filter(([, set]) => set.size === 1 && set.has('c')).map(([id]) => id);

// ---------- Table 2 and components ----------
const seams = {}; for (const incident of byCategory('R')) seams[incident.seam] = (seams[incident.seam] ?? 0) + 1;
const components = {}; for (const incident of incidents) components[incident.component] = (components[incident.component] ?? 0) + 1;
const componentCategory = {};
for (const incident of incidents) { const key = incident.component; componentCategory[key] ??= {}; componentCategory[key][incident.category] = (componentCategory[key][incident.category] ?? 0) + 1; }

// ---------- Table 3: route by category ----------
const routeRows = ROUTES.map(([route, label]) => [label, ...CATEGORIES.map(([code]) => count(byCategory(code), incident => incident.detection_route === route))]);

// ---------- coverage, lags, entry timing ----------
const coverage = CATEGORIES.map(([code, label]) => {
  const rows = byCategory(code);
  const during = rows.filter(incident => incident.detection_route !== 'final audit');
  const lags = during.filter(incident => incident.lag !== null).map(incident => incident.lag);
  return {
    code, label, total: rows.length, detectedDuringProgramme: during.length,
    datedLags: lags.length, medianLag: median(lags), minLag: lags.length ? Math.min(...lags) : null, maxLag: lags.length ? Math.max(...lags) : null,
    enteredAfterFirstReview: count(rows, incident => incident.enteredAfterFirstReview === true),
    entryUndated: count(rows, incident => incident.entry === null),
  };
});
const allDuringLags = incidents.filter(incident => incident.detection_route !== 'final audit' && incident.lag !== null).map(incident => incident.lag);
// Timing of the inference and reporting errors relative to the change of aim, which commit 143605893
// records at 26 Sep 20:37:47 +0200 (day 9); days 9 and 10 are 26 and 27 September.
const CHANGE_OF_AIM = Date.UTC(2026, 8, 26, 18, 37, 47);
const inferenceTiming = {
  enteredOnDays9And10: byCategory('I').filter(incident => incident.entry && incident.entry.day >= 26).map(incident => incident.id),
  enteredWithin70MinutesBeforeChangeOfAim: byCategory('I').filter(incident => incident.entry && toMs(incident.entry) <= CHANGE_OF_AIM && CHANGE_OF_AIM - toMs(incident.entry) <= 70 * 60e3)
    .map(incident => `${incident.id} (${Math.round((CHANGE_OF_AIM - toMs(incident.entry)) / 60e3)} min before)`),
};

// ---------- sensitivity: realised consequences only ----------
// Each exclusion is justified by a phrase that must occur in the register's consequence text.
const WITHOUT_REALISED = [
  ['I05', 'did not demonstrate any false pass'],
  ['I06', 'Latent'],
  ['I09', 'Latent'],
  ['I32', 'Latent'],
  ['I29', 'No decision depended on it'],
  ['I30', 'The manuscripts do not use the number'],
];
for (const [id, phrase] of WITHOUT_REALISED) {
  const incident = incidents.find(row => row.id === id);
  if (!incident.consequence.includes(phrase)) throw new Error(`${id}: consequence no longer contains "${phrase}"`);
}
const realised = incidents.filter(incident => !WITHOUT_REALISED.some(([id]) => id === incident.id));
const sensitivity = CATEGORIES.map(([code, label]) => ({ code, label, total: count(realised, incident => incident.category === code), finalAudit: count(realised, incident => incident.category === code && incident.detection_route === 'final audit') }));

// ---------- stored lagHours against the rules ----------
const lagDifferences = incidents.filter(incident => incident.detection_route !== 'final audit')
  .filter(incident => incident.storedLag !== incident.lag)
  .map(incident => ({ id: incident.id, stored: incident.storedLag, recomputed: incident.lag }));
const auditStoredLagsDifferingFromNoon = incidents.filter(incident => incident.detection_route === 'final audit')
  .map(incident => ({ id: incident.id, stored: incident.storedLag, entry: clock(incident.entry) }));

// ---------- what the agent coders saw ----------
// incident-coding-input.json is what both coders read: component, description, consequence.
const coderInput = new Map((await load('incident-coding-input.json')).map(row => [row.id, row]));
const auditDetected = incidents.filter(incident => incident.detection_route === 'final audit');
const coderSaw = {
  fields: Object.keys(coderInput.get('I01')),
  auditDetectedWhoseTextNamesTheAudit: auditDetected.filter(incident => /\baudit\b/i.test(`${coderInput.get(incident.id).description} ${coderInput.get(incident.id).consequence}`)).map(incident => incident.id),
  auditDetected: auditDetected.length,
};

// ---------- commit screen ----------
let commitScreen = null;
try {
  const log = execFileSync('git', ['-C', repo, 'log', '--since=2026-09-18 00:00:00 +0200', '--until=2026-09-28 00:00:00 +0200', '--format=%x1e%h%x1f%s%x1f%b'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const commits = log.split('\x1e').filter(Boolean).map(record => { const [hash, subject, body = ''] = record.split('\x1f'); return { hash, subject, body }; });
  const pattern = /fix|correct|bug|wrong|defect|repair|revert|remediation|mistake|stale/i;
  const subjectMatches = commits.filter(commit => pattern.test(commit.subject));
  const bodyOnly = commits.filter(commit => !pattern.test(commit.subject) && pattern.test(commit.body));
  commitScreen = { window: '18-27 September 2026 (local time)', commits: commits.length, subjectMatches: subjectMatches.length, fullMessageMatches: subjectMatches.length + bodyOnly.length, bodyOnly: bodyOnly.map(commit => commit.hash) };
} catch (error) { commitScreen = { error: error.message }; }

// ---------- human-addressed messages in the operational logs ----------
async function humanMessages(file, pattern) {
  let text; try { text = await readFile(resolve(repo, file), 'utf8'); } catch { return []; }
  const lines = text.split('\n');
  return lines.flatMap((line, index) => pattern.test(line) ? [{ file, line: index + 1, text: line.trim(), next: (lines.slice(index + 1).find(next => next.trim()) ?? '').trim().slice(0, 120) }] : []);
}
const pipelineMessages = await humanMessages('evaluation/registry/overnight-pipeline.log', /a human/i);
const stallMessages = await humanMessages('evaluation/registry/stall-check.log', /a human/i);

// ---------- output ----------
const summary = {
  incidents: incidents.length,
  categories: Object.fromEntries(CATEGORIES.map(([code]) => [code, byCategory(code).length])),
  seams, components, componentCategory,
  routeByCategory: Object.fromEntries(routeRows.map(row => [row[0], Object.fromEntries(CATEGORIES.map(([code], index) => [code, row[index + 1]]))])),
  coverage, allDuringLagMax: Math.max(...allDuringLags), inferenceTiming,
  firstQuestioningPasses: { reviews: count(incidents, incident => incident.detection_route === 'separate review'), audit: count(incidents, incident => incident.detection_route === 'final audit') },
  sensitivity: { realised: realised.length, excluded: WITHOUT_REALISED.map(([id]) => id), byCategory: sensitivity },
  sourcesPerIncident: sourceCounts, auditLedgerOnly: auditOnly,
  lagDifferencesFromStored: lagDifferences, auditStoredLags: auditStoredLagsDifferingFromNoon,
  commitScreen, coderSaw,
  humanAddressedMessages: { pipeline: pipelineMessages, stallCheck: stallMessages.length },
  perIncident: incidents.map(incident => ({ id: incident.id, component: incident.component, category: incident.category, seam: incident.seam, route: incident.detection_route, entry: clock(incident.entry), entryRule: incident.entry?.rule ?? null, detection: incident.detection?.audit ? `${AUDIT_DAY} (final audit)` : clock(incident.detection), lag: incident.lag, lagIsUpperBound: incident.lagIsUpperBound, sources: [...sourcesOf.get(incident.id)].sort().join('') })),
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  const out = [];
  out.push('# Incident register: regenerated tables\n');
  out.push('## Table 1. Screening funnel\n', table(['Source', 'Candidates', 'Mapped to an incident', 'Excluded'], funnelRows), '');
  out.push(`Sources per incident: ${Object.entries(sourceCounts).map(([k, v]) => `${v} incidents with ${k} source(s)`).join(', ')}. Only in the audit ledger (source c): ${auditOnly.join(', ')}.\n`);
  out.push('## Table 2. Categories and seams\n', table(['Category', 'Incidents'], CATEGORIES.map(([code, label]) => [label, byCategory(code).length])), '');
  out.push(`Seams: ${JSON.stringify(seams)}. Components: ${JSON.stringify(components)}.\nComponent by category: ${JSON.stringify(componentCategory)}\n`);
  out.push('## Table 3. Route of first detection by category\n', table(['First detected by', ...CATEGORIES.map(([, label]) => label)], routeRows), '');
  out.push('## Coverage and lags (detections during the programme only)\n', table(['Category', 'Incidents', 'Detected during the programme', 'Dated lags', 'Median lag (h)', 'Range (h)', 'Entered after the first review', 'Entry undated'], coverage.map(row => [row.label, row.total, row.detectedDuringProgramme, row.datedLags, row.medianLag ?? '-', row.datedLags ? `${row.minLag}-${row.maxLag}` : '-', row.enteredAfterFirstReview, row.entryUndated])), '');
  out.push(`Longest dated lag of any detection during the programme: ${summary.allDuringLagMax} h. First detections by the two reviews: ${summary.firstQuestioningPasses.reviews}; by the final audit: ${summary.firstQuestioningPasses.audit}.\n`);
  out.push(`Inference and reporting errors entered on days 9 and 10: ${inferenceTiming.enteredOnDays9And10.length} (${inferenceTiming.enteredOnDays9And10.join(", ")}); within 70 minutes before the change of aim: ${inferenceTiming.enteredWithin70MinutesBeforeChangeOfAim.join(", ")}.\n`);
  out.push('## Sensitivity: incidents with a realised consequence\n', table(['Category', 'Incidents', 'First detected by the final audit'], sensitivity.map(row => [row.label, row.total, row.finalAudit])), `\nExcluded: ${WITHOUT_REALISED.map(([id, phrase]) => `${id} ("${phrase}")`).join('; ')}. Remaining incidents: ${realised.length}.\n`);
  out.push('## Per incident\n', table(['ID', 'Component', 'Category', 'Route', 'Entry (rule)', 'Detection', 'Lag (h)', 'Stored lagHours', 'Sources'], incidents.map(incident => [incident.id, incident.component, incident.category + (incident.seam ? `: ${incident.seam}` : ''), incident.detection_route, `${clock(incident.entry)}${incident.entry?.rule && incident.entry.rule !== 'first date and time' ? ` (${incident.entry.rule})` : ''}`, incident.detection?.audit ? `${AUDIT_DAY} (audit)` : clock(incident.detection), incident.lag === null ? '-' : `${incident.lagIsUpperBound ? '<=' : ''}${incident.lag}`, incident.storedLag ?? '-', [...sourcesOf.get(incident.id)].sort().join('')])), '');
  out.push(`Detections during the programme whose recomputed lag differs from the stored lagHours: ${lagDifferences.map(row => `${row.id} (${row.stored ?? '-'} -> ${row.recomputed ?? 'undated'})`).join(', ')}.\n`);
  out.push('## What the agent coders saw\n', `Fields per incident: ${coderSaw.fields.join(', ')}. Of the ${coderSaw.auditDetected} incidents the final audit detected, the coder text names the audit for ${coderSaw.auditDetectedWhoseTextNamesTheAudit.length} (${coderSaw.auditDetectedWhoseTextNamesTheAudit.join(', ')}).\n`);
  out.push('## Commit screen\n', commitScreen.error ? `git unavailable: ${commitScreen.error}` : `${commitScreen.commits} commits in ${commitScreen.window}; ${commitScreen.subjectMatches} subject lines match the correction pattern; ${commitScreen.fullMessageMatches} full messages match; ${commitScreen.bodyOnly.length} match only in the body:\n${commitScreen.bodyOnly.join(' ')}\n`);
  out.push('## Human-addressed messages\n', table(['Line', 'Message', 'Next line'], pipelineMessages.map(message => [message.line, message.text.replace(/\|/g, '/'), message.next.replace(/\|/g, '/')])), `\nStall-check alarms addressed to "a human or an agent": ${stallMessages.length}.`);
  console.log(out.join('\n'));
}
