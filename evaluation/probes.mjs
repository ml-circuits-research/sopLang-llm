// Capability-probe suite (DS009 "Capability preservation").
//
// One implementation, shared by the untuned-base baseline and the holdout run of
// a fine-tuned checkpoint, so every served artifact is scored with exactly the
// suite the base model was scored with. The probes are evaluation-only material:
// they never enter training, and they exist to detect a substrate loss (weak
// JavaScript semantics or instruction following) after a narrow SOP Lang
// mixture rather than to measure the compilation task.

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { answerMatches, normalizeAnswer } from '../teacher/naming.mjs';
import { parseCircuit } from '../runtime/parser.mjs';
import { buildMessages, extractProgram } from './client.mjs';
import { generate } from './client.mjs';

const REPOSITORY_ROOT = fileURLToPath(new URL('..', import.meta.url));

export const PROBES_PATH = join(REPOSITORY_ROOT, 'evaluation/probes/capability-probes.json');

export function loadProbes(path = PROBES_PATH) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function sha256OfText(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(concurrency, items.length)) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

/** One generation per probe; the class vocabulary is the evaluation loop's, minus the parse stages. */
export async function scoreProbes({
  suite = loadProbes(),
  base,
  model = undefined,
  concurrency = 1,
  maxTokens = 256,
  timeoutMs = null,
}) {
  const records = await mapWithConcurrency(suite.probes, concurrency, async (probe) => {
    const result = await generate({
      base,
      model,
      messages: [
        { role: 'system', content: suite.systemPrompt },
        { role: 'user', content: probe.prompt },
      ],
      temperature: 0,
      maxTokens,
      ...(timeoutMs === null ? {} : { timeoutMs }),
    });
    const completion = result.completion;
    const text = completion === null ? '' : completion.trim();
    // A quoted result is a formatting deviation, not a capability loss, so the
    // normalized comparison strips one layer of wrapping quotes; the exact
    // instruction probes stay strict.
    const bare = text.replace(/^["'`]+/, '').replace(/["'`]+$/, '');
    const matched = text !== '' &&
      (probe.comparison === 'exact' ? text === probe.expected : normalizeAnswer(bare) === normalizeAnswer(probe.expected));
    return {
      item: `probe/${probe.id}`,
      kind: probe.kind,
      class: completion === null ? 'generation_transport_error' : matched ? 'answer_match' : 'answer_mismatch',
      expected: probe.expected,
      comparison: probe.comparison,
      answer: text === '' ? null : text,
      generated: {
        tokens: result.usage?.completion_tokens ?? null,
        promptTokens: result.usage?.prompt_tokens ?? null,
        attempts: result.attempts,
        latencyMs: result.latencyMs,
      },
      completion,
    };
  });
  records.sort((left, right) => (left.item < right.item ? -1 : 1));
  return { profile: suite.profile, systemPromptSha256: sha256OfText(suite.systemPrompt), records };
}

/**
 * Compiled-plan mode of a probe suite: the same probes, but the model must
 * COMPILE them. Each prompt goes through the recorded compiled-plan profile, the
 * completion is post-processed into a program, the program is executed by the
 * runtime, and the executed answer is compared with the expected value. This is
 * the mode the project trains for: a text task such as counting a letter becomes
 * solvable when the plan delegates the count to `jsEval`, which direct-answer
 * mode cannot do.
 */
export async function scoreProbesCompiled({
  suite = loadProbes(),
  base,
  model = undefined,
  concurrency = 1,
  maxTokens = 1024,
  timeoutMs = null,
  runtime,
}) {
  const records = await mapWithConcurrency(suite.probes, concurrency, async (probe) => {
    const result = await generate({
      base,
      model,
      messages: buildMessages(probe.prompt),
      temperature: 0,
      maxTokens,
      ...(timeoutMs === null ? {} : { timeoutMs }),
    });
    const generated = {
      tokens: result.usage?.completion_tokens ?? null,
      promptTokens: result.usage?.prompt_tokens ?? null,
      attempts: result.attempts,
      latencyMs: result.latencyMs,
    };
    if (result.error !== null) {
      return { item: `probe/${probe.id}`, kind: probe.kind, class: 'generation_transport_error', expected: probe.expected, comparison: probe.comparison, answer: null, detail: result.error.message, completion: result.completion, generated };
    }
    const extracted = extractProgram(result.completion);
    if (!extracted.ok) {
      return { item: `probe/${probe.id}`, kind: probe.kind, class: 'wrapper_rejected', expected: probe.expected, comparison: probe.comparison, answer: null, detail: extracted.reason, completion: result.completion, generated };
    }
    let outcome;
    try {
      outcome = await runtime.run(parseCircuit(extracted.program), { outputs: ['answer'] });
    } catch (error) {
      outcome = { status: 'failed', code: 'parse_error', error: { message: error.message } };
    }
    const answer = outcome.status === 'completed' ? String(outcome.outputs.answer) : null;
    const className = outcome.status !== 'completed'
      ? 'execution_error'
      : statesValue(probe.expected, answer) ? 'answer_match' : 'answer_mismatch';
    return {
      item: `probe/${probe.id}`,
      kind: probe.kind,
      class: className,
      expected: probe.expected,
      comparison: probe.comparison,
      answer,
      detail: outcome.status === 'completed' ? null : `${outcome.status}:${outcome.code ?? ''}`,
      completion: result.completion,
      generated,
    };
  });
  records.sort((left, right) => (left.item < right.item ? -1 : 1));
  return { profile: suite.profile, systemPromptSha256: null, records };
}

/**
 * Value comparison for compiled-plan mode. An executed circuit phrases its result
 * in the words of its plan ("3 times.", "The workshop can order 10 whole crates and
 * has 7 units left."), so the declared tolerance is: a numeric expectation must
 * equal the FIRST number the answer states, and any other expectation must appear
 * as a standalone token or under the shared answer normalization. The rule is
 * declared here, stated in every compiled-mode run manifest, and covered by
 * tests/text-probes.test.mjs, so a tolerance can never be widened silently.
 */
export function statesValue(expected, answer) {
  const wanted = String(expected ?? '').trim();
  if (answer === null || wanted === '') return false;
  const text = String(answer);
  if (/^-?\d+(?:\.\d+)?$/.test(wanted)) {
    const first = text.match(/-?\d+(?:\.\d+)?/);
    return first !== null && Math.abs(Number(first[0]) - Number(wanted)) < 1e-9;
  }
  const tokens = text.toLowerCase().match(/[a-z0-9.,+-]+/g) ?? [];
  return tokens.includes(wanted.toLowerCase()) || answerMatches(wanted, text);
}

export function summaryOf(records) {
  const byKind = {};
  for (const record of records) {
    byKind[record.kind] ??= { items: 0, passed: 0 };
    byKind[record.kind].items += 1;
    if (record.class === 'answer_match') byKind[record.kind].passed += 1;
  }
  return { profile: null, items: records.length, passed: records.filter((record) => record.class === 'answer_match').length, byKind };
}

export function renderProbesReport({ experiment, artifact, profile, records }) {
  const summary = summaryOf(records);
  const lines = [];
  lines.push(`# Capability probes — ${experiment}`);
  lines.push('');
  lines.push(`Suite \`${profile}\`, ${summary.items} probes, **${summary.passed}/${summary.items} passed**, served artifact \`${artifact ?? 'not recorded'}\`.`);
  lines.push('');
  lines.push('| kind | passed | items |');
  lines.push('| --- | --- | --- |');
  for (const [kind, counts] of Object.entries(summary.byKind)) {
    lines.push(`| ${kind} | ${counts.passed} | ${counts.items} |`);
  }
  lines.push('');
  lines.push('| probe | kind | class | expected | answer |');
  lines.push('| --- | --- | --- | --- | --- |');
  for (const record of records) {
    const answer = record.answer === null ? '(empty)' : String(record.answer).replace(/\|/g, '\\|').replace(/\n/g, ' ').slice(0, 60);
    lines.push(`| ${record.item} | ${record.kind} | ${record.class} | ${record.expected} | ${answer} |`);
  }
  lines.push('');
  lines.push('The probe suite is a loss detector for the language and code substrate, not a score of the compilation task: a checkpoint that passes fewer probes than the untuned base has lost general capability while gaining SOP Lang syntax, which is the signal `DS009` uses to change the mixture or the recipe.');
  lines.push('');
  return lines.join('\n');
}
