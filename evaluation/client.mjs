#!/usr/bin/env node
/**
 * Serving client and generation post-processor (training/PLAN.md T3; decisions
 * D9 and D10).
 *
 * The client speaks the OpenAI-compatible chat endpoint of `llama-server`
 * (`POST <base>/v1/chat/completions`, greedy decoding, `stream: false`),
 * applies exactly one retry on a transport failure, and reports the raw
 * completion together with its usage and latency. `extractProgram` implements
 * the post-processing contract of D10: a completion is accepted when, after
 * trimming, it is either bare SOP text starting with `@` at column one or a
 * single fenced block whose entire body starts with `@`. Nothing here parses
 * SOP Lang; the runtime parser judges the accepted program, so the two failure
 * classes stay separate in the registry.
 *
 * Node built-ins only (global `fetch` is provided by Node 22).
 *
 * Usage (from the evaluation loop):
 *   const messages = buildMessages(statement);
 *   const result = await generate({ model: 'qwen2.5-coder-0.5b', messages });
 */

import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export { CHAT_PROFILE_ID, SYSTEM_PROMPT, SYSTEM_PROMPT_SHA256 } from '../training/export.mjs';

import { SYSTEM_PROMPT } from '../training/export.mjs';

/** The endpoint path of the llama-server OpenAI-compatible chat API. */
export const CHAT_COMPLETIONS_PATH = '/v1/chat/completions';

/** The reasons `extractProgram` may report; every rejection lands in exactly one. */
export const EXTRACT_REASONS = ['empty', 'no_wire_declaration', 'multiple_fences', 'prose_outside_fence'];

/** A fence marker line: three or more backticks, possibly with a language tag. */
const FENCE_MARKER = /^[ \t]*`{3,}[^\n]*$/;

/** A wire declaration is a line whose first column carries `@`. */
const WIRE_DECLARATION = /^@/m;

/** The message layout of the recorded chat profile: the fixed system prompt and the statement. */
export function buildMessages(statement) {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: statement },
  ];
}

function trimBase(base) {
  return String(base).replace(/\/+$/, '');
}

function transportError(message) {
  return { kind: 'transport', message };
}

function messageOf(error) {
  return error instanceof Error ? error.message : String(error);
}

/**
 * One greedy chat completion through the served model, with exactly one retry.
 *
 * The retry fires on any transport failure: a network error, an aborted
 * timeout, a non-2xx status, an unreadable body, or a 2xx response whose
 * `choices[0].message.content` is missing or empty. The second attempt is the
 * last one, so `attempts` never exceeds two. Returns `completion: null` with a
 * non-null `error` after the final failure.
 */
export async function generate({
  base = 'http://127.0.0.1:8080',
  model,
  messages,
  temperature = 0,
  maxTokens = 2048,
  stop = [],
  timeoutMs = 600000,
  fetchImpl = fetch,
} = {}) {
  const url = `${trimBase(base)}${CHAT_COMPLETIONS_PATH}`;
  const body = { model, messages, temperature, max_tokens: maxTokens, stream: false };
  if (stop.length > 0) body.stop = stop;
  const payload = JSON.stringify(body);
  const startedAt = Date.now();
  let attempts = 0;
  let error = transportError('no attempt was made');

  while (attempts < 2) {
    attempts += 1;
    try {
      const response = await fetchImpl(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: payload,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!response.ok) {
        error = transportError(`HTTP ${response.status}`);
        continue;
      }
      const decoded = await response.json();
      const completion = decoded?.choices?.[0]?.message?.content;
      if (typeof completion !== 'string' || completion === '') {
        error = transportError('response carries no completion');
        continue;
      }
      return {
        completion,
        finishReason: decoded.choices[0].finish_reason ?? null,
        usage: decoded.usage ?? null,
        latencyMs: Date.now() - startedAt,
        attempts,
        error: null,
      };
    } catch (failure) {
      error = transportError(messageOf(failure));
    }
  }

  return {
    completion: null,
    finishReason: null,
    usage: null,
    latencyMs: Date.now() - startedAt,
    attempts,
    error,
  };
}

function fenceMarkerLines(lines) {
  const markers = [];
  lines.forEach((line, index) => {
    if (FENCE_MARKER.test(line)) markers.push(index);
  });
  return markers;
}

function isBlank(line) {
  return line.trim() === '';
}

/**
 * The verdict for the text extracted from the wrap: accept only a candidate
 * whose first line starts with `@`; otherwise report `no_wire_declaration`
 * when no line declares a wire at all, and `prose_outside_fence` when a wire
 * declaration exists but prose precedes it.
 */
function verdictFor(candidate) {
  if (candidate.startsWith('@')) return { ok: true, program: candidate };
  return { ok: false, reason: WIRE_DECLARATION.test(candidate) ? 'prose_outside_fence' : 'no_wire_declaration' };
}

/**
 * The D10 post-processing contract: strip one optional fence, then accept the
 * program only when it starts at column one with a wire declaration.
 *
 * Accepted: trimmed bare SOP text whose first line begins with `@`; or exactly
 * one fenced block, with an optional language tag on the opening fence and
 * nothing but whitespace around it, whose body trims to text whose first line
 * begins with `@`. Rejected: `empty` for a blank completion,
 * `multiple_fences` for two or more fenced blocks, `prose_outside_fence` for
 * text around the single fence or for an unclosed fence, and
 * `no_wire_declaration` when the extracted text carries no `@` wire
 * declaration.
 */
export function extractProgram(completion) {
  const text = (typeof completion === 'string' ? completion : '').trim();
  if (text === '') return { ok: false, reason: 'empty' };

  const lines = text.split('\n');
  const markers = fenceMarkerLines(lines);
  if (markers.length === 0) return verdictFor(text);
  if (markers.length % 2 !== 0) return { ok: false, reason: 'prose_outside_fence' };
  if (markers.length > 2) return { ok: false, reason: 'multiple_fences' };

  const [open, close] = markers;
  if (lines.slice(0, open).some((line) => !isBlank(line))) return { ok: false, reason: 'prose_outside_fence' };
  if (lines.slice(close + 1).some((line) => !isBlank(line))) return { ok: false, reason: 'prose_outside_fence' };
  return verdictFor(lines.slice(open + 1, close).join('\n').trim());
}

/** Append one per-item record as a JSON line to the experiment's item log. */
export function appendItemLog(filePath, record) {
  mkdirSync(dirname(filePath), { recursive: true });
  appendFileSync(filePath, `${JSON.stringify(record)}\n`);
}
