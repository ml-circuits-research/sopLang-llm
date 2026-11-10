#!/usr/bin/env node
/**
 * Resumable evaluation of one served artifact over an item file, in one of three modes.
 *
 * - `compiled`: the model receives the recorded compiled-plan chat profile and must emit
 *   SOP Lang; the program is classified by the same ladder as `run-eval.mjs`.
 * - `js`: the model is asked for the body of one JavaScript function that returns the
 *   answer; the body runs as a single `jsEval` wire in the same sandbox, so execution,
 *   isolation, and budgets are identical to the compiled mode (program-aided baseline).
 * - `prose`: the model answers directly (the direct-answer baseline).
 * - `sop-icl`: an untuned model is taught SOP Lang only in the prompt: the compiled-plan system
 *   prompt, a short syntax guide, and `--shots` solved examples of trained types. The first
 *   ```sop block of the reply (or the reply from its first declaration on) is the program, so a
 *   model is not failed for prose around a correct program; that leniency is recorded.
 *
 * Every record is appended as soon as it is classified, and a restarted run skips the
 * (item, sample) pairs already recorded, so a job stopped because the shared GPU was
 * needed elsewhere resumes where it stopped. The script owns its llama-server child and
 * stops it on exit and on SIGTERM/SIGINT.
 *
 * Usage:
 *   node evaluation/run-items.mjs --experiment e1-js-base-05 --gguf training/checkpoints/base-f16.gguf \
 *       --slice holdout --mode js --shots 1 [--no-think] [--samples 1 --temperature 0] [--port 8141]
 *   node evaluation/run-items.mjs --experiment e2-l1-exp-012 --gguf evaluation/registry/exp-012-census/gguf/checkpoint-720.gguf \
 *       --items evaluation/registry/items-e2/L1.jsonl --mode compiled
 */
import { spawn } from 'node:child_process';
import { appendFileSync, closeSync, existsSync, mkdirSync, openSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';

import { SYSTEM_PROMPT, buildMessages } from './client.mjs';
import { classifyItem } from './run-eval.mjs';
import { PRESERVATION_SYSTEM_PROMPT } from '../training/preservation.mjs';
import { resolveSlice } from './slices.mjs';
import { LLAMA_SERVER, REPOSITORY_ROOT, aliasFor, serverArguments, waitForServer } from './server.mjs';
import { createRuntime } from '../runtime/kernel.mjs';
import { answerMatches } from '../teacher/naming.mjs';
import { OPS_EXAMPLES, OPS_SYSTEM, executePlan } from './operator-plans.mjs';

const JS_SYSTEM = [
  'You solve problems by writing JavaScript.',
  'Write the body of one function that computes the answer to the problem and returns it as a short string that states the answer.',
  'Use plain JavaScript only: no imports, no input or output, no external data.',
  'Reply with exactly one ```javascript code block that contains the function body and ends with a return statement.'
].join(' ');
// The one-shot example is a trained procedural composition, never a held-out type.
const JS_EXAMPLE = {
  statement: 'The river depot recorded 12, 30, 7, 25 and 41 crates. Please keep only the records above 20, then add the kept records, then add the fixed charge of 5. Report the result in crates.',
  body: 'const values = [12, 30, 7, 25, 41];\nconst kept = values.filter((value) => value > 20);\nconst total = kept.reduce((sum, value) => sum + value, 0);\nconst result = total + 5;\nreturn result + " units.";'
};
const SOP_GUIDE = [
  'SOP Lang syntax. A program is a list of wires. Each wire starts with a declaration line "@name command" at the start of a line, and its body is every following line up to the next declaration.',
  'The command "literal" takes a JSON body. The command "jsEval" takes a JavaScript function body: it reads another wire\'s value as $name and must end with a return statement whose value is the wire\'s value.',
  'The runtime runs wires in dependency order and returns the value of the wire named answer. Put the program in one ```sop code block.'
].join(' ');
// Solved examples of trained types only (never a held-out type), in the exact form of the training targets.
const SOP_EXAMPLES = [
  { statement: 'The market depot recorded 11, 7, 34, 29, 7 and 8 crates. Please keep only the records above 14, then add the kept records, then add the fixed charge of 3. Report the result in crates.',
    program: '@slots literal\n{"depot": "market depot", "unit": "crates", "values": [11, 7, 34, 29, 7, 8], "threshold": 14, "rate": 3}\n\n@answer jsEval\nconst kept = $slots.values.filter((value) => value > $slots.threshold);\nconst total = kept.reduce((sum, value) => sum + value, 0);\nreturn (total + $slots.rate) + " units.";' },
  { statement: 'A plant produces 246 units of bricks in one shift. Each crate holds 18 units. How many crates are needed, and how many units are in the last crate?',
    program: '@slots literal\n{"totalUnits": 246, "unitsPerCrate": 18}\n\n@crates jsEval\nreturn Math.ceil($slots.totalUnits / $slots.unitsPerCrate);\n\n@answer jsEval\nconst lastCrate = $slots.totalUnits - ($crates - 1) * $slots.unitsPerCrate;\nreturn $crates + " crates are needed, and the last crate holds " + lastCrate + " units.";' },
  { statement: 'How many times does the letter "s" appear in the word "mechanism"? Reply with only the number.',
    program: '@slots literal\n{"word": "mechanism", "letter": "s"}\n\n@answer jsEval\nconst count = [...$slots.word.toLowerCase()].filter((character) => character === $slots.letter).length;\nreturn count + " times.";' }
];
const PROSE_SYSTEM = 'Answer the problem directly and briefly. Give the final answer in one short sentence; no working, no explanation.';

function parseArguments(argv) {
  const options = { experiment: null, gguf: null, items: null, slice: null, mode: 'compiled', shots: 0, samples: 1,
    temperature: 0, seed: 20260928, maxTokens: 2048, perGroup: null, noThink: false, port: 8141, concurrency: 4, out: 'evaluation/registry' };
  for (let index = 0; index < argv.length; index++) {
    const flag = argv[index];
    const value = () => { if (index + 1 >= argv.length) throw new Error(`missing value for ${flag}`); return argv[++index]; };
    if (flag === '--experiment') options.experiment = value();
    else if (flag === '--gguf') options.gguf = value();
    else if (flag === '--items') options.items = value();
    else if (flag === '--slice') options.slice = value();
    else if (flag === '--mode') options.mode = value();
    else if (flag === '--shots') options.shots = Number(value());
    else if (flag === '--samples') options.samples = Number(value());
    else if (flag === '--temperature') options.temperature = Number(value());
    else if (flag === '--seed') options.seed = Number(value());
    else if (flag === '--max-tokens') options.maxTokens = Number(value());
    else if (flag === '--no-think') options.noThink = true;
    else if (flag === '--per-group') options.perGroup = Number(value());
    else if (flag === '--port') options.port = Number(value());
    else if (flag === '--concurrency') options.concurrency = Number(value());
    else if (flag === '--out') options.out = value();
    else throw new Error(`unknown argument: ${flag}`);
  }
  if (!options.experiment || !options.gguf || (!options.items && !options.slice)) {
    throw new Error('usage: run-items.mjs --experiment <id> --gguf <path> (--items <jsonl> | --slice holdout) [--mode compiled|js|prose]');
  }
  if (!['compiled', 'js', 'jsprog', 'prose', 'sop-icl', 'ops'].includes(options.mode)) throw new Error(`unknown mode: ${options.mode}`);
  return options;
}

function loadItems(options) {
  const items = options.slice ? resolveSlice({ slice: options.slice }).items
    : readFileSync(resolve(REPOSITORY_ROOT, options.items), 'utf8').split('\n').filter((line) => line.trim())
      .map((line) => JSON.parse(line)).map((row) => ({ ...row, id: row.id ?? `${row.book}/${row.folder}` }));
  return options.perGroup ? stratifiedSample(items, options.perGroup, options.seed) : items;
}

/** The group of an item: its composition, else its E3 split, else its book and problem family. */
export function groupOf(item) {
  if (item.composition) return `${item.composition}:${item.split ?? ''}`;
  if (item.split && String(item.split).startsWith('held-out-')) return item.split;
  return `${item.book}/${String(item.folder).split('/').slice(-2, -1)[0]}`;
}

/** At most `perGroup` items of every group, chosen by a seeded hash so every model sees the same items. */
export function stratifiedSample(items, perGroup, seed) {
  const rank = (item) => createHash('sha256').update(`${seed}:${item.id}`).digest('hex');
  const groups = new Map();
  for (const item of items) groups.set(groupOf(item), [...(groups.get(groupOf(item)) ?? []), item]);
  const chosen = new Set([...groups.values()].flatMap((group) => [...group].sort((a, b) => rank(a).localeCompare(rank(b))).slice(0, perGroup)));
  return items.filter((item) => chosen.has(item));
}

export function messagesFor(mode, shots, statement) {
  if (mode === 'compiled') return buildMessages(statement);
  if (mode === 'prose') return [{ role: 'system', content: PROSE_SYSTEM }, { role: 'user', content: statement }];
  // The prompt of the fine-tuned models' JavaScript training rows (training/preservation.mjs), zero-shot as trained.
  if (mode === 'jsprog') return [{ role: 'system', content: PRESERVATION_SYSTEM_PROMPT }, { role: 'user', content: statement }];
  if (mode === 'ops') {
    const messages = [{ role: 'system', content: OPS_SYSTEM }];
    for (const example of OPS_EXAMPLES.slice(0, shots)) {
      messages.push({ role: 'user', content: example.statement });
      messages.push({ role: 'assistant', content: '```json\n' + example.plan + '\n```' });
    }
    messages.push({ role: 'user', content: statement });
    return messages;
  }
  if (mode === 'sop-icl') {
    const messages = [{ role: 'system', content: SYSTEM_PROMPT + ' ' + SOP_GUIDE }];
    for (const example of SOP_EXAMPLES.slice(0, shots)) {
      messages.push({ role: 'user', content: example.statement });
      messages.push({ role: 'assistant', content: '```sop\n' + example.program + '\n```' });
    }
    messages.push({ role: 'user', content: statement });
    return messages;
  }
  const messages = [{ role: 'system', content: JS_SYSTEM }];
  if (shots > 0) {
    messages.push({ role: 'user', content: JS_EXAMPLE.statement });
    messages.push({ role: 'assistant', content: '```javascript\n' + JS_EXAMPLE.body + '\n```' });
  }
  messages.push({ role: 'user', content: statement });
  return messages;
}

/** The function body of a JavaScript reply: the fenced block, with a trailing call added for a named function. */
export function javascriptBodyOf(completion) {
  const fence = /```(?:javascript|js)?\s*\n([\s\S]*?)```/i.exec(completion);
  let body = (fence ? fence[1] : completion).trim();
  if (!/^\s*return\b/m.test(body.replace(/function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*\}/g, ''))) {
    const named = /function\s+(\w+)\s*\(\s*\)/.exec(body);
    if (named) body += `\nreturn ${named[1]}();`;
  }
  return body;
}

/**
 * A standalone JavaScript program that prints its answer with console.log, as a jsEval body:
 * console.log is captured, pending promises (the trained programs are async closures) are given
 * microtask turns to settle, and the body returns the last printed line.
 */
export function programBodyOf(completion) {
  const text = completion.replace(/<think>[\s\S]*?<\/think>/g, '');
  const fence = /```(?:javascript|js)?\s*\n([\s\S]*?)```/i.exec(text);
  const program = (fence ? fence[1] : text).trim();
  return [
    'const __lines = [];',
    "const console = { log: (...values) => { __lines.push(values.map((value) => String(value)).join(' ')); } };",
    program,
    'for (let __turn = 0; __turn < 100; __turn++) await null;',
    'return __lines.length ? __lines[__lines.length - 1] : undefined;',
  ].join('\n');
}

/**
 * A value-level comparison that ignores wording but not content: a single-number reference must be
 * the last number the answer states (answers state their result last), a multi-number reference
 * must equal the answer's numbers as a multiset (nothing missing, nothing extra), and any
 * feasibility or yes/no verdict must agree. Echoing an input number does not pass.
 */
export function valueMatches(oracle, answer) {
  if (typeof answer !== 'string' || typeof oracle !== 'string') return false;
  const numbers = (text) => (text.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  const close = (x, y) => Math.abs(x - y) < 0.051;
  const expected = numbers(oracle), stated = numbers(answer);
  if (expected.length === 1) {
    if (stated.length === 0 || !close(stated.at(-1), expected[0])) return false;
  } else if (expected.length > 1) {
    const remaining = [...stated];
    for (const value of expected) {
      const at = remaining.findIndex((candidate) => close(candidate, value));
      if (at < 0) return false;
      remaining.splice(at, 1);
    }
    if (remaining.length > 0) return false;
  }
  const verdict = (text) => /\bnot feasible\b|\bdoes not meet\b|\binfeasible\b/i.test(text) ? 'no' : /\bfeasible\b|\bmeets\b/i.test(text) ? 'yes' : null;
  const yesNo = (text) => /^\s*(yes|no)\b/i.exec(text)?.[1].toLowerCase() ?? null;
  for (const read of [verdict, yesNo]) {
    const want = read(oracle);
    if (want !== null && read(answer) !== want) return false;
  }
  return expected.length > 0 || answerMatches(oracle, answer);
}

async function request(port, alias, messages, options, sample) {
  const body = { model: alias, messages, temperature: options.temperature, max_tokens: options.maxTokens, stream: false };
  if (options.temperature > 0) body.seed = options.seed + sample;
  if (options.noThink) body.chat_template_kwargs = { enable_thinking: false };
  const started = Date.now();
  try {
    const response = await fetch(`http://127.0.0.1:${port}/v1/chat/completions`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(600000)
    });
    if (!response.ok) return { completion: null, error: `HTTP ${response.status}`, latencyMs: Date.now() - started };
    const decoded = await response.json();
    const completion = decoded?.choices?.[0]?.message?.content ?? null;
    return { completion: completion === '' ? null : completion, error: completion ? null : 'response carries no completion',
      finishReason: decoded?.choices?.[0]?.finish_reason ?? null, usage: decoded?.usage ?? null, latencyMs: Date.now() - started };
  } catch (failure) {
    return { completion: null, error: failure.message, latencyMs: Date.now() - started };
  }
}

export async function classify(mode, completion, oracle, runtime) {
  if (completion === null) return { className: 'generation_transport_error', detail: null, answer: null };
  if (mode === 'compiled') return classifyItem({ completion, oracle, runtime });
  if (mode === 'ops') {
    const executed = executePlan(completion);
    if (executed.className !== 'executed') return executed;
    return { ...executed, className: answerMatches(oracle, executed.answer) ? 'answer_match' : 'answer_mismatch' };
  }
  if (mode === 'sop-icl') {
    const fence = /```(?:sop)?\s*\n([\s\S]*?)```/.exec(completion);
    const program = fence ? fence[1] : completion.slice(Math.max(0, completion.search(/^@\w+ \w+/m)));
    const verdict = await classifyItem({ completion: program, oracle, runtime });
    return { ...verdict, detail: verdict.detail ?? null, lenient: program.trim() !== completion.trim() };
  }
  if (mode === 'prose') {
    const answer = completion.trim();
    return { className: answerMatches(oracle, answer) ? 'answer_match' : 'answer_mismatch', detail: null, answer };
  }
  const program = '@answer jsEval\n' + (mode === 'jsprog' ? programBodyOf(completion) : javascriptBodyOf(completion));
  const verdict = await classifyItem({ completion: '```sop\n' + program + '\n```', oracle, runtime });
  return verdict.className === 'wrapper_rejected' ? await classifyItem({ completion: program, oracle, runtime }) : verdict;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const directory = resolve(REPOSITORY_ROOT, options.out, options.experiment);
  mkdirSync(directory, { recursive: true });
  const recordsPath = join(directory, 'items.jsonl');
  const done = new Set(existsSync(recordsPath)
    ? readFileSync(recordsPath, 'utf8').split('\n').filter(Boolean).map((line) => { const row = JSON.parse(line); return `${row.item}#${row.sample}`; })
    : []);
  const items = loadItems(options);
  const queue = items.flatMap((item) => Array.from({ length: options.samples }, (_, sample) => ({ item, sample })))
    .filter(({ item, sample }) => !done.has(`${item.id}#${sample}`));
  const ggufPath = resolve(REPOSITORY_ROOT, options.gguf);
  writeFileSync(join(directory, 'run-manifest.json'), JSON.stringify({
    experiment: options.experiment, gguf: options.gguf, ggufBytes: existsSync(ggufPath) ? statSync(ggufPath).size : null,
    itemSource: options.items ?? `slice:${options.slice}`, itemCount: items.length, mode: options.mode, shots: options.shots,
    perGroup: options.perGroup, samples: options.samples, temperature: options.temperature, seed: options.seed, maxTokens: options.maxTokens, noThink: options.noThink,
    systemPromptSha256: createHash('sha256').update(JSON.stringify(messagesFor(options.mode, options.shots, '').slice(0, -1))).digest('hex'),
    resumedWith: done.size, updatedAt: new Date().toISOString()
  }, null, 2) + '\n');
  if (queue.length === 0) { process.stdout.write(`${options.experiment}: nothing left to do\n`); return summarize(directory, items, options); }

  const alias = aliasFor(ggufPath);
  const logFd = openSync(join(directory, 'server.log'), 'a');
  const child = spawn(LLAMA_SERVER, serverArguments(ggufPath, options.port, { alias }), { cwd: REPOSITORY_ROOT, detached: true, stdio: ['ignore', logFd, logFd] });
  closeSync(logFd);
  const stop = () => { try { process.kill(-child.pid, 'SIGTERM'); } catch { /* already gone */ } };
  for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => { stop(); process.exit(143); });
  process.on('exit', stop);
  await waitForServer(options.port, 300000, { expectedModel: alias, child });

  const runtime = createRuntime();
  let next = 0;
  const worker = async () => {
    while (next < queue.length) {
      const { item, sample } = queue[next++];
      const generated = await request(options.port, alias, messagesFor(options.mode, options.shots, item.statement), options, sample);
      const verdict = await classify(options.mode, generated.completion, item.oracle, runtime);
      appendFileSync(recordsPath, JSON.stringify({
        item: item.id, sample, split: item.split ?? null, rung: item.rung ?? null, composition: item.composition ?? null,
        book: item.book ?? null, oracle: item.oracle, class: verdict.className, lenient: verdict.lenient ?? null, detail: verdict.detail ?? null, answer: verdict.answer ?? null,
        valueMatch: valueMatches(item.oracle, verdict.answer ?? (options.mode === 'prose' ? generated.completion : null)),
        completion: generated.completion, error: generated.error, finishReason: generated.finishReason ?? null,
        tokens: generated.usage?.completion_tokens ?? null, latencyMs: generated.latencyMs
      }) + '\n');
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, options.concurrency) }, worker));
  stop();
  summarize(directory, items, options);
}

function summarize(directory, items, options) {
  const rows = readFileSync(join(directory, 'items.jsonl'), 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
  const groups = {};
  for (const row of rows) {
    const key = [row.split ?? row.book ?? 'all', row.rung ?? ''].filter(Boolean).join(':');
    const group = groups[key] ??= { records: 0, exact: 0, value: 0, executed: 0, missing: 0 };
    group.records++;
    if (row.class === 'answer_match') group.exact++;
    if (row.valueMatch) group.value++;
    if (row.class === 'answer_match' || row.class === 'answer_mismatch') group.executed++;
    if (row.class === 'generation_transport_error') group.missing++;
  }
  writeFileSync(join(directory, 'summary.json'), JSON.stringify({ experiment: options.experiment, items: items.length,
    records: rows.length, complete: rows.length === items.length * options.samples, groups }, null, 2) + '\n');
  process.stdout.write(`${options.experiment}: ${rows.length}/${items.length * options.samples} records\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((failure) => { process.stderr.write(`run-items: ${failure.stack ?? failure.message}\n`); process.exit(1); });
}
