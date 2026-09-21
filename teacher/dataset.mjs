/**
 * The dataset artifact contract: the text files the pilot writes.
 *
 * A run produces, per accepted example, `problem.md` (the solver-visible
 * projection), `solution.sop` (the compiled plan), and `explanation.md`; the
 * rejected candidates are preserved with their reasons; and the dataset root
 * carries the manifest index with one manifest file per unit of work, the
 * dataset report, and the shared source inventory. Every page is generated and
 * gated before anything is written, so a policy violation leaves the previous
 * dataset intact.
 */

import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { normalizeAnswer } from './naming.mjs';
import { join, dirname } from 'node:path';
import { registerDocxSource } from '../context/sources/docx.mjs';
import { SOURCES } from './sources/index.mjs';
import { assertEnglishContent } from './language.mjs';
import { contentHash, planHashOf } from './hashing.mjs';
import { solverText } from './statements.mjs';

/** The canonical dataset root the pilot writes when no other root is given. */
export const OUTPUT_ROOT = 'training-data';

export function writeDataset({ source, registration, accepted, rejected, split, outputRoot }) {
  const root = join(outputRoot, source.id);

  // Every file is generated and gated before anything is written, so a policy
  // violation can never leave a partial dataset behind.
  const files = [];
  const rows = [];
  for (const item of accepted) {
    const inEval = split.has(item.problem.id);
    const category = item.entry.category;
    const relative = inEval
      ? ['eval', category, item.problem.type, item.problem.folder].join('/')
      : [category, item.problem.type, item.problem.folder].join('/');
    const problemText = problemFile(item.problem, item.entry);
    const solutionText = `${item.verification.program}\n`;
    const answerStatus = statusOf(item, source);
    const explanationText = explanationFile(item, source, answerStatus);
    files.push({ relative: join(relative, 'problem.md'), content: problemText });
    files.push({ relative: join(relative, 'solution.sop'), content: solutionText });
    files.push({ relative: join(relative, 'explanation.md'), content: explanationText });
    assertEnglishContent(item.shippedAnswer ?? item.problem.printedAnswer, `${relative} shipped answer`);
    rows.push({
      relative,
      problem: item.problem.id,
      order: item.problem.order,
      title: item.problem.title,
      unit: source.unitOf(item.problem),
      ...(source.secondary === null ? {} : { secondary: source.secondary.of(item.problem) }),
      template: item.problem.templateKey,
      type: item.problem.type,
      category,
      split: inEval ? 'eval' : 'train',
      ...(source.kind === 'generated'
        ? { instance: String(item.problem.instanceIndex + 1), seed: String(source.seed) }
        : { paragraphs: `${item.problem.paragraphSpan.from}-${item.problem.paragraphSpan.to}` }),
      answer: item.shippedAnswer ?? item.problem.printedAnswer,
      answerStatus,
      planHash: planHashOf(item),
      hashes: [contentHash(problemText), contentHash(solutionText), contentHash(explanationText)]
    });
  }

  for (const item of rejected) {
    const relative = join('rejected', item.problem.folder);
    files.push({ relative: join(relative, 'problem.md'), content: problemFile(item.problem) });
    // The rejection record quotes the printed answer verbatim as provenance,
    // so it is the one generated file the English gate does not scan.
    files.push({ relative: join(relative, 'rejection.md'), content: rejectionFile(item), gated: false });
  }

  // Split integrity: no eval example may share its plan fingerprint with a
  // training row. A compiled circuit embeds the values it was compiled from,
  // so the plan fingerprint — the facts and compute body — is what would make
  // an eval item a near-copy of a training item. The clustering in
  // selectEvalSplit guarantees this, and the assertion makes the guarantee
  // load-bearing instead of incidental.
  const trainPlans = new Set(rows.filter((row) => row.split === 'train').map((row) => row.planHash));
  for (const row of rows.filter((candidate) => candidate.split === 'eval')) {
    if (trainPlans.has(row.planHash)) {
      throw new Error(`Holdout example ${row.problem} shares its plan fingerprint ${row.planHash} with a training row.`);
    }
  }

  const sourcesContent = sourcesFile(registeredSources(outputRoot, source, registration));
  const blemishes = findTextBlemishes(accepted.map((item) => item.problem));
  files.push(...buildManifestFiles({ rows, source }));
  files.push({ relative: 'report.md', content: reportFile({ source, registration, accepted, rejected, split, rows, blemishes }) });

  // Gate every generated file before anything is written: the manifest and
  // report inherit printed answers and titles from the source, so they are
  // scanned exactly like the per-problem artifacts, and a violation leaves the
  // previous dataset intact instead of a half-rewritten tree.
  for (const file of files) {
    if (file.gated !== false) {
      assertEnglishContent(file.content, file.relative);
    }
  }
  assertEnglishContent(sourcesContent, 'sources.md');

  if (existsSync(root)) {
    rmSync(root, { recursive: true, force: true });
  }
  mkdirSync(root, { recursive: true });
  for (const file of files) {
    const target = join(root, file.relative);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, file.content);
  }
  mkdirSync(outputRoot, { recursive: true });
  writeFileSync(join(outputRoot, 'sources.md'), sourcesContent);
}

function problemFile(problem, entry = undefined) {
  const body = entry === undefined ? problem.statement : solverText(entry, problem);
  return [`# ${problem.id} — ${problem.title}`, '', body, ''].join('\n');
}

/**
 * The printed-answer status of an accepted item. The pilot stores the whole
 * verification result of `verifyProblem` as `item.verification`, so the class
 * and the status live in its own `verification` field.
 */
function printedStatusOf(item) {
  return item.verification?.verification?.printedStatus ?? 'match';
}

/**
 * The status of a shipped answer. A family that declares `printedAnswerStatus`
 * ships its computed answer while the printed answer stays reference material;
 * a source that normalizes its printed answer ships the normalized text; every
 * other example ships the printed answer verbatim.
 */
function statusOf(item, source) {
  const declared = printedStatusOf(item);
  if (declared !== 'match') {
    return declared;
  }
  const printed = item.problem.printedAnswer;
  const shipped = item.shippedAnswer ?? printed;
  return normalizeAnswer(shipped) === normalizeAnswer(printed) ? 'match' : 'normalized';
}

/** The labelled line that records where the shipped answer came from. */
function sourceAnswerLine(item, status) {
  const reason = typeof item.entry.printedAnswerReason === 'string' ? item.entry.printedAnswerReason : '';
  if (status === 'normalized') {
    return '**Source answer.** The source prints this answer in a form the English-only dataset policy cannot ship; the source registration declares the English equivalent used here, and the printed form stays in the book.';
  }
  if (status === 'alternative' || status === 'inconsistent') {
    return `**Source answer.** ${item.problem.printedAnswer} — ${reason} The shipped answer is computed from the statement, and this example is \`computed_verified\` rather than \`exact_verified\`.`;
  }
  return null;
}

function explanationFile(item, source, status = 'match') {
  const { problem, entry, verification } = item;
  const { solution, parsedSlots } = verification;
  const steps = entry.explain(parsedSlots, solution);
  const lines = [
    `# Explanation ${problem.id} — ${problem.title}`,
    '',
    '## Explanation',
    '',
    ...steps.map((step, index) => `${index + 1}. ${step}`),
    ''
  ];
  if (Array.isArray(problem.steps) && problem.steps.length > 0 && source.kind !== 'generated') {
    const sourceSteps = problem.steps.map((step, index) => `${index + 1}. ${step}`);
    lines.push(
      `Reference solution as printed in the source (${source.unitLabel} ${source.unitOf(problem)}, ${problem.steps.length} steps):`,
      '',
      ...sourceSteps,
      ''
    );
  }
  if (typeof problem.explanation === 'string' && problem.explanation !== '' && source.kind !== 'generated') {
    lines.push('Reference material as printed in the source:', '', problem.explanation, '');
  }
  if (source.kind === 'generated') {
    lines.push(
      `**Generator provenance.** ${source.generator} ${source.generatorVersion}, family ${problem.familyId}, instance ${problem.instanceIndex + 1}, sampled with seed ${source.seed} from the latent plan \`${problem.latentPlan}\`; this example carries no source span because its statement was generated.`,
      ''
    );
  }
  lines.push(
    '## Result',
    '',
    `**Answer.** ${item.shippedAnswer ?? problem.printedAnswer}`,
    '',
    `**Verification.** ${source.assuranceClass ?? verification.verification.class}: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in \`report.md\`.`,
    '',
    '**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).',
    ''
  );
  const sourceLine = sourceAnswerLine(item, status);
  if (sourceLine !== null) {
    lines.splice(lines.indexOf('## Result'), 0, sourceLine, '');
  }
  return lines.join('\n');
}

function rejectionFile(item) {
  return [
    `# Rejection ${item.problem.id} — ${item.problem.title}`,
    '',
    `**Reason.** ${item.reason}`,
    '',
    `**Printed answer.** ${item.problem.printedAnswer}`,
    ''
  ].join('\n');
}

function manifestHeader(title, columnLabels) {
  return [
    `# ${title}`,
    '',
    `One row per accepted example. \`split\` is \`train\` or \`eval\`, and an \`eval\` example is excluded from the training sets. \`status\` is \`match\` when the answer the circuit reproduces is the printed answer, \`normalized\` when the source declares an English equivalent for it, and \`alternative\` or \`inconsistent\` when the printed answer is reference material rather than a value the statement determines (the computed answer is shipped and the class is \`computed_verified\`). The three hashes identify \`problem.md\`, \`solution.sop\`, and \`explanation.md\`; \`plan\` fingerprints the deterministic plan (facts and compute body) of the circuit, which is what the variants of one template share.`,
    '',
    `| ${columnLabels.join(' | ')} |`,
    `| ${columnLabels.map(() => '---').join(' | ')} |`
  ];
}

/**
 * A manifest cell may contain the column separator (the level-separated
 * answers of the scientific-reasoning book do), so the separator is escaped
 * inside values and the reader splits on unescaped pipes only.
 */
function escapeCell(value) {
  return String(value).replaceAll('|', '\\|');
}

function manifestRow(row, columnLabels) {
  // A generated example has no source span: its provenance is the instance it
  // was sampled as and the seed it was sampled from, in the same column slot.
  const identity = row.paragraphs === undefined ? [row.instance, row.seed] : [row.paragraphs];
  const values = ([
    row.relative,
    row.problem,
    row.unit,
    ...(row.secondary === undefined ? [] : [row.secondary]),
    row.template,
    row.type,
    row.category,
    row.split,
    ...identity,
    row.answer,
    row.answerStatus,
    row.planHash,
    row.hashes[0],
    row.hashes[1],
    row.hashes[2]
  ]).map(escapeCell);
  if (values.length !== columnLabels.length) {
    throw new Error(`Manifest row for ${row.problem} has ${values.length} values for ${columnLabels.length} columns.`);
  }
  return `| ${values.join(' | ')} |`;
}

/**
 * Builds the manifest files as content, so the writer can gate every page
 * before the dataset root is touched. The index records the count and the
 * content hash of every unit file, which is what makes the index and the unit
 * manifests verifiable against each other.
 */
function buildManifestFiles({ rows, source }) {
  const byUnit = new Map();
  for (const row of rows) {
    const list = byUnit.get(row.unit) ?? [];
    list.push(row);
    byUnit.set(row.unit, list);
  }
  const units = [...byUnit.keys()].sort(compareUnits);
  const columnLabels = [
    'folder',
    'problem',
    source.unitLabel,
    ...(source.secondary === null ? [] : [source.secondary.label]),
    'template',
    'type',
    'category',
    'split',
    ...(source.kind === 'generated' ? ['instance', 'seed'] : ['paragraphs']),
    'answer',
    'status',
    'plan',
    'problem',
    'solution',
    'explanation'
  ];
  const index = [
    '# Manifest',
    '',
    `The manifest is split by ${source.unitLabel} so a long table stays reviewable. Each ${source.unitLabel} manifest holds one row per accepted example, and the index records the counts and the content hash of every ${source.unitLabel} file. \`distinct plans\` counts the plan fingerprints of the ${source.unitLabel}: the compiled circuits differ between variants of one template because they embed their instance values, so the plan fingerprint is the latent-plan measure.`,
    '',
    `| ${source.unitLabel} | examples | train | eval | knowledge | no-knowledge | distinct plans | file | hash |`,
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |'
  ];
  const files = [];
  for (const unit of units) {
    const unitRows = [...byUnit.get(unit)].sort(compareRows);
    const lines = [...manifestHeader(`Manifest, ${source.unitLabel} ${unit}`, columnLabels), ...unitRows.map((row) => manifestRow(row, columnLabels)), ''];
    const content = lines.join('\n');
    const relative = `manifest/${source.manifestFile(unit)}`;
    files.push({ relative, content });
    const distinct = new Set(unitRows.map((row) => row.planHash)).size;
    index.push(
      `| ${unit} | ${unitRows.length} | ${unitRows.filter((row) => row.split === 'train').length} | ${unitRows.filter((row) => row.split === 'eval').length} | ${unitRows.filter((row) => row.category === 'knowledge').length} | ${unitRows.filter((row) => row.category === 'no-knowledge').length} | ${distinct} | ${relative} | ${contentHash(content)} |`
    );
  }
  index.push('', `Total accepted examples: ${rows.length}.`, '');
  files.push({ relative: 'manifest.md', content: index.join('\n') });
  return files;
}

function compareUnits(left, right) {
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }
  return String(left).localeCompare(String(right));
}

/**
 * The source inventory lists every registered book that already owns a dataset
 * directory under the root, together with the book of the current run, so
 * writing one book never drops the inventory row of another.
 */
function registeredSources(outputRoot, currentSource, currentRegistration) {
  return SOURCES.filter((candidate) => candidate.id === currentSource.id || existsSync(join(outputRoot, candidate.id, 'manifest'))).map(
    (candidate) => ({
      source: candidate,
      // A generated source has no document to register: it is identified by its
      // generator module and the seed its instances were sampled from.
      registration: candidate.kind === 'generated'
        ? null
        : candidate.id === currentSource.id
          ? currentRegistration
          : registerDocxSource(candidate.path)
    })
  );
}

/** The locator sentence of a report: a book shows its extraction, a generated source its generator. */
function sourceLineOf(source, registration) {
  if (source.kind === 'generated') {
    return `\`${source.path}\` (generator ${source.generator} ${source.generatorVersion}, seed ${source.seed}, ${source.instancesPerFamily} instances per family)`;
  }
  return `\`${source.path}\` (raw ${registration.rawHash.slice(0, 16)}, canonical ${registration.canonicalHash.slice(0, 16)}, extractor ${registration.extractor})`;
}

function sourcesFile(entries) {
  const books = entries.filter(({ source }) => source.kind !== 'generated');
  const generated = entries.filter(({ source }) => source.kind === 'generated');
  const lines = [
    '# Sources',
    '',
    'Source inventory of the pilot pipeline. Rights status is recorded per source and determines whether a derivative may appear in a released artifact.',
    '',
    '| source | path | role | raw hash | canonical hash | extractor | paragraphs | rights | permitted use |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...books.map(
      ({ source, registration }) =>
        `| ${source.id} | ${source.path} | seed book | ${registration.rawHash} | ${registration.canonicalHash} | ${registration.extractor} | ${registration.paragraphs.length} | ${source.rights} | ${source.permittedUse} |`
    ),
    ''
  ];
  if (generated.length > 0) {
    lines.push(
      '## Generated sources',
      '',
      'A generated source has no document parser, no paragraph spans, and no extracted text: its statements come from the generator named below, and every accepted example records the generator version, the family, the instance index, and the sampling seed in place of a source span (DS008, "Procedural source families").',
      '',
      '| source | generator | version | seed | instances per family | rights | permitted use |',
      '| --- | --- | --- | --- | --- | --- | --- |',
      ...generated.map(
        ({ source }) =>
          `| ${source.id} | ${source.path} | ${source.generatorVersion} | ${source.seed} | ${source.instancesPerFamily} | ${source.rights} | ${source.permittedUse} |`
      ),
      ''
    );
  }
  return lines.join('\n');
}

/**
 * Family integrity checks. Acceptance already proves that the executed circuit
 * computed the printed answer from the statement, so a family cannot pass by
 * copying the source label. What remains reportable is how much recomputation
 * the accepted variants actually exercise: a template whose variants all print
 * one answer does not test that the computation reacts to its input, and a
 * template with several variants and several answers does.
 */
function integrityFindings(accepted) {
  const byTemplate = new Map();
  for (const item of accepted) {
    const group = byTemplate.get(item.problem.templateKey) ?? { variants: 0, answers: new Set(), type: item.problem.type };
    group.variants += 1;
    group.answers.add(item.problem.printedAnswer);
    byTemplate.set(item.problem.templateKey, group);
  }
  let multiVariant = 0;
  let multiAnswer = 0;
  const constantAnswer = [];
  for (const [template, group] of byTemplate) {
    if (group.variants > 1) {
      multiVariant += 1;
      if (group.answers.size > 1) {
        multiAnswer += 1;
      } else {
        constantAnswer.push(`${template} (${group.variants} variants, one printed answer)`);
      }
    }
  }
  return {
    templates: byTemplate.size,
    multiVariant,
    multiAnswer,
    constantAnswer: constantAnswer.sort()
  };
}

/**
 * Source-owned text blemishes. The extractor is faithful to the printed page:
 * when the book itself prints a word glued to a digit ("0 or1"), the canonical
 * text carries the defect and the pipeline records it instead of silently
 * rewriting the statement. The scan runs before the manifest is locked, and the
 * report lists every finding next to the accepted counts, so a reviewer sees
 * the residual source defects rather than discovering them downstream.
 */
const GLUED_WORD_PATTERN = /([a-z]{2,})(\d)|(\d)([a-z]{2,})\b/g;
const ORDINAL_SUFFIX = /^(st|nd|rd|th)$/;

export function findTextBlemishes(problems) {
  const findings = [];
  for (const problem of problems) {
    const text = `${problem.title} ${problem.statement}`;
    for (const match of text.matchAll(GLUED_WORD_PATTERN)) {
      if (match[4] !== undefined && ORDINAL_SUFFIX.test(match[4])) {
        continue;
      }
      findings.push(`${problem.id}: ${match[0]}`);
    }
  }
  return findings;
}

function reportFile({ source, registration, accepted, rejected, split, rows, blemishes = [] }) {
  const byCategory = countBy(accepted, (item) => item.entry.category);
  const byType = countBy(accepted, (item) => `${item.entry.category}/${item.problem.type}`);
  const byUnit = countBy(accepted, (item) => source.unitOf(item.problem));
  const byReason = countBy(rejected, (item) => item.reason.split(':')[0]);
  const distinctPlans = new Set(rows.map((row) => row.planHash));
  const distinctCircuits = new Set(rows.map((row) => row.hashes[1]));
  const evaluated = rows.filter((row) => row.split === 'eval').length;
  const lines = [
    '# Dataset report',
    '',
    `Source: ${sourceLineOf(source, registration)}.`,
    '',
    `Accepted examples: ${accepted.length}. Rejected candidates: ${rejected.length}. Evaluation holdout: ${evaluated} (${((evaluated / Math.max(1, accepted.length)) * 100).toFixed(1)}%). Distinct plans: ${distinctPlans.size}. Distinct compiled circuits: ${distinctCircuits.size} (a circuit embeds the values it was compiled from, so the count equals the accepted set unless two problems compile to identical text).`,
    '',
    source.kind === 'generated'
      ? `Acceptance class: every accepted example is \`${source.assuranceClass}\` as defined by \`DS008-training-data\`: the executed circuit produced the answer of the recorded latent plan, and the family oracle computed that answer by an independent route. The printed-answer signal of a book source does not exist for a generated instance, so the manifest rows record the generator, the family, the instance index, and the sampling seed instead of a source span.`
      : 'Acceptance class: every accepted example is `exact_verified` in the qualified sense defined by `DS008-training-data`: the executed circuit produced the printed answer, and the family computation reproduced it from the same reference parse. The independence that qualifies is stated under Limitations. An example whose printed answer the statement does not determine ships the computed answer instead and is `computed_verified`; it is listed under "Answers not shipped as printed".',
    '',
    'Probes: every assembled circuit carries the probe harness of `teacher/families/probes.mjs` inside its `jsEval` answer stage — two assertions on the compiled `slots` wire and one assertion on the computed answer — so a malformed input or an empty result ends the run with a structured `execution_error` instead of publishing a wrong value.',
    '',
    '## Accepted by category',
    ''
  ];
  for (const [category, count] of [...byCategory].sort()) {
    lines.push(`- ${category}: ${count}`);
  }
  lines.push('', '## Accepted by problem type', '');
  const typeEntries = [...byType]
    .sort((left, right) => (left[0] < right[0] ? -1 : 1))
    .map(([type, count]) => `${type} (${count})`);
  let currentLine = '';
  for (const entry of typeEntries) {
    if (currentLine.length + entry.length > 180) {
      lines.push(currentLine.trimEnd());
      currentLine = '';
    }
    currentLine += `${entry}, `;
  }
  if (currentLine !== '') {
    lines.push(currentLine.replace(/, $/, ''));
  }
  lines.push('');
  lines.push('', `## Accepted by ${source.unitLabel}`, '');
  for (const [unit, count] of [...byUnit].sort((left, right) => compareUnits(left[0], right[0]))) {
    lines.push(`- ${source.unitLabel} ${unit}: ${count}`);
  }
  if (source.secondary !== null) {
    const bySecondary = countBy(accepted, (item) => source.secondary.of(item.problem));
    lines.push('', `## Accepted by ${source.secondary.label}`, '');
    for (const [value, count] of [...bySecondary].sort((left, right) => left[0] - right[0])) {
      lines.push(`- ${source.secondary.label} ${value}: ${count}`);
    }
  }
  lines.push('', '## Rejected by reason', '');
  for (const [reason, count] of [...byReason].sort()) {
    lines.push(`- ${reason}: ${count}`);
  }
  const divergences = accepted.filter((item) => printedStatusOf(item) !== 'match');
  const normalized = rows.filter((row) => row.answerStatus === 'normalized');
  lines.push('', '## Answers not shipped as printed', '');
  if (divergences.length === 0 && normalized.length === 0) {
    lines.push('Every accepted example ships the answer its source prints.');
  }
  if (divergences.length > 0) {
    const groups = new Map();
    for (const item of divergences) {
      const key = `${item.entry.category}/${item.problem.type}`;
      const group = groups.get(key) ?? { count: 0, status: printedStatusOf(item), reason: item.entry.printedAnswerReason };
      group.count += 1;
      groups.set(key, group);
    }
    lines.push(
      '',
      `${divergences.length} accepted examples ship a computed answer because the statement does not determine the printed one; the printed answer stays in \`explanation.md\` as reference material and the class is \`computed_verified\`:`
    );
    for (const [type, group] of [...groups].sort()) {
      lines.push(`- ${type}: ${group.count} examples, printed answer ${group.status} — ${group.reason}`);
    }
  }
  if (normalized.length > 0) {
    lines.push(
      '',
      `${normalized.length} accepted examples ship a normalized answer because the source prints it in a form the English-only policy cannot ship; the source registration declares the equivalent:`
    );
    for (const [type, count] of [...countBy(normalized, (row) => row.type)].sort()) {
      lines.push(`- ${type}: ${count} examples`);
    }
  }
  const findings = integrityFindings(accepted);
  lines.push(
    '',
    '## Family integrity checks',
    '',
    `Templates covered: ${findings.templates}, of which ${findings.multiVariant} have several variants and ${findings.multiAnswer} of those print several distinct answers, which is what shows that the computation reacts to its input.`
  );
  if (findings.constantAnswer.length === 0) {
    lines.push('', 'No template with several variants prints one answer for every variant.');
  } else {
    lines.push('', 'Templates whose variants all print one answer, so the variants do not test recomputation:');
    for (const entry of findings.constantAnswer) {
      lines.push(`- ${entry}`);
    }
  }
  lines.push(
    '',
    '## Text blemishes',
    '',
    blemishes.length === 0
      ? 'The statement scan found no missing-space artifacts around digits.'
      : 'The source itself prints these missing-space artifacts around digits (a word glued to a digit); the extraction is faithful and does not repair them:',
    ...(blemishes.length === 0 ? [] : blemishes.map((finding) => `- ${finding}`))
  );
  lines.push(
    '',
    '## Limitations',
    '',
    '- The compiled values of every circuit come from the reference parse of its problem family, because the pilot runs without a teacher model: the shipped circuit is the plan a model would emit after reading the statement. The stage that replaces the reference parse with a real model call keeps the same acceptance checks.',
    '- `exact_verified` certifies that the circuit executed, that the family computation agreed with the printed answer, and that the executed circuit agreed with the family computation. The family `solve` and the circuit `jsEval` body are two transcriptions of one algorithm over one shared reference parse: for a template with several variants the agreement is checked over every variant, and for a single-variant template it certifies one instance. The circuit compute bodies keep the validity guards of their `solve` so a circuit never returns a value the oracle would reject. A structurally different oracle (for example the printed step list) is the next stage of independence and is not claimed here.',
    '- Problems without an implemented family are preserved under `rejected/` with the reason `family_not_implemented` and are the next work item of the pilot.',
    '- Statements that reference data of an earlier problem carry the referenced premise in `problem.md` under a labelled `Referenced context` line; an item without that context is rejected as `unresolved_reference` instead of shipping as an unanswerable example.',
    '- The evaluation holdout is selected deterministically from a hash ordering rather than by a random seed, so it is reproducible. Selection units are template clusters merged by shared plan fingerprint (the facts and compute body), so no eval example repeats a plan that appears in the training rows.',
    ''
  );
  return lines.join('\n');
}

function compareRows(left, right) {
  return left.order - right.order;
}

function countBy(items, keyOf) {
  const counts = new Map();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}
