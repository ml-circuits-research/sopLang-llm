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
import { fileURLToPath } from 'node:url';

import { buildMessages, extractProgram, generate } from './client.mjs';
import { LLAMA_SERVER, REPOSITORY_ROOT, resolveArtifactPath, serverArguments, waitForServer } from './server.mjs';
import { parseCircuit } from '../runtime/parser.mjs';
import { createRuntime } from '../runtime/kernel.mjs';

const REGISTRY = join(REPOSITORY_ROOT, 'evaluation/registry');
const BASE_GGUF = join(REPOSITORY_ROOT, 'training/checkpoints/base-f16.gguf');
const DEFAULT_PORT = 8080;

const HELP = `Usage: node evaluation/chat.mjs [options] [question]

Options:
  --once <question>   answer one question and exit (no interactive prompt)
  --show-plan         also print the generated SOP Lang circuit
  --gguf <path>       checkpoint artifact to serve (default: the best measured winner)
  --experiment <id>   use the winner of that experiment's selection run
  --base <url>        attach to a server that is already running instead of starting one
  --port N            port for the managed server (default ${DEFAULT_PORT})
  --max-tokens N      generation budget (default 1024)
  --threads N         CPU threads for the managed server
  --help              print this help

The answer you see is the value the executed circuit returned. When the model
emits prose instead of a plan, or the plan fails its own probes, the CLI says so
explicitly instead of pretending the reply was an answer.
`;

function parseArguments(argv) {
  const options = { once: null, showPlan: false, gguf: null, experiment: null, base: null, port: DEFAULT_PORT, maxTokens: 1024, threads: null, help: false };
  const positional = [];
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = () => {
      const next = argv[index + 1];
      if (next === undefined) throw new Error(`${flag} needs a value`);
      index += 1;
      return next;
    };
    if (flag === '--once') options.once = value();
    else if (flag === '--show-plan') options.showPlan = true;
    else if (flag === '--gguf') options.gguf = value();
    else if (flag === '--experiment') options.experiment = value();
    else if (flag === '--base') options.base = value();
    else if (flag === '--port') options.port = Number(value());
    else if (flag === '--max-tokens') options.maxTokens = Number(value());
    else if (flag === '--threads') options.threads = Number(value());
    else if (flag === '--help' || flag === '-h') options.help = true;
    else if (flag.startsWith('--')) throw new Error(`unknown argument: ${flag}`);
    else positional.push(flag);
  }
  if (options.once === null && positional.length > 0) options.once = positional.join(' ');
  return options;
}

/**
 * The best measured checkpoint: among every experiment with a selection run, the
 * winner with the highest oracle match on the (shared) validation slice, ties
 * broken by parse validity and then by recency. Recency alone would hand the
 * session a weaker arm, because the arm that ran last is not the arm that scored
 * best; --experiment and --gguf override the choice.
 */
export function bestWinner() {
  if (!existsSync(REGISTRY)) return null;
  const candidates = readdirSync(REGISTRY)
    .map((name) => join(REGISTRY, name, 'selection.json'))
    .filter((path) => existsSync(path))
    .map((path) => ({ path, mtime: statSync(path).mtimeMs }));
  const ranked = [];
  for (const candidate of candidates) {
    const selection = JSON.parse(readFileSync(candidate.path, 'utf8'));
    const row = selection.rows.find((entry) => entry.checkpoint === selection.winner);
    if (row === undefined) continue;
    const gguf = resolveArtifactPath(row.gguf);
    if (!existsSync(gguf)) continue;
    ranked.push({
      experiment: selection.experiment,
      winner: selection.winner,
      gguf,
      oracle: row.metrics?.rates?.oracle_match ?? -1,
      parse: row.metrics?.rates?.parse_validity ?? -1,
      mtime: candidate.mtime,
    });
  }
  ranked.sort((left, right) => (right.oracle - left.oracle) || (right.parse - left.parse) || (right.mtime - left.mtime));
  return ranked[0] ?? null;
}

function resolveArtifact(options) {
  if (options.gguf !== null) {
    const gguf = resolveArtifactPath(options.gguf);
    if (!existsSync(gguf)) throw new Error(`the artifact ${gguf} does not exist`);
    return { experiment: 'explicit --gguf', winner: null, gguf };
  }
  if (options.experiment !== null) {
    const selectionPath = join(REGISTRY, options.experiment, 'selection.json');
    if (!existsSync(selectionPath)) throw new Error(`${selectionPath} does not exist`);
    const selection = JSON.parse(readFileSync(selectionPath, 'utf8'));
    const row = selection.rows.find((entry) => entry.checkpoint === selection.winner);
    if (row === undefined) throw new Error(`selection.json of ${options.experiment} has no row for its winner`);
    return { experiment: selection.experiment, winner: selection.winner, gguf: resolveArtifactPath(row.gguf) };
  }
  const best = bestWinner();
  if (best !== null) return best;
  if (existsSync(BASE_GGUF)) return { experiment: 'base model (no fine-tuned selection found)', winner: 'base', gguf: BASE_GGUF };
  throw new Error('no artifact found: pass --gguf, or run an evaluation that writes a selection.json');
}

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
  await waitForServer(port);
  return child;
}

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

async function ask({ question, base, options, runtime }) {
  const result = await generate({ base, model: 'student', messages: buildMessages(question), temperature: 0, maxTokens: options.maxTokens, timeoutMs: 600000 });
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

const options = parseArguments(process.argv.slice(2));
if (options.help) {
  process.stdout.write(HELP);
  process.exit(0);
}

const artifact = resolveArtifact(options);
const base = options.base ?? `http://127.0.0.1:${options.port}`;
let managed = null;
if (!(await serverIsUp(base))) {
  if (options.base !== null) {
    throw new Error(`no server answers at ${base}; start one or drop --base so the CLI can start its own`);
  }
  process.stdout.write(`starting llama-server with ${artifact.gguf.replace(`${REPOSITORY_ROOT}/`, '')} on port ${options.port} …\n`);
  managed = await startServer({ gguf: artifact.gguf, port: options.port, threads: options.threads });
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
  process.stdout.write(`\n? ${options.once}\n${await ask({ question: options.once, base, options, runtime })}\n`);
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
  const answer = await ask({ question, base, options, runtime });
  process.stdout.write(`\n${answer}\n\n`);
  reader.prompt();
}
reader.close();
stopServer();
