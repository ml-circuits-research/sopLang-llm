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

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { createInterface } from 'node:readline';
import { pathToFileURL } from 'node:url';

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
  const options = { gguf: null, experiment: null, base: null, port: 8087, maxTokens: 1024, threads: null, showPlan: false, once: null, useBoth: false, help: false };
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
  { usage: '/model', summary: 'print the served artifact, its alias, and the base URL' },
  { usage: '/use-both [true|false]', summary: 'toggle comparing the fine-tuned model against the untuned base model; with no argument it flips the current setting' },
  { usage: '/export <path>', summary: 'write the session transcript to a JSONL file (overwrites it)' },
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
export const BASE_GGUF = `${REPOSITORY_ROOT}/training/checkpoints/base-f16.gguf`;

const COMMAND_WIDTH = Math.max(...COMMANDS.map((command) => command.usage.length));

const HELP = `Usage: node evaluation/chat.mjs [--experiment <id> | --gguf <path>] [options]

Ask a question; the student compiles it into a SOP Lang circuit and the runtime
executes that circuit, so the printed answer is the one the circuit computed.

Options:
  --experiment <id>   serve the selected checkpoint of this experiment (default exp-008-sft-shapes)
  --gguf <path>       serve this artifact instead
  --base <url>        use an already running server instead of starting one
  --use-both          start with the base-model comparison on: every question is
                      answered by the fine-tuned model and by the untuned base
                      model, the second on the next port (see /use-both)
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
function renderComparison(base) {
  const lines = ['--- untuned base model (own weights, no circuit) ---'];
  if (base.error !== null) {
    lines.push(`✗ the base model did not answer: ${base.error}`);
    return lines;
  }
  const text = base.text === null || base.text === '' ? '(empty completion)' : base.text;
  lines.push(text);
  const measured = [base.tokens === null ? null : `${base.tokens} tokens`, base.latencyMs === null ? null : `${(base.latencyMs / 1000).toFixed(1)}s`]
    .filter((part) => part !== null)
    .join(', ');
  if (measured !== '') lines.push(`(${measured})`);
  return lines;
}

function renderExchange(turn, options) {
  const lines = [];
  if (turn.baseComparison !== undefined) {
    // With the comparison on, the two answers are shown in a fixed order and with
    // their provenance, so a difference is read as "compiled" against "own weights"
    // rather than as two anonymous completions.
    lines.push(...renderComparison(turn.baseComparison), '');
  }
  if (turn.program !== null && options.showPlan) {
    lines.push('--- generated plan ---', turn.program.trimEnd(), '--- end of plan ---', '');
  }
  if (turn.className === 'generation_transport_error') {
    lines.push(`✗ generation failed after ${turn.attempts} attempt(s): ${turn.error?.message ?? 'no reply'}`);
    return lines.join('\n');
  }
  if (turn.className === 'wrapper_rejected') {
    lines.push(`✗ the model did not emit a plan (${turn.detail}).`);
    lines.push('  A student trained on the compiled-plan profile answers with a circuit; prose means the question sits');
    lines.push('  outside what it learned. The raw completion was:', '', `  ${String(turn.completion ?? '').trim().slice(0, 500)}`);
    return lines.join('\n');
  }
  if (turn.className === 'parse_invalid') {
    lines.push(`✗ the plan did not parse: ${turn.detail}`);
    lines.push('  Re-run the same question with --show-plan to read the text the model emitted.');
    return lines.join('\n');
  }
  if (turn.className === 'executed') {
    const answer = turn.answer;
    lines.push(`✔ answer (executed circuit): ${typeof answer === 'string' ? answer : JSON.stringify(answer)}`);
    return lines.join('\n');
  }
  lines.push(`✗ the plan did not execute: ${turn.outcome?.status ?? 'failed'}${turn.outcome?.code ? `:${turn.outcome.code}` : ''}`);
  if (turn.detail) lines.push(`  ${turn.detail}`);
  lines.push('  The circuit failed its own guards, which means the compiled values or the computation were wrong');
  lines.push('  for this statement. Use /show-plan (or re-run with --show-plan) to read the circuit it produced.');
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
async function servedAlias(base) {
  try {
    const response = await fetch(`${base}/v1/models`);
    if (!response.ok) {
      return null;
    }
    const payload = await response.json();
    const first = Array.isArray(payload?.data) ? payload.data[0] : null;
    return typeof first?.id === 'string' && first.id !== '' ? first.id : null;
  } catch {
    return null;
  }
}

async function ensureBaseServer(session, options) {
  const compare = session.compare;
  if (compare.state === 'ready' || compare.state === 'failed') {
    return compare;
  }
  const port = options.port + 1;
  const base = `http://127.0.0.1:${port}`;
  if (await serverIsUp(base)) {
    // Something already answers on the comparison port. It is not necessarily the
    // base artifact — another session may serve a checkpoint there — so the alias is
    // read from the server itself rather than assumed, and a server serving a student
    // is refused. Comparing a student against a student would produce two compiled
    // answers and call the comparison a success.
    const served = await servedAlias(base);
    if (served === null || served === aliasFor(BASE_GGUF)) {
      compare.state = 'ready';
      compare.base = base;
      compare.alias = served ?? aliasFor(BASE_GGUF);
      compare.managed = null;
      compare.detail = served === null ? 'an unnamed server on the comparison port is assumed to serve the base model' : null;
      return compare;
    }
    compare.state = 'failed';
    compare.detail = `port ${port} serves "${served}", not the untuned base model; stop it or pass a different --port`;
    return compare;
  }
  if (!existsSync(BASE_GGUF)) {
    compare.state = 'failed';
    compare.detail = `the base artifact is missing at ${BASE_GGUF.replace(`${REPOSITORY_ROOT}/`, '')}`;
    return compare;
  }
  try {
    process.stdout.write(`starting the untuned base model on port ${port} for the comparison …\n`);
    compare.managed = await startServer({ gguf: BASE_GGUF, port, threads: options.threads });
    compare.state = 'ready';
    compare.base = base;
    compare.alias = aliasFor(BASE_GGUF);
  } catch (error) {
    compare.state = 'failed';
    compare.detail = error.message;
  }
  return compare;
}

/**
 * The untuned base model's own answer to the same question: a prose completion
 * from the recorded chat profile, with no circuit and no execution, which is
 * exactly what the comparison is meant to show next to the compiled result.
 */
async function askBase({ question, compare, options }) {
  const result = await generate({
    base: compare.base,
    model: compare.alias,
    messages: buildMessages(question),
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
async function askBoth({ question, base, alias, compare, options, runtime }) {
  const compiled = ask({ question, base, alias, options, runtime });
  const untuned = askBase({ question, compare, options });
  const [turn, baseTurn] = await Promise.all([compiled, untuned]);
  return { ...turn, baseComparison: baseTurn };
}

async function ask({ question, base, alias, options, runtime }) {
  const result = await generate({ base, model: alias, messages: buildMessages(question), temperature: 0, maxTokens: options.maxTokens, timeoutMs: 600000 });
  const turn = {
    question,
    completion: result.completion,
    usage: result.usage,
    latencyMs: result.latencyMs,
    attempts: result.attempts,
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
    return turn;
  }
  const extracted = extractProgram(result.completion);
  if (!extracted.ok) {
    turn.className = 'wrapper_rejected';
    turn.detail = extracted.reason;
    return turn;
  }
  turn.program = extracted.program;
  let circuit;
  try {
    circuit = parseCircuit(turn.program);
  } catch (failure) {
    turn.className = 'parse_invalid';
    turn.detail = failure.message;
    return turn;
  }
  turn.wires = circuit.wires.map((wire) => ({ name: wire.name, command: wire.command }));
  try {
    turn.outcome = await runtime.run(circuit, { outputs: ['answer'] });
  } catch (failure) {
    turn.className = 'execution_error';
    turn.detail = `runtime threw: ${failure.message}`;
    return turn;
  }
  if (turn.outcome.status === 'completed') {
    turn.className = 'executed';
    turn.answer = turn.outcome.outputs?.answer ?? null;
  } else {
    turn.className = 'execution_error';
    turn.detail = turn.outcome.error?.message ?? null;
  }
  return turn;
}

/** The transcript record of one turn; the raw completion is kept for a turn that produced no program. */
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
    return {
      exit: false,
      text: [
        `model: ${artifact.experiment}${artifact.winner === null ? '' : ` (${artifact.winner})`}`,
        `artifact: ${artifact.gguf.replace(`${REPOSITORY_ROOT}/`, '')}`,
        `alias: ${session.alias}`,
        `base: ${session.base}`,
        `compare against the base model: ${session.compare.enabled ? 'on' : 'off'}${
          session.compare.enabled ? ` (${session.compare.state})` : ''
        }`
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
      return { exit: false, text: '✔ comparison off: only the fine-tuned model answers.' };
    }
    if (session.compare.state === 'ready') {
      return { exit: false, text: '✔ comparison on: every question is answered by the fine-tuned model and by the untuned base model.' };
    }
    if (session.compare.state === 'failed') {
      return { exit: false, text: `✗ comparison on, but the base model is unavailable: ${session.compare.detail}` };
    }
    return { exit: false, text: '⏳ comparison on: the base model is starting; the next question waits for it.' };
  }
  if (name === 'stats') {
    const tokens = session.turns.reduce((totals, turn) => ({
      prompt: totals.prompt + (turn.usage?.prompt_tokens ?? 0),
      completion: totals.completion + (turn.usage?.completion_tokens ?? 0),
      total: totals.total + (turn.usage?.total_tokens ?? 0)
    }), { prompt: 0, completion: 0, total: 0 });
    const executed = session.turns.filter((turn) => turn.className === 'executed').length;
    return {
      exit: false,
      text: [
        `turns: ${session.turns.length}`,
        `tokens: ${tokens.prompt} prompt + ${tokens.completion} completion = ${tokens.total} total (as the server reported them)`,
        `executed: ${executed} of ${session.turns.length}`
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
  return { exit: false, text: `✗ unknown command "/${name}"; /help lists the commands.` };
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
  process.stdout.write('type /help for the interactive commands (/show-plan, /stats, /model, /use-both, /export, /exit).\n');

  const stopServer = () => {
    // The comparison's base server is managed by this session too, so it stops with
    // it: a leaked llama-server would hold both a port and the GPU memory.
    for (const child of [managed, session.compare.managed]) {
      if (child === null || child === undefined) {
        continue;
      }
      try {
        process.kill(-child.pid, 'SIGTERM');
      } catch {
        child.kill('SIGTERM');
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
  const session = {
    artifact,
    base,
    alias,
    turns: [],
    // The `/use-both` comparison: `state` tracks whether the base model has been
    // started, so a question never pays for starting it twice and a failure is
    // reported rather than retried silently.
    compare: { enabled: options.useBoth, state: 'idle', base: null, alias: null, managed: null, detail: null }
  };

  if (options.once !== null) {
    const turn = await ask({ question: options.once, base, alias, options, runtime });
    process.stdout.write(`\n? ${options.once}\n${renderExchange(turn, options)}\n`);
    stopServer();
    process.exit(0);
  }

  const reader = createInterface({ input: process.stdin, output: process.stdout, prompt: '? ' });
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
    let compare = null;
    if (session.compare.enabled) {
      compare = await ensureBaseServer(session, options);
    }
    const turn = compare !== null && compare.state === 'ready'
      ? await askBoth({ question: decision.text, base, alias, compare, options, runtime })
      : await ask({ question: decision.text, base, alias, options, runtime });
    session.turns.push(turn);
    process.stdout.write(`\n${renderExchange(turn, options)}\n\n`);
    if (compare !== null && compare.state !== 'ready') {
      process.stdout.write(`✗ the comparison could not run: ${compare.detail}\n`);
    }
    reader.prompt();
  }
  reader.close();
  stopServer();
}

if (process.argv[1] !== undefined && pathToFileURL(process.argv[1]).href === import.meta.url) {
  await main();
}
