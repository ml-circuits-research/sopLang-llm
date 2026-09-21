#!/usr/bin/env node
/**
 * Serving smoke test (training/PLAN.md T3 acceptance).
 *
 * Sends one compiled-plan prompt for a shipped example through the served
 * checkpoint, applies the D10 post-processing contract, and records the raw
 * completion and the request metadata as JSON lines under the experiment item
 * log. It proves the whole serving path end to end: the client, the
 * chat-template rendering of the server, and the post-processor.
 *
 * Usage:
 *   node evaluation/smoke.mjs [--base http://127.0.0.1:8080] [--model base] [--folder <book>/<folder>] [--log <path>]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appendItemLog, buildMessages, extractProgram, generate } from './client.mjs';
import { statementBodyOf } from '../training-data/dataset-manifest.mjs';

const REPOSITORY_ROOT = fileURLToPath(new URL('..', import.meta.url));
const DATASET_ROOT = join(REPOSITORY_ROOT, 'training-data');
const DEFAULT_FOLDER = 'mathematical-thinking/no-knowledge/order-in-a-line/1.1-order-in-a-line-1';

function parseArguments(argv) {
  const options = {
    base: 'http://127.0.0.1:8080',
    model: 'base',
    folder: DEFAULT_FOLDER,
    log: join(REPOSITORY_ROOT, 'training/checkpoints/serving-smoke.jsonl'),
    maxTokens: 1024,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--base') { options.base = argv[index + 1]; index += 1; }
    else if (argument === '--model') { options.model = argv[index + 1]; index += 1; }
    else if (argument === '--folder') { options.folder = argv[index + 1]; index += 1; }
    else if (argument === '--log') { options.log = argv[index + 1]; index += 1; }
    else if (argument === '--max-tokens') { options.maxTokens = Number(argv[index + 1]); index += 1; }
    else throw new Error(`unknown argument: ${argument}`);
  }
  return options;
}

const options = parseArguments(process.argv.slice(2));
const problem = readFileSync(join(DATASET_ROOT, options.folder, 'problem.md'), 'utf8');
const messages = buildMessages(statementBodyOf(problem));

const result = await generate({
  base: options.base,
  model: options.model,
  messages,
  temperature: 0,
  maxTokens: options.maxTokens,
});

if (result.error !== null) {
  console.error(`generation failed after ${result.attempts} attempt(s): ${result.error.message}`);
  process.exit(1);
}

const extracted = extractProgram(result.completion);
appendItemLog(options.log, {
  kind: 'serving-smoke',
  base: options.base,
  model: options.model,
  folder: options.folder,
  attempts: result.attempts,
  latencyMs: result.latencyMs,
  usage: result.usage,
  finishReason: result.finishReason,
  accepted: extracted.ok,
  reason: extracted.ok ? null : extracted.reason,
  completion: result.completion,
});

console.log(`completion (${result.usage?.completion_tokens ?? '?'} tokens, ${result.latencyMs} ms, attempt ${result.attempts}):`);
console.log(result.completion.slice(0, 600));
console.log(extracted.ok ? '\npost-processing: accepted as a program' : `\npost-processing: rejected (${extracted.reason})`);
console.log(`item log: ${options.log}`);
if (extracted.ok) {
  writeFileSync(join(REPOSITORY_ROOT, 'training/checkpoints/serving-smoke.sop'), extracted.program);
}
process.exit(extracted.ok ? 0 : 1);
