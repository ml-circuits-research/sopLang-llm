#!/usr/bin/env node
/**
 * Prose evaluation of an untrained base model over the eval holdout.
 *
 * The compiled-plan holdout asks every model to emit SOP Lang, which is a skill
 * only the fine-tuned students have, so an untrained base model scores 0 of 265
 * there and the number says nothing. This runner asks the base model what it can
 * do: answer the statement directly, in prose. Each completion is compared with
 * the printed answer of the problem, so the morning question — how many of these
 * problems can the base model actually solve, against how many the fine-tuned
 * students solve by compiling — has an honest number on both sides.
 *
 * Usage:
 *   node evaluation/run-prose-eval.mjs --experiment cmp-base-holdout-prose-05 \
 *       --gguf training/checkpoints/base-f16.gguf --port 8131
 *   node evaluation/run-prose-eval.mjs --experiment cmp-base-holdout-prose-15 \
 *       --gguf training/checkpoints/base-1.5b-f16.gguf --port 8133
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { generate } from './client.mjs';
import { resolveSlice } from './slices.mjs';
import { LLAMA_SERVER, REPOSITORY_ROOT, aliasFor, serverArguments, waitForServer } from './server.mjs';
import { spawn } from 'node:child_process';

const PROSE_PROMPT = [
  'Answer the problem directly and briefly.',
  'Give the final answer in one short sentence; no working, no explanation.'
].join(' ');

function parseArguments(argv) {
  const options = { experiment: null, gguf: null, port: 8131, concurrency: 4, maxTokens: 512, help: false };
  let index = 0;
  while (index < argv.length) {
    const flag = argv[index];
    const value = () => {
      index += 1;
      if (index >= argv.length) throw new Error(`missing value for ${flag}`);
      return argv[index];
    };
    if (flag === '--experiment') options.experiment = value();
    else if (flag === '--gguf') options.gguf = value();
    else if (flag === '--port') options.port = Number(value());
    else if (flag === '--concurrency') options.concurrency = Number(value());
    else if (flag === '--help' || flag === '-h') options.help = true;
    else throw new Error(`unknown argument: ${flag}`);
    index += 1;
  }
  if (options.experiment === null || options.gguf === null) {
    process.stderr.write('usage: node evaluation/run-prose-eval.mjs --experiment <id> --gguf <path> [--port N]\n');
    process.exit(2);
  }
  return options;
}

/** The numbers a text states, in order, decimals included. */
function numbersOf(text) {
  return [...String(text).matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
}

/** Whether a prose completion answers the printed answer of the problem. */
function matchesAnswer(completion, printed) {
  if (completion === null || completion.trim() === '') return false;
  const printedNumbers = numbersOf(printed);
  if (printedNumbers.length === 0) {
    // A word answer (a name, a reversed word): normalized containment.
    const normalized = (text) => String(text).toLowerCase().replace(/[^a-z0-9]/g, '');
    const core = normalized(printed);
    return core.length > 0 && normalized(completion).includes(core);
  }
  const completionNumbers = numbersOf(completion);
  // Every number the printed answer states must appear in the completion, so a
  // two-part answer ("141 units after 2 withdrawals") is not credited for one half.
  return printedNumbers.every((number) => completionNumbers.includes(number));
}

async function serverIsUp(base) {
  try { const response = await fetch(`${base}/health`); return response.ok; } catch { return false; }
}

function main() {
  const options = parseArguments(process.argv.slice(2));
  // The same holdout collection the compiled-plan evaluation uses, so the prose
  // numbers sit on exactly the same items, statements, and printed answers.
  const items = resolveSlice({ slice: 'holdout' }).items.map((item) => ({
    folder: item.folder,
    book: item.book,
    statement: item.statement,
    printed: item.oracle
  }));

  const registryDir = join(REPOSITORY_ROOT, 'evaluation/registry', options.experiment);
  mkdirSync(join(registryDir, 'items'), { recursive: true });

  const base = `http://127.0.0.1:${options.port}`;
  let managed = null;

  const run = async () => {
    const alias = aliasFor(options.gguf);
    const records = [];
    let cursor = 0;
    const workers = Array.from({ length: Math.max(1, Math.min(options.concurrency, items.length)) }, async () => {
      while (cursor < items.length) {
        const index = cursor;
        cursor += 1;
        const item = items[index];
        const result = await generate({
          base,
          model: alias,
          messages: [
            { role: 'system', content: PROSE_PROMPT },
            { role: 'user', content: item.statement }
          ],
          temperature: 0,
          maxTokens: options.maxTokens,
          timeoutMs: 600_000
        });
        const completion = result.completion === null ? null : String(result.completion).trim();
        records.push({
          folder: item.folder,
          book: item.book,
          statement: item.statement,
          printed: item.printed,
          completion,
          matched: matchesAnswer(completion, item.printed),
          tokens: result.usage?.completion_tokens ?? null,
          latencyMs: result.latencyMs ?? null,
          error: result.error === null ? null : result.error.message
        });
      }
    });
    await Promise.all(workers);
    return records;
  };

  (async () => {
    if (!(await serverIsUp(base))) {
      process.stdout.write(`starting llama-server with ${options.gguf.replace(`${REPOSITORY_ROOT}/`, '')} on port ${options.port} …\n`);
      managed = spawn(LLAMA_SERVER, serverArguments(options.gguf, options.port, { threads: null }), { cwd: REPOSITORY_ROOT, detached: true, stdio: 'ignore' });
      managed.unref();
      await waitForServer(options.port, 300_000, { expectedModel: aliasFor(options.gguf), child: managed });
    }
    const records = await run();
    if (managed !== null) { try { process.kill(-managed.pid, 'SIGTERM'); } catch { managed.kill('SIGTERM'); } }

    const matched = records.filter((record) => record.matched).length;
    const failed = records.filter((record) => record.completion === null).length;
    const byBook = new Map();
    for (const record of records) {
      const book = byBook.get(record.book) ?? { items: 0, matched: 0 };
      book.items += 1;
      if (record.matched) book.matched += 1;
      byBook.set(record.book, book);
    }

    writeFileSync(join(registryDir, 'items', 'prose.jsonl'), `${records.map((record) => JSON.stringify(record)).join('\n')}\n`);
    const lines = [
      `# Prose evaluation — ${options.experiment}`,
      '',
      `Artifact: \`${options.gguf.replace(`${REPOSITORY_ROOT}/`, '')}\`. Items: ${items.length} (every eval statement).`,
      '',
      'The model was asked to answer each statement directly in prose; the completion',
      'was compared with the printed answer of the problem. A non-numeric answer is',
      'credited only by normalized containment; a numeric answer is credited only when',
      'every number the printed answer states appears in the completion.',
      '',
      '| metric | numerator | items | rate |',
      '| --- | --- | --- | --- |',
      `| printed answer matched | ${matched} | ${items.length} | ${((matched / items.length) * 100).toFixed(1)}% |`,
      `| generation failed | ${failed} | ${items.length} | ${((failed / items.length) * 100).toFixed(1)}% |`,
      '',
      '| book | items | matched | rate |',
      '| --- | --- | --- | --- |'
    ];
    for (const [book, counts] of [...byBook.entries()].sort()) {
      lines.push(`| ${book} | ${counts.items} | ${counts.matched} | ${((counts.matched / counts.items) * 100).toFixed(1)}% |`);
    }
    writeFileSync(join(registryDir, 'report.md'), `${lines.join('\n')}\n`);
    writeFileSync(join(registryDir, 'run-manifest.json'), `${JSON.stringify({
      experiment: options.experiment,
      gguf: options.gguf,
      items: items.length,
      matched,
      prompt: PROSE_PROMPT,
      generatedAt: new Date().toISOString()
    }, null, 2)}\n`);
    process.stdout.write(`prose eval done: ${matched}/${items.length} matched (${((matched / items.length) * 100).toFixed(1)}%), ${failed} generation failures\n`);
    process.stdout.write(`wrote ${registryDir}/{items/prose.jsonl,report.md,run-manifest.json}\n`);
  })().catch((error) => {
    process.stderr.write(`${String(error.stack ?? error)}\n`);
    process.exit(1);
  });
}

main();
