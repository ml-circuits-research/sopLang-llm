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
 * Interactive lines that start with `/` are commands of this CLI, not questions:
 * `decodeLine` decides before anything is sent, `runCommand` answers from the
 * session record, and only a question reaches the client, so a command can never
 * become an evaluation turn. `/help` lists them.
 *
 * Usage:
 *   node evaluation/chat.mjs --once "Nadia opens a savings account with 100 units. ..."
 *   node evaluation/chat.mjs                        # interactive, newest selected checkpoint
 *   node evaluation/chat.mjs --experiment exp-003-sft-lr1e-4 --show-plan
 *   node evaluation/chat.mjs --gguf <path.gguf> --port 8080 --no-server
 *
 * See `evaluation/chat.md` for how to test it and what output to expect.
 */

import { spawn, spawnSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline';
import { pathToFileURL } from 'node:url';

import { buildMessages, extractProgram, generate } from './client.mjs';
import { LLAMA_SERVER, REPOSITORY_ROOT, aliasFor, serverArguments, waitForServer, winner05, winner15 } from './server.mjs';
import { artifactFor } from './artifacts.mjs';
import { CHAT_PROFILE_ID } from '../training/export.mjs';
import { parseCircuit } from '../runtime/parser.mjs';
import { createRuntime } from '../runtime/kernel.mjs';

/**
 * The most recently evaluated experiment with a recorded winner.
 *
 * Recency, not the validation oracle: the chat is the owner's playground for the
 * latest work, while the diagnostic runners keep the best-by-oracle choice of
 * `bestWinner()`. A named --gguf or --experiment always overrides this.
 */
function latestExperiment() {
  const registry = `${REPOSITORY_ROOT}/evaluation/registry`;
  const entries = [];
  for (const name of readdirSync(registry)) {
    const selection = join(registry, name, 'selection.json');
    if (!existsSync(selection)) continue;
    entries.push({ name, mtime: statSync(selection).mtimeMs });
  }
  entries.sort((left, right) => right.mtime - left.mtime);
  return entries[0]?.name ?? null;
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
  await waitForServer(port, 300_000, { expectedModel: aliasFor(gguf), child });
  return child;
}

function parseArguments(argv) {
  const options = { gguf: null, experiment: null, base: null, port: 8087, maxTokens: 1024, threads: null, showPlan: false, once: null, useBoth: false, single: false, no15: false, retries: 2, help: false };
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
    else if (flag === '--use-both') options.useBoth = true;
    else if (flag === '--single') options.single = true;
    else if (flag === '--no-1.5b') options.no15 = true;
    else if (flag === '--retries') options.retries = Number(value());
    else if (flag === '--port') options.port = Number(value());
    else if (flag === '--max-tokens') options.maxTokens = Number(value());
    else if (flag === '--threads') options.threads = Number(value());
    else if (flag === '--show-plan') options.showPlan = true;
    else if (flag === '--once') options.once = value();
    else if (flag === '--help' || flag === '-h') options.help = true;
    else throw new Error(`unknown argument: ${flag}`);
  }
  if (options.help) return options;
  return options;
}

/**
 * The interactive commands, in the order `/help` prints them. Every command is
 * answered from the session record this CLI already keeps, so none of them
 * needs a new subsystem; `/help` is generated from this list, so a command that
 * is added here is listed there.
 */
export const COMMANDS = [
  { usage: '/help', summary: 'list the interactive commands' },
  { usage: '/show-plan', summary: 'print the plan of the previous turn, its wire names, whether it executed, and its divergence' },
  { usage: '/stats', summary: 'print the number of turns and the token totals the server reported' },
  { usage: '/model', summary: 'print the served artifact, its alias, and the state of all four lanes' },
  { usage: '/use-both [true|false]', summary: 'toggle comparing the fine-tuned model against the untuned base model; with no argument it flips the current setting' },
  { usage: '/bases [true|false]', summary: 'toggle the two untrained base models (0.5B and 1.5B) together; with no argument it flips the current setting' },
  { usage: '/export <path>', summary: 'write the session transcript to a JSONL file (overwrites it)' },
  { usage: '/history [N]', summary: 'list the last N saved turns (default 20) with each model\'s answer' },
  { usage: '/exit', summary: 'leave the session (bare `exit`, `quit`, and Ctrl-D do the same)' }
];

/**
 * The decision for one input line, taken before any request is made. A line
 * that starts with `/`, and the bare words `exit` and `quit`, are commands and
 * are answered locally; only a `question` line is sent to the model, so a
 * command cannot become an evaluation turn or change the token totals.
 */
export function decodeLine(line) {
  const text = String(line ?? '').trim();
  if (text === '') return { kind: 'blank' };
  if (text === 'exit' || text === 'quit') return { kind: 'command', name: 'exit', argument: '' };
  if (!text.startsWith('/')) return { kind: 'question', text };
  const separator = text.search(/\s/);
  const name = separator === -1 ? text.slice(1) : text.slice(1, separator);
  const argument = separator === -1 ? '' : text.slice(separator + 1).trim();
  return { kind: 'command', name, argument };
}

/**
 * The divergence name of one turn, in the vocabulary of the two evaluation
 * cores (`divergenceOf` in evaluation/run-diagnostic.mjs and `classifyItem` in
 * evaluation/run-eval.mjs). The chat path holds no dataset oracle, so it names
 * only the classes that need no reference answer: the answer-based classes
 * (`wrong_formatting`, `stopped_after_filter`, `missing_final_stage`,
 * `wrong_values_or_operation`) are not decidable here, and a turn whose circuit
 * executed is reported as `none` rather than guessed at.
 */
export function divergenceOf(className) {
  if (className === 'generation_transport_error') return 'no_completion';
  if (className === 'wrapper_rejected') return 'wrapper_rejected';
  if (className === 'parse_invalid') return 'invalid_syntax';
  if (className === 'execution_error') return 'runtime_failure';
  return 'none';
}

/**
 * The untuned base model, for the `/use-both` comparison.
 *
 * The comparison is the point of the whole project: the fine-tuned student
 * compiles the statement into a circuit that the runtime executes, while the
 * base model answers in prose from its own weights, so showing both side by side
 * is the honest way to see what the fine-tuning bought. The artifact is the
 * pinned base of `training/environment/base-model.json` converted to gguf, and
 * the alias comes from its file name, exactly as for a checkpoint.
 */
/**
 * Terminal colours of the comparison display. Exactly two blocks are printed, each
 * headed by a bold, coloured title so the two models can never be confused: the
 * untrained base model in yellow, the fine-tuned student in cyan. The plan is dimmed,
 * because the answer is the headline and the plan is the supporting evidence.
 */
const ANSI = Object.freeze({
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  green: '\x1b[32m',
  red: '\x1b[31m'
});

export const BASE_GGUF = `${REPOSITORY_ROOT}/training/checkpoints/base-f16.gguf`;
export const BASE_GGUF_15 = `${REPOSITORY_ROOT}/training/checkpoints/base-1.5b-f16.gguf`;
export const CHAT_HISTORY_FILE = process.env.SOPLANG_CHAT_HISTORY ?? `${REPOSITORY_ROOT}/evaluation/registry/chat-history.jsonl`;

const COMMAND_WIDTH = Math.max(...COMMANDS.map((command) => command.usage.length));

const HELP = `Usage: node evaluation/chat.mjs [--experiment <id> | --gguf <path>] [options]

Ask a question; the two trained students — the 0.5B and, when a 1.5B experiment
has a winner, the 1.5B — each compile it into a SOP Lang circuit that the runtime
executes, so the printed answer is the one the circuit computed. The two untrained
bases stay out of sight until you ask for them with /bases.

Options:
  --experiment <id>   serve the selected checkpoint of this experiment
                      (default: the newest 0.5B-trained winner)
  --gguf <path>       serve this artifact instead
  --base <url>        use an already running server instead of starting one
  --use-both          start with the 0.5B base-model comparison on: every question
                      is answered by the fine-tuned model and by the untuned 0.5B
                      base, the second on the next port (see /use-both)
  --single            keep only the main (0.5B) student: no base, no 1.5B lanes
  --no-1.5b           skip both 1.5B lanes (the 1.5B student and the 1.5B base)
  --retries N         extra plans after the first failure (default 2)
  --port N            port for the managed server (default 8087)
  --max-tokens N      generation budget per question (default 1024)
  --threads N         CPU threads for llama-server
  --show-plan         print the generated circuit before the answer
  --once "<question>" ask one question, print the answer, and exit
  --help              print this help

Interactive commands (typed at the "? " prompt, never sent to the model):
${COMMANDS.map((command) => `  ${command.usage.padEnd(COMMAND_WIDTH)}  ${command.summary}`).join('\n')}
`;

/**
 * The visible lines of one evaluated turn. The default output is the answer the
 * circuit computed, because that is what the pipeline promises; the generated
 * plan is shown only with `--show-plan` or with the `/show-plan` command. The
 * failure text keeps the three documented outcomes apart: no plan, a plan that
 * does not parse, and a plan that ran and failed its own guards.
 */
/**
 * The untuned base model's answer, rendered above the compiled one.
 *
 * The base model was never trained on the compiled-plan profile, so its reply is
 * whatever it wrote in prose; that text is shown as it came, because the value of
 * the comparison is exactly that difference and reformatting it would hide it.
 */
/** The untrained 1.5B base's block: the same shape as the 0.5B one, its own colour. */
/** The measured line of one generation: completion tokens and the request-to-answer time. */
function timingOf(turn) {
  const tokens = turn.usage?.completion_tokens ?? null;
  const seconds = turn.latencyMs === null || turn.latencyMs === undefined ? null : (turn.latencyMs / 1000).toFixed(1);
  const parts = [tokens === null ? null : `${tokens} tokens`, seconds === null ? null : `${seconds}s total`]
    .filter((part) => part !== null);
  return parts.length === 0 ? null : `${ANSI.dim}(${parts.join(', ')})${ANSI.reset}`;
}

function renderComparison15(base) {
  const lines = [`${ANSI.bold}${ANSI.magenta}── BASE MODEL 1.5B (untrained) ──${ANSI.reset}`];
  if (base.error !== null) {
    lines.push(`${ANSI.red}✗ no answer: ${base.error}${ANSI.reset}`);
    return lines;
  }
  const text = base.text === null || base.text === '' ? '(empty answer)' : base.text;
  lines.push(text);
  const measured = [base.tokens === null ? null : `${base.tokens} tokens`, base.latencyMs === null ? null : `${(base.latencyMs / 1000).toFixed(1)}s`]
    .filter((part) => part !== null)
    .join(', ');
  if (measured !== '') lines.push(`${ANSI.dim}(${measured})${ANSI.reset}`);
  return lines;
}

function renderComparison(base) {
  const lines = [`${ANSI.bold}${ANSI.yellow}── ORIGINAL MODEL (untrained) ──${ANSI.reset}`];
  if (base.error !== null) {
    lines.push(`${ANSI.red}✗ no answer: ${base.error}${ANSI.reset}`);
    return lines;
  }
  const text = base.text === null || base.text === '' ? '(empty answer)' : base.text;
  lines.push(text);
  const measured = [base.tokens === null ? null : `${base.tokens} tokens`, base.latencyMs === null ? null : `${(base.latencyMs / 1000).toFixed(1)}s`]
    .filter((part) => part !== null)
    .join(', ');
  if (measured !== '') lines.push(`${ANSI.dim}(${measured})${ANSI.reset}`);
  return lines;
}
/**
 * Whether the base model's text is a SOP Lang program, said in one line.
 *
 * Extracting a wrapped program is attempted first, because a reply that happens to
 * carry a valid program in a fence should be reported as valid; otherwise the
 * parser's own refusal is quoted, which is the honest description of an invented
 * syntax that borrows the profile's words.
 */
function parseVerdictOf(text) {
  const extracted = extractProgram(text);
  const candidate = extracted.ok ? extracted.program : text;
  try {
    const parsed = parseCircuit(candidate, { sourceName: 'base-model' });
    return `  (incidentally, the parser reads this text as SOP Lang: ${parsed.wires.map((wire) => `${wire.name} ${wire.command}`).join(', ')}; it is still not executed here)`;
  } catch (error) {
    return `  (the parser rejects it as SOP Lang — expected, since it is not one: ${String(error.message).split('\n')[0].slice(0, 120)})`;
  }
}

/**
 * Human-readable identity of a trained model: its size (from the base name), the
 * training-data version, and when the training finished - the things the owner
 * asked to see instead of raw checkpoint numbers. Read from the evaluation
 * manifest, which the chain records from the trainer's manifest, so the fields
 * survive the checkpoint prune. Missing fields are omitted, never guessed.
 */
export function modelInfoOf(experiment) {
  const info = { size: null, base: null, dataVersion: null, finishedUtc: null };
  if (experiment === null || experiment === undefined || experiment === '') return info;
  try {
    const manifestPath = `${REPOSITORY_ROOT}/evaluation/registry/${experiment}/run-manifest.json`;
    if (!existsSync(manifestPath)) return info;
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const basePath = manifest.base_model_manifest?.path ?? null;
    if (typeof basePath === 'string') {
      // The path names the pinned manifest; the model identity is its repo field.
      const pinnedPath = basePath.startsWith('/') ? basePath : `${REPOSITORY_ROOT}/${basePath}`;
      if (existsSync(pinnedPath)) {
        try {
          const pinned = JSON.parse(readFileSync(pinnedPath, 'utf8'));
          if (typeof pinned.repo === 'string' && pinned.repo !== '') {
            info.base = pinned.repo.split('/').pop();
          }
        } catch {
          info.base = basePath.split('/').pop();
        }
      } else {
        info.base = basePath.split('/').pop();
      }
      if (info.base !== null) {
        const size = /(\d+(?:\.\d+)?b)/i.exec(info.base);
        if (size !== null) info.size = size[1].toUpperCase();
      }
    }
    const dv = manifest.dataset?.dataVersion ?? null;
    if (dv !== null && typeof dv.number === 'string' && dv.number !== '') {
      info.dataVersion = `dv${dv.number}${typeof dv.label === 'string' && dv.label !== '' ? ` ${dv.label}` : ''}`;
    }
    const finished = manifest.training?.finishedUtc ?? null;
    if (typeof finished === 'string' && finished !== '') {
      const approx = manifest.training?.finishedUtcApprox === true ? '≈' : '';
      info.finishedUtc = `${approx}${finished.replace('T', ' ').replace(/:\d{2}Z$/, 'Z')}`;
    }
  } catch {
    // Display-only: an unreadable manifest must not break the chat.
  }
  return info;
}

function renderExchange(turn, options) {
  const lines = [];
  if (turn.baseComparison !== undefined) {
    lines.push(...renderComparison(turn.baseComparison), '');
  }
  if (turn.base15 !== undefined) {
    lines.push(...renderComparison15(turn.base15), '');
  }
  if (turn.student15 !== undefined) {
    const info15 = modelInfoOf(turn.student15Experiment ?? null);
    const label15 = [info15.size !== null ? info15.size : '1.5B', info15.base, info15.dataVersion, info15.finishedUtc === null ? null : `trained ${info15.finishedUtc}`, turn.student15Experiment ?? null]
      .filter((part) => part !== null && part !== '')
      .join(' · ');
    lines.push(`${ANSI.bold}${ANSI.green}── FINE-TUNED MODEL (${label15}) ──${ANSI.reset}`);
    if (turn.student15.program !== null && options.showPlan) {
      lines.push(`${ANSI.dim}${turn.student15.program.trimEnd()}${ANSI.reset}`, '');
    }
    if (turn.student15.className === 'executed') {
      const answer = turn.student15.answer;
      lines.push(`${ANSI.green}✔ ${typeof answer === 'string' ? answer : JSON.stringify(answer)}${ANSI.reset}`);
      const timing15 = timingOf(turn.student15);
      if (timing15 !== null) lines.push(timing15);
    } else {
      lines.push(`${ANSI.red}✗ ${turn.student15.className}: ${turn.student15.detail ?? turn.student15.outcome?.code ?? 'did not execute'}${ANSI.reset}`);
    }
  }
  const infoMain = modelInfoOf(turn.mainExperiment ?? null);
  const labelMain = [infoMain.size !== null ? infoMain.size : null, infoMain.base, infoMain.dataVersion, infoMain.finishedUtc === null ? null : `trained ${infoMain.finishedUtc}`, turn.mainExperiment ?? null]
    .filter((part) => part !== null && part !== '')
    .join(' · ');
  lines.push(`${ANSI.bold}${ANSI.cyan}── FINE-TUNED MODEL (${labelMain === '' ? 'student' : labelMain}) ──${ANSI.reset}`);
  if (turn.program !== null && options.showPlan) {
    lines.push(`${ANSI.dim}${turn.program.trimEnd()}${ANSI.reset}`, '');
  }
  if (turn.className === 'generation_transport_error') {
    lines.push(`${ANSI.red}✗ generation failed after ${turn.attempts} attempt(s): ${turn.error?.message ?? 'no reply'}${ANSI.reset}`);
    return lines.join('\n');
  }
  if (turn.className === 'wrapper_rejected') {
    lines.push(`${ANSI.red}✗ no plan emitted (${turn.detail})${ANSI.reset}`);
    lines.push(`${ANSI.dim}${String(turn.completion ?? '').trim().slice(0, 400)}${ANSI.reset}`);
    return lines.join('\n');
  }
  if (turn.className === 'parse_invalid') {
    lines.push(`${ANSI.red}✗ the plan did not parse: ${turn.detail}${ANSI.reset}`);
    return lines.join('\n');
  }
  if (turn.className === 'executed') {
    const answer = turn.answer;
    lines.push(`${ANSI.green}✔ ${typeof answer === 'string' ? answer : JSON.stringify(answer)}${ANSI.reset}`);
    const timing = timingOf(turn);
    if (timing !== null) lines.push(timing);
    return lines.join('\n');
  }
  lines.push(`${ANSI.red}✗ the plan did not execute: ${turn.outcome?.status ?? 'failed'}${turn.outcome?.code ? ':' + turn.outcome.code : ''}${ANSI.reset}`);
  if (turn.detail) lines.push(`${ANSI.dim}${turn.detail}${ANSI.reset}`);
  return lines.join('\n');
}
/**
 * One question through the model and the runtime, kept as a record instead of
 * as text: the answer is rendered from the record, and `/show-plan`, `/stats`,
 * and `/export` read the same record, so a turn is never reported twice from
 * two different sources.
 *
 * `className` is the class vocabulary of `classifyItem` (evaluation/run-eval.mjs)
 * restricted to the classes that need no oracle: `generation_transport_error`,
 * `wrapper_rejected`, `parse_invalid`, `execution_error`, and `executed` for a
 * circuit that ran and published an answer.
 */
/**
 * Ensure the untuned base model is served, for the `/use-both` comparison.
 *
 * The base gets its own port and its own managed server, so the comparison never
 * disturbs the fine-tuned session: the two are asked at the same time on the same
 * question, which is what makes the two answers comparable. The first call starts
 * the server and records the outcome on the session, so a second question reuses
 * it, and a failure is reported once instead of being retried on every turn.
 */
/**
 * The alias a running server reports, or `null` when it names none.
 *
 * `/v1/models` is what `serverIsUp` already relies on for reachability, and the
 * served alias is the only trustworthy statement about which artifact a server
 * holds: the port alone says nothing, because a previous session may have started
 * a checkpoint there.
 */
/**
 * Stop a leftover llama-server that holds this CLI's managed port.
 *
 * A server started with `detached: true` survives its parent, which is what lets the
 * chat survive a terminal; the cost is that a parent killed with SIGKILL cannot run
 * its cleanup, and its server keeps the port. When the owner asks for a different
 * artifact on that port, the leftover must go. Only a process whose command line is
 * a llama-server on exactly this port is touched, so a server someone else owns on
 * the same port gets the same treatment, which is what the owner asked for.
 */
function stopLeftoverOnPort(port) {
  const listing = spawnSync('pgrep', ['-f', `llama-server.*--port ${port}`], { encoding: 'utf8' });
  const pids = (listing.stdout ?? '').trim().split('\n').filter((line) => line !== '');
  for (const pid of pids) {
    try {
      process.kill(Number(pid), 'SIGTERM');
    } catch {
      // Already gone.
    }
  }
  // Give the process a moment to release the port before the caller rechecks.
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline && pids.some((pid) => {
    try { process.kill(Number(pid), 0); return true; } catch { return false; }
  })) {
    const started = Date.now();
    while (Date.now() - started < 200) { /* busy-wait is fine for a 10s bound */ }
  }
}

async function servedAlias(base) {
  try {
    const response = await fetch(`${base}/v1/models`);
    if (!response.ok) {
      return null;
    }
    const payload = await response.json();
    // llama-server answers `{"models": [{"name": ...}]}`; an OpenAI-compatible
    // endpoint answers `{"data": [{"id": ...}]}`. Both shapes are read, because the
    // comparison port may hold either, and the alias is what decides whether the
    // server holds the base model.
    const entries = Array.isArray(payload?.models) ? payload.models : Array.isArray(payload?.data) ? payload.data : [];
    const first = entries[0] ?? null;
    const name = typeof first?.name === 'string' ? first.name : typeof first?.id === 'string' ? first.id : null;
    return name === null || name === '' ? null : name;
  } catch {
    return null;
  }
}

/**
 * The two 1.5B lanes of a session, derived from the discovered 1.5B winner
 * (`winner15()`, null when none) and the parsed options. The untrained 1.5B
 * base joins whenever its gguf exists; the fine-tuned 1.5B student joins when a
 * winner exists. `--no-1.5b` drops both 1.5B lanes, and `--single` keeps only
 * the main student, so it drops them too.
 */
export function select15Lanes(lanes15, options) {
  const student15 = lanes15 === null || options.no15 || options.single
    ? null
    : { state: 'idle', base: null, alias: null, managed: null, detail: null, gguf: lanes15.gguf, experiment: lanes15.experiment, winner: lanes15.winner };
  const base15 = existsSync(BASE_GGUF_15) && !options.no15 && !options.single
    ? { state: 'idle', base: null, alias: null, managed: null, detail: null, gguf: BASE_GGUF_15 }
    : null;
  return { student15, base15 };
}

/** The ports of the four lanes: main, base-0.5, student-1.5, base-1.5. */
function lanePorts(port) {
  return { student05: port, base05: port + 1, student15: port + 2, base15: port + 3 };
}

async function ensureBaseServer(session, options) {
  // The 0.5B base lane uses the same free-port scan as the 1.5B lanes: its preferred
  // port is the next one up, and a port held by another model is left alone while the
  // lane moves on. The lane record keeps its original shape for the renderer.
  const compare = session.compare;
  await ensureLane(compare, { gguf: BASE_GGUF, port: options.port + 1, options });
  if (compare.state === 'ready' && compare.managed === null && compare.detail === null && compare.base === null) {
    compare.base = `http://127.0.0.1:${options.port + 1}`;
  }
  return compare;
}

/**
 * The untuned base model's own answer to the same question: a prose completion
 * from the recorded chat profile, with no circuit and no execution, which is
 * exactly what the comparison is meant to show next to the compiled result.
 */
/**
 * Bring one lane's server up, exactly like `ensureBaseServer` but for any lane:
 * reuse a server that already holds the lane's artifact, refuse one that holds a
 * different model, start the lane's artifact otherwise. Returns the lane.
 */
async function ensureLane(lane, { gguf, port, options }) {
  if (lane.state === 'ready' || lane.state === 'failed') {
    return lane;
  }
  if (!existsSync(gguf)) {
    lane.state = 'failed';
    lane.detail = `the artifact is missing at ${gguf.replace(`${REPOSITORY_ROOT}/`, '')}`;
    return lane;
  }
  // The preferred port is a hint, not a claim: a port already held by a different
  // model — the evaluation chain's server, a leftover chat, anything — is left alone,
  // and the lane moves up until it finds a free port. That is the difference from the
  // main port, whose occupier the CLI stops, because the main port is the session's
  // own while a lane's neighbour may be someone else's work.
  for (let candidate = port; candidate < port + 16; candidate += 1) {
    const base = `http://127.0.0.1:${candidate}`;
    if (await serverIsUp(base)) {
      const served = await servedAlias(base);
      if (served === null || served === aliasFor(gguf)) {
        lane.state = 'ready';
        lane.base = base;
        lane.alias = served ?? aliasFor(gguf);
        lane.managed = null;
        lane.detail = served === null ? 'an unnamed server on the port is assumed to serve the requested model' : null;
        return lane;
      }
      continue;
    }
    try {
      process.stdout.write(`starting llama-server with ${gguf.replace(`${REPOSITORY_ROOT}/`, '')} on port ${candidate} …\n`);
      lane.managed = await startServer({ gguf, port: candidate, threads: options.threads });
      recordServerPid(lane.managed);
      lane.state = 'ready';
      lane.base = base;
      lane.alias = aliasFor(gguf);
      return lane;
    } catch (error) {
      lane.state = 'failed';
      lane.detail = error.message;
      return lane;
    }
  }
  lane.state = 'failed';
  lane.detail = `no free port in ${port}-${port + 15} for ${gguf.replace(`${REPOSITORY_ROOT}/`, '')}`;
  return lane;
}

async function askBase({ question, compare, options }) {
  // The base model is asked to SOLVE the problem, not to compile it. Sending it the
  // recorded compilation profile would ask a model that was never trained on SOP Lang
  // to emit SOP Lang, and it answers by imitating the profile's vocabulary with an
  // invented grammar — text that reads like a circuit and is not one. The comparison
  // is only meaningful between two models answering the same question their own way:
  // the student compiles and the runtime executes, the base model just answers.
  const result = await generate({
    base: compare.base,
    model: compare.alias,
    messages: [
      { role: 'system', content: 'Answer the problem directly and briefly.' },
      { role: 'user', content: question }
    ],
    temperature: 0,
    maxTokens: options.maxTokens,
    timeoutMs: 600_000
  });
  return {
    experiment: 'base (untuned)',
    question,
    error: result.error === null ? null : result.error.message,
    text: result.completion === null ? null : String(result.completion).trim(),
    tokens: result.usage?.completion_tokens ?? null,
    latencyMs: result.latencyMs ?? null
  };
}

/**
 * The same question to both models at once: the compiled result from the
 * fine-tuned student, and the untuned base model's own completion.
 *
 * Both promises start before either is awaited, so the two servers work at the
 * same time. The compiled turn is returned as the turn (it is what the session
 * records, exports, and shows by default), with the base answer attached to it
 * under `baseComparison` so `/show-plan` and `/export` can read it.
 */
/**
 * Ask every lane the comparison has: the main student and the untrained 0.5B base
 * are the pair `/use-both` has always shown; the fine-tuned 1.5B student and the
 * untrained 1.5B base join them once a 1.5B experiment has a recorded winner. All
 * asks start before any is awaited, so the wall clock is the slowest lane, not their
 * sum. Lanes that fail to come up are reported, never answered silently.
 */
async function askTurn({ question, base, alias, compare, session, options, runtime }) {
  const warnings = [];
  let compareState = null;
  if (compare !== null) {
    const lane = await ensureBaseServer(session, options);
    compareState = lane.state;
    if (lane.state !== 'ready') warnings.push(`the 0.5B base model is unavailable: ${lane.detail}`);
  }
  // Each lane's ask is named, never positional, so a missing lane cannot shift its
  // neighbour's result into the wrong slot — the crash the first four-block run hit
  // when the 1.5B base existed but the 1.5B student did not.
  const results = { main: ask({ question, base, alias, options, runtime }) };
  if (compareState === 'ready') results.base05 = askBase({ question, compare, options });
  // The 1.5B base lane joins only when the owner asked for the bases; the 1.5B
  // student joins on its own when its winner exists.
  if (session.base15 !== null && session.bases.enabled) {
    const baseLane = await ensureLane(session.base15, { gguf: BASE_GGUF_15, port: lanePorts(options.port).base15, options });
    if (baseLane.state !== 'ready') {
      warnings.push(`the 1.5B base model is unavailable: ${baseLane.detail}`);
    } else {
      results.base15 = askBase({ question, compare: baseLane, options });
    }
  }
  if (session.student15 !== null) {
    const studentLane = await ensureLane(session.student15, { gguf: session.student15.gguf, port: lanePorts(options.port).student15, options });
    if (studentLane.state !== 'ready') {
      warnings.push(`the 1.5B student is unavailable: ${studentLane.detail}`);
    } else {
      results.student15 = ask({ question, base: studentLane.base, alias: studentLane.alias, options, runtime });
    }
  }
  const settled = {};
  const names = Object.keys(results);
  const values = await Promise.all(Object.values(results));
  names.forEach((name, index) => { settled[name] = values[index]; });
  const turn = settled.main;
  turn.mainExperiment = session.artifact?.experiment ?? null;
  if (settled.base05 !== undefined) turn.baseComparison = settled.base05;
  if (settled.base15 !== undefined) turn.base15 = settled.base15;
  if (settled.student15 !== undefined) {
    turn.student15 = settled.student15;
    turn.student15Experiment = session.student15.experiment;
  }
  return { turn, warnings };
}

async function askBoth({ question, base, alias, compare, options, runtime }) {
  const compiled = ask({ question, base, alias, options, runtime });
  const untuned = askBase({ question, compare, options });
  const [turn, baseTurn] = await Promise.all([compiled, untuned]);
  return { ...turn, baseComparison: baseTurn };
}

async function ask({ question, base, alias, options, runtime }) {
  // The student gets up to three shots per question. When a plan fails — it did not
  // parse, its guard fired, or it was not a program at all — the failure is fed back
  // in the profile's own vocabulary and the model regenerates, so a transient mistake
  // costs a retry instead of a wrong turn. The scored evaluations stay single-shot;
  // this retry loop is the deployed execution mode.
  // `--retries N` names the extra shots after the first, so the default of two
  // means three attempts in total, and a caller can raise it for a stubborn problem
  // or set it to zero for the strict single-shot behaviour the scored runs use.
  const maxAttempts = 1 + Math.max(0, Number(options.retries ?? 2));
  let messages = buildMessages(question);
  let lastTurn = null;
  const failures = [];
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = await generate({ base, model: alias, messages, temperature: 0, maxTokens: options.maxTokens, timeoutMs: 600000 });
    const turn = {
      question,
      completion: result.completion,
      usage: result.usage,
      latencyMs: result.latencyMs,
      attempts: result.attempts,
      attempt,
      totalAttempts: maxAttempts,
      error: result.error,
      detail: null,
      program: null,
      wires: [],
      outcome: null,
      answer: null,
      className: null
    };
    if (result.error !== null) {
      turn.className = 'generation_transport_error';
      lastTurn = turn;
      break;
    }
    const extracted = extractProgram(result.completion);
    if (!extracted.ok) {
      turn.className = 'wrapper_rejected';
      turn.detail = extracted.reason;
    } else {
      turn.program = extracted.program;
      let circuit;
      try {
        circuit = parseCircuit(turn.program);
      } catch (failure) {
        turn.className = 'parse_invalid';
        turn.detail = failure.message;
      }
      if (turn.className === null) {
        turn.wires = circuit.wires.map((wire) => ({ name: wire.name, command: wire.command }));
        try {
          turn.outcome = await runtime.run(circuit, { outputs: ['answer'] });
        } catch (failure) {
          turn.className = 'execution_error';
          turn.detail = `runtime threw: ${failure.message}`;
        }
        if (turn.className === null) {
          if (turn.outcome.status === 'completed') {
            turn.className = 'executed';
            turn.answer = turn.outcome.outputs?.answer ?? null;
          } else {
            turn.className = 'execution_error';
            turn.detail = turn.outcome.error?.message ?? null;
          }
        }
      }
    }
    lastTurn = turn;
    if (turn.className === 'executed' || attempt === maxAttempts) {
      break;
    }
    // Every retry carries the whole history of what went wrong before, so the model
    // sees its earlier mistakes and can correct them rather than repeating them.
    failures.push({ attempt, className: turn.className, detail: turn.detail });
    messages = [
      ...messages,
      { role: 'assistant', content: String(turn.completion ?? '') },
      { role: 'user', content: retryHintOf(failures) }
    ];
  }
  return lastTurn;
}

/**
 * The failure hint the student sees before regenerating its plan: every previous
 * attempt, numbered, each with its own failure, then one instruction. The history is
 * the point — a model that sees only the last error repeats the first.
 */
function retryHintOf(failures) {
  const lines = ['Your previous attempts failed:',
    ...failures.map((failure) => {
      const kind = failure.className === 'parse_invalid'
        ? 'did not parse'
        : failure.className === 'execution_error'
          ? 'executed but failed its own check'
          : 'was not a SOP Lang program';
      return `${failure.attempt}. ${kind}: ${failure.detail}`;
    }),
    'Emit a corrected SOP Lang program.'];
  return lines.join('\n');
}

/** The transcript record of one turn; the raw completion is kept for a turn that produced no program. */

/**
 * The chat keeps every answered question on disk, one JSON record per line, so the
 * up arrow and /history still know them after the process (and the terminal) is gone.
 * The file is a convenience: it grows by appends, and a read-only disk must not kill
 * the chat, so every read and write here is best-effort.
 */
function loadChatHistory() {
  let records = [];
  try {
    if (!existsSync(CHAT_HISTORY_FILE)) return records;
    records = readFileSync(CHAT_HISTORY_FILE, 'utf8')
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => { try { return JSON.parse(line); } catch { return null; } })
      .filter((record) => record !== null && typeof record.q === 'string');
  } catch {
    records = [];
  }
  return records;
}

function appendChatHistory(record) {
  try {
    mkdirSync(dirname(CHAT_HISTORY_FILE), { recursive: true });
    appendFileSync(CHAT_HISTORY_FILE, `${JSON.stringify(record)}\n`);
  } catch {
    // Best-effort: the answer was shown regardless of whether the note could be kept.
  }
}

function historyRecordOf(turn) {
  const record = { t: new Date().toISOString(), q: turn.question, student: exportedTurn(turn) };
  const baseFields = (base) => ({ answer: base.text ?? null, error: base.error, tokens: base.tokens ?? null, latencyMs: base.latencyMs ?? null });
  if (turn.baseComparison !== undefined) record.base05 = baseFields(turn.baseComparison);
  if (turn.base15 !== undefined) record.base15 = baseFields(turn.base15);
  if (turn.student15 !== undefined) record.student15 = exportedTurn(turn.student15);
  return record;
}

function exportedTurn(turn) {
  return {
    question: turn.question,
    class: turn.className,
    divergence: divergenceOf(turn.className),
    attempts: turn.attempts,
    usage: turn.usage,
    latencyMs: turn.latencyMs,
    wires: turn.wires,
    answer: turn.answer === null ? null : String(turn.answer),
    detail: turn.detail,
    program: turn.program,
    completion: turn.program === null ? turn.completion : null
  };
}

/**
 * The output of one interactive command. `exit` tells the loop to leave; every
 * other command answers from the session record and touches no server state, so
 * a command costs no tokens and is never counted as a turn.
 */
export function runCommand({ name, argument }, session) {
  if (name === 'help' || name === '') {
    return { exit: false, text: ['commands:', ...COMMANDS.map((command) => `  ${command.usage.padEnd(COMMAND_WIDTH)}  ${command.summary}`)].join('\n') };
  }
  if (name === 'exit') {
    return { exit: true, text: '' };
  }
  if (name === 'model') {
    const artifact = session.artifact;
    const laneState = (lane) => (lane.state === 'ready' ? 'ready' : lane.state === 'failed' ? 'unavailable' : 'starting');
    const base05 = session.compare.enabled ? `on (${laneState(session.compare)})` : 'off';
    const student15 = session.student15 === null ? 'off' : `on (${session.student15.experiment})`;
    const base15 = session.bases.enabled
      ? `on (${session.base15 === null ? 'unavailable' : laneState(session.base15)})`
      : 'off';
    return {
      exit: false,
      text: [
        `model: ${artifact.experiment}${artifact.winner === null ? '' : ` (${artifact.winner})`}`,
        `artifact: ${artifact.gguf.replace(`${REPOSITORY_ROOT}/`, '')}`,
        `alias: ${session.alias}`,
        `base: ${session.base}`,
        `student 0.5B (main): on`,
        `base 0.5B: ${base05}`,
        `student 1.5B: ${student15}`,
        `base 1.5B: ${base15}`
      ].join('\n')
    };
  }
  if (name === 'use-both') {
    // A bare `/use-both` toggles, because that is what the owner reaches for; an
    // explicit `true` or `false` sets the state, so a script can be unambiguous.
    const wanted0 = argument.trim().toLowerCase();
    if (wanted0 !== '' && wanted0 !== 'true' && wanted0 !== 'false') {
      return { exit: false, text: '✗ /use-both takes true or false, or nothing to toggle.' };
    }
    const wanted = wanted0 === '' ? !session.compare.enabled : wanted0 === 'true';
    session.compare.enabled = wanted;
    if (!wanted) {
      return { exit: false, text: '✔ comparison off: only the trained models answer.' };
    }
    if (session.compare.state === 'ready') {
      return { exit: false, text: '✔ comparison on: every question is answered by the fine-tuned model and by the untuned base model.' };
    }
    if (session.compare.state === 'failed') {
      return { exit: false, text: `✗ comparison on, but the base model is unavailable: ${session.compare.detail}` };
    }
    return { exit: false, text: '⏳ comparison on: the base model is starting; the next question waits for it.' };
  }
  if (name === 'bases') {
    // One command for both untrained bases: the owner asks for the comparison as
    // a pair, so `/bases` flips them together while `/use-both` keeps its narrow
    // meaning (the 0.5B base only). A bare `/bases` flips, an explicit true/on or
    // false/off sets them, and a lane that cannot come up is reported, not promised.
    const wanted0 = argument.trim().toLowerCase();
    if (wanted0 !== '' && wanted0 !== 'true' && wanted0 !== 'on' && wanted0 !== 'false' && wanted0 !== 'off') {
      return { exit: false, text: '✗ /bases takes true/on or false/off, or nothing to toggle.' };
    }
    const bothOn = session.compare.enabled && session.bases.enabled;
    const wanted = wanted0 === '' ? !bothOn : (wanted0 === 'true' || wanted0 === 'on');
    session.compare.enabled = wanted;
    session.bases.enabled = wanted;
    if (!wanted) {
      return { exit: false, text: '✔ bases off: only the two trained models answer.' };
    }
    const lines = ['✔ bases on: the two untrained bases join the two trained models.'];
    // The 0.5B base lane: readiness is `compare.state`, its artifact existence is
    // known up front.
    if (session.compare.state === 'ready') lines.push('  0.5B base: ready');
    else if (session.compare.state === 'failed') lines.push(`  ✗ 0.5B base: unavailable: ${session.compare.detail}`);
    else if (!existsSync(BASE_GGUF)) lines.push(`  ✗ 0.5B base: unavailable: the artifact is missing at ${BASE_GGUF.replace(`${REPOSITORY_ROOT}/`, '')}`);
    else lines.push('  0.5B base: starting');
    // The 1.5B base lane: a missing gguf or --no-1.5b/--single leaves it out.
    if (session.base15 === null) {
      const reason = existsSync(BASE_GGUF_15)
        ? 'disabled by --no-1.5b or --single'
        : `the artifact is missing at ${BASE_GGUF_15.replace(`${REPOSITORY_ROOT}/`, '')}`;
      lines.push(`  ✗ 1.5B base: unavailable: ${reason}`);
    } else if (session.base15.state === 'ready') lines.push('  1.5B base: ready');
    else if (session.base15.state === 'failed') lines.push(`  ✗ 1.5B base: unavailable: ${session.base15.detail}`);
    else lines.push('  1.5B base: starting');
    return { exit: false, text: lines.join('\n') };
  }
  if (name === 'stats') {
    const tokens = session.turns.reduce((totals, turn) => ({
      prompt: totals.prompt + (turn.usage?.prompt_tokens ?? 0),
      completion: totals.completion + (turn.usage?.completion_tokens ?? 0),
      total: totals.total + (turn.usage?.total_tokens ?? 0)
    }), { prompt: 0, completion: 0, total: 0 });
    const executed = session.turns.filter((turn) => turn.className === 'executed').length;
    const recovered = session.turns.filter((turn) => turn.className === 'executed' && turn.attempt > 1).length;
    const failedFirst = session.turns.filter((turn) => turn.attempt > 1 || turn.className !== 'executed').length;
    return {
      exit: false,
      text: [
        `turns: ${session.turns.length}`,
        `tokens: ${tokens.prompt} prompt + ${tokens.completion} completion = ${tokens.total} total (as the server reported them)`,
        `executed: ${executed} of ${session.turns.length}`,
        `retries recovered: ${recovered} of ${failedFirst} turns whose first plan failed`
      ].join('\n')
    };
  }
  if (name === 'show-plan') {
    const turn = session.turns.at(-1) ?? null;
    if (turn === null) return { exit: false, text: '✗ no turn to show yet: ask a question first.' };
    const lines = [`? ${turn.question}`];
    if (turn.program === null) {
      lines.push(`✗ no program was generated (${turn.className}${turn.detail === null ? '' : `: ${turn.detail}`}).`);
      return { exit: false, text: lines.join('\n') };
    }
    lines.push('--- generated plan ---', turn.program.trimEnd(), '--- end of plan ---', '');
    lines.push(`wires: ${turn.wires.map((wire) => `@${wire.name} ${wire.command}`).join(', ')}`);
    lines.push(`executed: ${turn.className === 'executed' ? 'yes' : 'no'}`);
    if (turn.className === 'executed') {
      lines.push(`divergence: ${divergenceOf(turn.className)} (the circuit executed; this CLI holds no reference answer to compare its answer against)`);
    } else {
      lines.push(`divergence: ${divergenceOf(turn.className)}`);
      if (turn.detail) lines.push(`detail: ${turn.detail}`);
    }
    return { exit: false, text: lines.join('\n') };
  }
  if (name === 'export') {
    if (argument === '') return { exit: false, text: '✗ /export needs a path: /export <path>' };
    if (session.turns.length === 0) return { exit: false, text: '✗ no turn to export yet: ask a question first.' };
    mkdirSync(dirname(argument), { recursive: true });
    writeFileSync(argument, `${session.turns.map((turn) => JSON.stringify(exportedTurn(turn))).join('\n')}\n`);
    return { exit: false, text: `✔ wrote ${session.turns.length} turn(s) to ${argument}` };
  }
  if (name === 'history') {
    const saved = session.saved ?? [];
    if (saved.length === 0) return { exit: false, text: 'no saved turns yet: ask a question first.' };
    const count = argument.trim() === '' ? 20 : Number(argument.trim());
    if (!Number.isInteger(count) || count < 1) return { exit: false, text: '✗ /history takes a number of turns, e.g. /history 10' };
    const shown = saved.slice(-count);
    const lines = [];
    shown.forEach((record, index) => {
      const when = typeof record.t === 'string' ? `${record.t.slice(0, 10)} ${record.t.slice(11, 16)}Z` : '';
      lines.push(`#${saved.length - shown.length + index + 1}${when === '' ? '' : ` (${when})`} ? ${record.q}`);
      const student = record.student;
      if (student !== undefined) {
        const parts = [student.class !== 'executed' ? `✗ ${student.class}` : null, student.answer]
          .filter((part) => part !== null && part !== undefined);
        lines.push(`  fine-tuned: ${parts.join(' ') || '(no answer)'}`);
      }
      for (const [key, label] of [['base05', 'base 0.5B'], ['base15', 'base 1.5B'], ['student15', 'fine-tuned 1.5B']]) {
        const lane = record[key];
        if (lane === undefined) continue;
        if (lane.error !== null && lane.error !== undefined) {
          lines.push(`  ${label}: ✗ ${lane.error}`);
        } else if (lane.class !== undefined && lane.class !== null && lane.class !== 'executed') {
          lines.push(`  ${label}: ✗ ${lane.class}${lane.detail === null || lane.detail === undefined ? '' : `: ${lane.detail}`}`);
        } else {
          lines.push(`  ${label}: ${lane.answer ?? '(empty)'}`);
        }
      }
    });
    return { exit: false, text: lines.join('\n') };
  }
  return { exit: false, text: `✗ unknown command "/${name}"; /help lists the commands.` };
}

/**
 * Hard-death safety: one detached reaper watches this chat's PID and closes the
 * servers the chat started if the chat is killed hard — a SIGKILL cannot run the
 * cleanup in `stopServer`. The reaper reads the PID file this chat appends to,
 * so a lane started late is covered too, and it never signals a server it was
 * not given.
 */
const reaperPidFile = join(tmpdir(), `soplang-chat-${process.pid}.pids`);

function startReaper() {
  try {
    writeFileSync(reaperPidFile, '');
  } catch {
    // A read-only temp dir only means the reaper sees no servers, not that the
    // chat should refuse to run.
  }
  try {
    const reaper = spawn(
      process.execPath,
      [join(REPOSITORY_ROOT, 'evaluation/server-reaper.mjs'), String(process.pid), reaperPidFile],
      { cwd: REPOSITORY_ROOT, detached: true, stdio: 'ignore' }
    );
    reaper.unref();
  } catch {
    // Best-effort: graceful shutdown still works without the reaper.
  }
}

function recordServerPid(child) {
  if (child === null || child === undefined || !Number.isInteger(child.pid)) return;
  try {
    appendFileSync(reaperPidFile, `${child.pid}\n`);
  } catch {
    // Best-effort.
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(HELP);
    process.exit(0);
  }

  // The reaper must exist before any server is started: it is the only thing a
  // SIGKILLed chat leaves behind, and it is what closes the servers then.
  startReaper();

  // No --gguf and no --experiment: the newest 0.5B-trained winner, because the
  // owner wants to play with the latest work of the main arm, and a frozen
  // default would hand them an old checkpoint the day after every new arm. The
  // 1.5B arm's winner is a different size and never the default; when no 0.5B
  // winner is recorded yet, the latest experiment of either arm is the fallback.
  const artifact = artifactFor({ gguf: options.gguf, experiment: options.experiment ?? winner05()?.experiment ?? latestExperiment() });
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
    recordServerPid(managed);
    alias = aliasFor(artifact.gguf);
  } else if (options.base === null) {
    // The port is occupied. If the occupier serves the requested artifact, reuse it;
    // if it serves a different one, it is a leftover from an earlier session that was
    // killed hard (SIGKILL cannot run cleanup), and the owner asked for this artifact.
    // Reusing the wrong model silently was the trap that made `--gguf <new>` appear to
    // answer with an old checkpoint, so the occupier is stopped and the requested
    // artifact is served instead.
    const served = await servedAlias(base);
    if (served !== null && served !== alias) {
      process.stdout.write(`port ${options.port} serves "${served}", not the requested ${alias}; stopping the leftover server and starting the requested model …\n`);
      stopLeftoverOnPort(options.port);
      if (await serverIsUp(base)) {
        throw new Error(`port ${options.port} is still occupied after stopping the leftover server; pass --port to use another`);
      }
      managed = await startServer({ gguf: artifact.gguf, port: options.port, threads: options.threads });
      recordServerPid(managed);
      alias = aliasFor(artifact.gguf);
    }
  }
  process.stdout.write('the two trained models answer by default; /bases adds the two untrained bases.\n');
  process.stdout.write('type /help for the interactive commands (/show-plan, /stats, /model, /use-both, /bases, /export, /history, /exit).\n');
  process.stdout.write(`questions are saved to evaluation/registry/chat-history.jsonl; the up arrow recalls them, /history lists them.\n`);

  const stopServer = () => {
    // Every server this session manages — the main student and the three lanes —
    // stops with the chat: a leaked llama-server would hold both a port and the
    // GPU memory.
    for (const child of [managed, session.compare.managed, session.student15?.managed, session.base15?.managed]) {
      if (child === null || child === undefined) {
        continue;
      }
      try {
        process.kill(-child.pid, 'SIGTERM');
      } catch {
        child.kill('SIGTERM');
      }
    }
    // Leave no stale PID file for the reaper to act on after a graceful exit.
    try {
      unlinkSync(reaperPidFile);
    } catch {
      // Already gone.
    }
  };
  const leave = () => {
    stopServer();
    process.exit(0);
  };
  process.on('SIGINT', () => {
    stopServer();
    process.stdout.write('\n');
    process.exit(0);
  });
  process.on('SIGTERM', leave);
  process.on('SIGHUP', leave);
  process.on('exit', stopServer);

  const runtime = createRuntime();
  const { student15, base15 } = select15Lanes(winner15(), options);
  const session = {
    artifact,
    base,
    alias,
    turns: [],
    // Saved turns, loaded from the history file at startup and extended by this
    // session, so /history and the up arrow span every session, not just this one.
    saved: loadChatHistory(),
    // The `/use-both` comparison: `state` tracks whether the 0.5B base model has
    // been started, so a question never pays for starting it twice and a failure
    // is reported rather than retried silently. It is off by default; the bases
    // are opt-in, and `/bases` flips both of them together.
    compare: { enabled: options.useBoth && !options.single, state: 'idle', base: null, alias: null, managed: null, detail: null },
    // Whether the two untrained bases are wanted. `/bases` flips this together
    // with `compare.enabled`; the 1.5B base lane engages only while this is on.
    bases: { enabled: false },
    // The 1.5B pair: the fine-tuned 1.5B student joins whenever an experiment pins
    // the 1.5B base and has a recorded winner; the untrained 1.5B base is kept
    // ready to serve when `/bases` asks for it. `--no-1.5b` and `--single` drop
    // both, per `select15Lanes`.
    student15,
    base15
  };

  // The startup summary says plainly which models will answer, so the banner's
  // single-server line is never mistaken for the whole session: the 1.5B student
  // starts lazily on the first question, and the untrained bases stay off.
  const bannerInfo = modelInfoOf(artifact.experiment);
  process.stdout.write(`model: ${artifact.experiment} (${artifact.winner ?? 'base'})${bannerInfo.base === null ? '' : ` — ${bannerInfo.base}`}${bannerInfo.dataVersion === null ? '' : ` — ${bannerInfo.dataVersion}`}${bannerInfo.finishedUtc === null ? '' : ` — trained ${bannerInfo.finishedUtc}`}\n`);
  if (session.student15 !== null) {
    process.stdout.write(`1.5B student: ${session.student15.experiment} (${session.student15.winner}) — answers beside it, starting on the first question\n`);
  } else {
    process.stdout.write('1.5B student: none yet (no 1.5B experiment has a recorded winner; --no-1.5b also drops it)\n');
  }
  process.stdout.write('untrained bases: off — /bases adds the 0.5B and the 1.5B base\n');

  if (options.once !== null) {
    // `--once` honours the same default as the interactive loop: the trained
    // students answer, and the untrained bases stay off unless `--use-both`
    // asks for the 0.5B one (the plan is force-shown only while a base is on).
    const compare = session.compare.enabled ? session.compare : null;
    const { turn, warnings } = await askTurn({ question: options.once, base, alias, compare, session, options, runtime });
    const turnOptions = compare !== null && compare.state === 'ready' ? { ...options, showPlan: true } : options;
    process.stdout.write(`\n? ${options.once}\n${renderExchange(turn, turnOptions)}\n`);
    for (const warning of warnings) {
      process.stdout.write(`✗ ${warning}\n`);
    }
    appendChatHistory(historyRecordOf(turn));
    stopServer();
    process.exit(0);
  }

  const reader = createInterface({ input: process.stdin, output: process.stdout, prompt: '? ', historySize: 500 });
  // The up arrow walks the line history readline keeps, oldest first; seeding it with
  // every saved question makes earlier sessions' examples reachable the same way.
  reader.history = session.saved.map((record) => record.q);
  reader.prompt();
  for await (const line of reader) {
    const decision = decodeLine(line);
    if (decision.kind === 'blank') {
      reader.prompt();
      continue;
    }
    if (decision.kind === 'command') {
      // Answered here, so the line is never sent to the model and never becomes
      // a turn: no request, no token, no entry in the session record.
      const result = runCommand(decision, session);
      if (result.exit) break;
      if (result.text !== '') process.stdout.write(`\n${result.text}\n`);
      reader.prompt();
      continue;
    }
    // The comparison asks both models at the same time, on the same question, so the
    // two answers are comparable: awaiting one and then the other would also work,
    // but two 0.5B models fit side by side and the parallel form halves the wait.
    const compare = session.compare.enabled ? session.compare : null;
    const { turn, warnings } = await askTurn({ question: decision.text, base, alias, compare, session, options, runtime });
    // The compiled plan is always shown when the comparison runs: the whole point is to
    // compare what each model produced, and for the student the produced thing IS the
    // plan. Showing only the answer would hide the object under comparison.
    const turnOptions = compare !== null && compare.state === 'ready' ? { ...options, showPlan: true } : options;
    session.turns.push(turn);
    const record = historyRecordOf(turn);
    session.saved.push(record);
    appendChatHistory(record);
    process.stdout.write(`\n${renderExchange(turn, turnOptions)}\n\n`);
    for (const warning of warnings) {
      process.stdout.write(`✗ ${warning}\n`);
    }
    reader.prompt();
  }
  reader.close();
  stopServer();
}

if (process.argv[1] !== undefined && pathToFileURL(process.argv[1]).href === import.meta.url) {
  await main();
}
