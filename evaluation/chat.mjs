#!/usr/bin/env node
/**
 * Minimal local chat with a fine-tuned student (compiled-plan mode).
 *
 * The student is trained to compile a problem statement into a SOP Lang circuit,
 * not to answer in prose, so this CLI does what the training actually teaches:
 * it sends the question with the recorded `compiled-plan-chat-1` profile, takes
 * the completion as the compiled plan, parses and executes that plan with the
 * runtime, and prints the ANSWER THE CIRCUIT PRODUCED. The generated SOP Lang is
 * shown only with `--show-plan`; the default output is the answer, because that
 * is what the pipeline promises and what a failure should be judged against.
 *
 * The server is managed for you: if nothing answers on the port, the CLI starts
 * `llama-server` with the chosen artifact and stops it when the session ends.
 *
 * Usage:
 *   node evaluation/chat.mjs --once "Nadia opens a savings account with 100 units. ..."
 *   node evaluation/chat.mjs                        # interactive, newest selected checkpoint
 *   node evaluation/chat.mjs --experiment exp-003-sft-lr1e-4 --show-plan
 *   node evaluation/chat.mjs --gguf <path.gguf> --port 8080 --no-server
 *
 * See `evaluation/chat.md` for how to test it and what output to expect.
 */

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { buildMessages, extractProgram, generate } from './client.mjs';
import { LLAMA_SERVER, REPOSITORY_ROOT, aliasFor, serverArguments, waitForServer } from './server.mjs';
import { artifactFor } from './artifacts.mjs';
import { parseCircuit } from '../runtime/parser.mjs';
import { createRuntime } from '../runtime/kernel.mjs';

async function serverIsUp(base) {
  try {
    const response = await fetch(`${base}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

async function startServer({ gguf, port, threads }) {
  const child = spawn(LLAMA_SERVER, serverArguments(gguf, port, { threads }), { cwd: REPOSITORY_ROOT, detached: true, stdio: 'ignore' });
  child.unref();
  await waitForServer(port, 300_000, { expectedModel: aliasFor(gguf), child });
  return child;
}

function parseArguments(argv) {
  const options = { gguf: null, experiment: null, base: null, port: 8087, maxTokens: 1024, threads: null, showPlan: false, once: null, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = () => {
      const next = argv[index + 1];
      if (next === undefined) throw new Error(`${flag} needs a value`);
      index += 1;
      return next;
    };
    if (flag === '--gguf') options.gguf = value();
    else if (flag === '--experiment') options.experiment = value();
    else if (flag === '--base') options.base = value();
    else if (flag === '--port') options.port = Number(value());
    else if (flag === '--max-tokens') options.maxTokens = Number(value());
    else if (flag === '--threads') options.threads = Number(value());
    else if (flag === '--show-plan') options.showPlan = true;
    else if (flag === '--once') options.once = value();
    else if (flag === '--help' || flag === '-h') options.help = true;
    else throw new Error(`unknown argument: ${flag}`);
  }
  if (options.help) return options;
  if (options.gguf === null && options.experiment === null) {
    options.experiment = 'exp-008-sft-shapes';
  }
  return options;
}

const HELP = `Usage: node evaluation/chat.mjs [--experiment <id> | --gguf <path>] [options]

Ask a question; the student compiles it into a SOP Lang circuit and the runtime
executes that circuit, so the printed answer is the one the circuit computed.

Options:
  --experiment <id>   serve the selected checkpoint of this experiment (default exp-008-sft-shapes)
  --gguf <path>       serve this artifact instead
  --base <url>        use an already running server instead of starting one
  --port N            port for the managed server (default 8087)
  --max-tokens N      generation budget per question (default 1024)
  --threads N         CPU threads for llama-server
  --show-plan         print the generated circuit before the answer
  --once "<question>" ask one question, print the answer, and exit
  --help              print this help
`;

function renderExchange({ question, completion, extracted, outcome, options }) {
  const lines = [];
  if (extracted.ok && options.showPlan) {
    lines.push('--- generated plan ---', extracted.program.trimEnd(), '--- end of plan ---', '');
  }
  if (!extracted.ok) {
    lines.push(`✗ the model did not emit a plan (${extracted.reason}).`);
    lines.push('  A student trained on the compiled-plan profile answers with a circuit; prose means the question sits');
    lines.push('  outside what it learned. The raw completion was:', '', `  ${String(completion ?? '').trim().slice(0, 500)}`);
    return lines.join('\n');
  }
  if (outcome.status === 'completed') {
    const answer = outcome.outputs?.answer;
    lines.push(`✔ answer (executed circuit): ${typeof answer === 'string' ? answer : JSON.stringify(answer)}`);
  } else {
    lines.push(`✗ the plan did not execute: ${outcome.status}${outcome.code ? `:${outcome.code}` : ''}`);
    if (outcome.error?.message) lines.push(`  ${outcome.error.message}`);
    lines.push('  The circuit failed its own guards, which means the compiled values or the computation were wrong');
    lines.push('  for this statement. Re-run with --show-plan to read the circuit it produced.');
  }
  return lines.join('\n');
}

async function ask({ question, base, alias, options, runtime }) {
  const result = await generate({ base, model: alias, messages: buildMessages(question), temperature: 0, maxTokens: options.maxTokens, timeoutMs: 600000 });
  if (result.error !== null) {
    return `✗ generation failed after ${result.attempts} attempt(s): ${result.error.message}`;
  }
  const extracted = extractProgram(result.completion);
  let outcome = null;
  if (extracted.ok) {
    try {
      const circuit = parseCircuit(extracted.program);
      outcome = await runtime.run(circuit, { outputs: ['answer'] });
    } catch (error) {
      outcome = { status: 'failed', code: 'parse_error', error: { message: error.message } };
    }
  }
  return renderExchange({ question, completion: result.completion, extracted, outcome, options });
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(HELP);
    process.exit(0);
  }

  const artifact = artifactFor({ gguf: options.gguf, experiment: options.experiment });
  const base = options.base ?? `http://127.0.0.1:${options.port}`;
  let managed = null;
  // The alias this session must talk to: the one its own launch serves, or the
  // recorded alias when it reuses a server it did not start.
  let alias = aliasFor(artifact.gguf);
  if (!(await serverIsUp(base))) {
    if (options.base !== null) {
      throw new Error(`no server answers at ${base}; start one or drop --base so the CLI can start its own`);
    }
    process.stdout.write(`starting llama-server with ${artifact.gguf.replace(`${REPOSITORY_ROOT}/`, '')} on port ${options.port} …\n`);
    managed = await startServer({ gguf: artifact.gguf, port: options.port, threads: options.threads });
    alias = aliasFor(artifact.gguf);
  }
  process.stdout.write(`model: ${artifact.experiment}${artifact.winner === null ? '' : ` (${artifact.winner})`}\n`);
  process.stdout.write('questions are answered by executing the circuit the model compiles; --show-plan prints the circuit.\n');

  const stopServer = () => {
    if (managed !== null) {
      try {
        process.kill(-managed.pid, 'SIGTERM');
      } catch {
        managed.kill('SIGTERM');
      }
    }
  };
  process.on('SIGINT', () => {
    stopServer();
    process.stdout.write('\n');
    process.exit(0);
  });
  process.on('exit', stopServer);

  const runtime = createRuntime();

  if (options.once !== null) {
    process.stdout.write(`\n? ${options.once}\n${await ask({ question: options.once, base, alias, options, runtime })}\n`);
    stopServer();
    process.exit(0);
  }

  const reader = createInterface({ input: process.stdin, output: process.stdout, prompt: '? ' });
  reader.prompt();
  for await (const line of reader) {
    const question = line.trim();
    if (question === '' || question === 'exit' || question === 'quit') {
      if (question !== '') break;
      reader.prompt();
      continue;
    }
    const answer = await ask({ question, base, alias, options, runtime });
    process.stdout.write(`\n${answer}\n\n`);
    reader.prompt();
  }
  reader.close();
  stopServer();
}

if (process.argv[1] !== undefined && pathToFileURL(process.argv[1]).href === import.meta.url) {
  await main();
}
