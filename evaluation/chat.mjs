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
import { mkdirSync, writeFileSync } from 'node:fs';
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

const COMMAND_WIDTH = Math.max(...COMMANDS.map((command) => command.usage.length));

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
function renderExchange(turn, options) {
  const lines = [];
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
        `base: ${session.base}`
      ].join('\n')
    };
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
  process.stdout.write('type /help for the interactive commands (/show-plan, /stats, /model, /export, /exit).\n');

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
  const session = { artifact, base, alias, turns: [] };

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
    const turn = await ask({ question: decision.text, base, alias, options, runtime });
    session.turns.push(turn);
    process.stdout.write(`\n${renderExchange(turn, options)}\n\n`);
    reader.prompt();
  }
  reader.close();
  stopServer();
}

if (process.argv[1] !== undefined && pathToFileURL(process.argv[1]).href === import.meta.url) {
  await main();
}
