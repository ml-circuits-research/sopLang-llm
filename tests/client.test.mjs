import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  CHAT_PROFILE_ID,
  EXTRACT_REASONS,
  SYSTEM_PROMPT,
  SYSTEM_PROMPT_SHA256,
  appendItemLog,
  buildMessages,
  extractProgram,
  generate,
} from '../evaluation/client.mjs';
import {
  CHAT_PROFILE_ID as EXPORT_PROFILE_ID,
  SYSTEM_PROMPT as EXPORT_SYSTEM_PROMPT,
  SYSTEM_PROMPT_SHA256 as EXPORT_SYSTEM_PROMPT_SHA256,
} from '../training/export.mjs';

/** A compiled plan in the shape the dataset teaches. */
const PROGRAM = [
  '@slots literal',
  '{"a": 1, "b": 2}',
  '',
  '@answer jsEval',
  'return $slots.a + $slots.b;',
].join('\n');

/** A fake response object shaped like the llama-server reply. */
function completionResponse(content, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    json: async () => ({
      choices: [{ message: { role: 'assistant', content }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
    }),
  };
}

test('the client re-exports the recorded chat profile', () => {
  assert.equal(CHAT_PROFILE_ID, EXPORT_PROFILE_ID);
  assert.equal(CHAT_PROFILE_ID, 'compiled-plan-chat-2');
  assert.equal(SYSTEM_PROMPT, EXPORT_SYSTEM_PROMPT);
  assert.equal(SYSTEM_PROMPT_SHA256, EXPORT_SYSTEM_PROMPT_SHA256);
  assert.match(SYSTEM_PROMPT_SHA256, /^[0-9a-f]{64}$/);
});

test('buildMessages produces the profile layout: the system prompt then the statement', () => {
  assert.deepEqual(buildMessages('How many apples are left?'), [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: 'How many apples are left?' },
  ]);
});

test('extractProgram accepts a bare program', () => {
  assert.deepEqual(extractProgram(PROGRAM), { ok: true, program: PROGRAM });
  assert.deepEqual(extractProgram(`\n\n${PROGRAM}\n\n`), { ok: true, program: PROGRAM });
});

test('extractProgram strips a single fence, with or without a language tag', () => {
  assert.deepEqual(extractProgram(`\`\`\`\n${PROGRAM}\n\`\`\``), { ok: true, program: PROGRAM });
  assert.deepEqual(extractProgram(`\`\`\`sop\n${PROGRAM}\n\`\`\`\n`), { ok: true, program: PROGRAM });
  assert.deepEqual(extractProgram(`  \`\`\`\n${PROGRAM}\n\`\`\`  `), { ok: true, program: PROGRAM });
});

test('extractProgram rejects prose around a single fence', () => {
  assert.deepEqual(extractProgram(`Here is the program:\n\`\`\`\n${PROGRAM}\n\`\`\``), {
    ok: false,
    reason: 'prose_outside_fence',
  });
  assert.deepEqual(extractProgram(`\`\`\`\n${PROGRAM}\n\`\`\`\nHope this helps!`), {
    ok: false,
    reason: 'prose_outside_fence',
  });
  assert.deepEqual(extractProgram(`Here is the program:\n\n${PROGRAM}`), {
    ok: false,
    reason: 'prose_outside_fence',
  });
});

test('extractProgram rejects more than one fenced block', () => {
  const twice = `\`\`\`\n${PROGRAM}\n\`\`\`\n\`\`\`\n${PROGRAM}\n\`\`\``;
  assert.deepEqual(extractProgram(twice), { ok: false, reason: 'multiple_fences' });
});

test('extractProgram rejects an empty or missing completion', () => {
  assert.deepEqual(extractProgram(''), { ok: false, reason: 'empty' });
  assert.deepEqual(extractProgram('  \n\t\n'), { ok: false, reason: 'empty' });
  assert.deepEqual(extractProgram(undefined), { ok: false, reason: 'empty' });
  assert.deepEqual(extractProgram(null), { ok: false, reason: 'empty' });
});

test('extractProgram rejects text with no wire declaration', () => {
  assert.deepEqual(extractProgram('```\nThe answer is 7.\n```'), { ok: false, reason: 'no_wire_declaration' });
  assert.deepEqual(extractProgram('The answer is 7.'), { ok: false, reason: 'no_wire_declaration' });
});

test('every extractProgram rejection uses one of the declared reason strings', () => {
  const rejections = [
    extractProgram(''),
    extractProgram('prose only'),
    extractProgram(`\`\`\`\n${PROGRAM}\n\`\`\`\n\`\`\`\n${PROGRAM}\n\`\`\``),
    extractProgram(`before\n\`\`\`\n${PROGRAM}\n\`\`\``),
  ];
  for (const rejection of rejections) {
    assert.equal(rejection.ok, false);
    assert.ok(EXTRACT_REASONS.includes(rejection.reason), rejection.reason);
  }
  assert.deepEqual(new Set(rejections.map((r) => r.reason)).size, EXTRACT_REASONS.length);
});

test('generate posts the profile messages with greedy decoding and token bounds', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    return completionResponse(PROGRAM);
  };
  const messages = buildMessages('How many apples are left?');
  const result = await generate({ base: 'http://127.0.0.1:9999/', model: 'qwen-test', messages, fetchImpl });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'http://127.0.0.1:9999/v1/chat/completions');
  assert.equal(calls[0].options.method, 'POST');
  assert.deepEqual(JSON.parse(calls[0].options.body), {
    model: 'qwen-test',
    messages,
    temperature: 0,
    max_tokens: 2048,
    stream: false,
  });
  assert.equal(result.error, null);
  assert.equal(result.completion, PROGRAM);
  assert.equal(result.finishReason, 'stop');
  assert.deepEqual(result.usage, { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 });
  assert.equal(result.attempts, 1);
  assert.ok(result.latencyMs >= 0);
});

test('generate honours an explicit maxTokens and includes stop when given', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push(JSON.parse(options.body));
    return completionResponse(PROGRAM);
  };
  await generate({ model: 'qwen-test', messages: buildMessages('q'), maxTokens: 512, stop: ['\n\n'], fetchImpl });
  assert.equal(calls[0].max_tokens, 512);
  assert.deepEqual(calls[0].stop, ['\n\n']);
});

test('generate retries exactly once after a network failure and reports the second attempt', async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    if (calls === 1) throw new Error('ECONNREFUSED');
    return completionResponse(PROGRAM);
  };
  const result = await generate({ model: 'qwen-test', messages: buildMessages('q'), fetchImpl });
  assert.equal(calls, 2);
  assert.equal(result.attempts, 2);
  assert.equal(result.error, null);
  assert.equal(result.completion, PROGRAM);
});

test('generate retries a non-2xx response once', async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return calls === 1 ? completionResponse(null, { ok: false, status: 503 }) : completionResponse(PROGRAM);
  };
  const result = await generate({ model: 'qwen-test', messages: buildMessages('q'), fetchImpl });
  assert.equal(calls, 2);
  assert.equal(result.attempts, 2);
  assert.equal(result.error, null);
});

test('generate treats a 2xx response without completion content as a transport failure', async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return calls === 1 ? completionResponse(undefined) : completionResponse(PROGRAM);
  };
  const result = await generate({ model: 'qwen-test', messages: buildMessages('q'), fetchImpl });
  assert.equal(calls, 2);
  assert.equal(result.attempts, 2);
  assert.equal(result.error, null);
});

test('generate reports a transport error after the single retry is exhausted', async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    throw new Error('socket hang up');
  };
  const result = await generate({ model: 'qwen-test', messages: buildMessages('q'), fetchImpl });
  assert.equal(calls, 2);
  assert.equal(result.attempts, 2);
  assert.equal(result.completion, null);
  assert.equal(result.finishReason, null);
  assert.deepEqual(result.error, { kind: 'transport', message: 'socket hang up' });
});

test('appendItemLog writes one JSON line per record and creates the parent directory', () => {
  const root = mkdtempSync(join(tmpdir(), 'client-log-'));
  try {
    const filePath = join(root, 'items', 'items.jsonl');
    const first = { folder: 'mathematical-thinking/eval/1.1/1', status: 'answer_match', attempts: 1 };
    const second = { folder: 'mathematical-thinking/eval/1.2/1', status: 'parse_invalid', attempts: 1 };
    appendItemLog(filePath, first);
    appendItemLog(filePath, second);
    const lines = readFileSync(filePath, 'utf8').split('\n');
    assert.equal(lines.at(-1), '');
    assert.deepEqual(
      lines.slice(0, -1).map((line) => JSON.parse(line)),
      [first, second],
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
