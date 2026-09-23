import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { BASE_GGUF, COMMANDS, decodeLine, divergenceOf, runCommand } from '../evaluation/chat.mjs';
import { aliasFor } from '../evaluation/server.mjs';
import { answerBody } from '../teacher/families/probes.mjs';

const REPOSITORY_ROOT = fileURLToPath(new URL('..', import.meta.url));

/** A compiled plan in the shape the dataset teaches, so the runtime executes it. */
const PROGRAM = `@slots literal\n{\n  "value": 7\n}\n\n@answer jsEval\n${answerBody('const slots = $slots;\nreturn String(slots.value);')}\n`;

/** One turn record in the shape `ask` returns, so the commands can be read without a model. */
function turnOf({ className = 'executed', question = 'How many?', program = PROGRAM, wires = [{ name: 'slots', command: 'literal' }, { name: 'answer', command: 'jsEval' }], answer = '7', detail = null, usage = { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 } } = {}) {
  return { question, completion: program, usage, latencyMs: 12, attempts: 1, error: null, detail, program, wires, outcome: null, answer, className };
}

function sessionOf(turns) {
  return { artifact: { experiment: 'exp-000-fixture', winner: 'checkpoint-0', gguf: join(REPOSITORY_ROOT, 'training/checkpoints/base-f16.gguf') }, base: 'http://127.0.0.1:1', alias: 'student-fixture', turns };
}

test('a command line is a command and a statement is a question', () => {
  assert.deepEqual(decodeLine('/help'), { kind: 'command', name: 'help', argument: '' });
  assert.deepEqual(decodeLine('  /show-plan  '), { kind: 'command', name: 'show-plan', argument: '' });
  assert.deepEqual(decodeLine('/export out/session.jsonl'), { kind: 'command', name: 'export', argument: 'out/session.jsonl' });
  assert.deepEqual(decodeLine('exit'), { kind: 'command', name: 'exit', argument: '' });
  assert.deepEqual(decodeLine('quit'), { kind: 'command', name: 'exit', argument: '' });
  assert.deepEqual(decodeLine('   '), { kind: 'blank' });
  assert.deepEqual(
    decodeLine('Emma bought 3 boxes of cookies. Each box has 12 cookies inside.'),
    { kind: 'question', text: 'Emma bought 3 boxes of cookies. Each box has 12 cookies inside.' }
  );
  // A statement that carries a slash mid-text stays a question: only a leading `/` is a command.
  assert.equal(decodeLine('Divide 12 by 4 to get the ratio 3/1.').kind, 'question');
});

test('every interactive command is declared once and listed by /help', () => {
  const names = COMMANDS.map((command) => command.usage.split(' ')[0]);
  assert.equal(new Set(names).size, names.length, 'two commands share a name');
  const { exit, text } = runCommand({ name: 'help', argument: '' }, sessionOf([]));
  assert.equal(exit, false);
  const lines = text.split('\n');
  assert.equal(lines.length, COMMANDS.length + 1, 'the help text has one line per command');
  for (const command of COMMANDS) {
    assert.ok(text.includes(command.usage), `${command.usage} is missing from /help`);
    assert.ok(text.includes(command.summary), `the summary of ${command.usage} is missing from /help`);
  }
  // The two commands the owner asked for are part of the list.
  assert.ok(names.includes('/help') && names.includes('/show-plan'));
});

test('an unimplemented command is refused and points at the help', () => {
  const { exit, text } = runCommand({ name: 'nope', argument: '' }, sessionOf([]));
  assert.equal(exit, false);
  assert.match(text, /unknown command "\/nope"/);
  assert.match(text, /\/help lists the commands/);
});

test('/exit leaves the session and prints nothing', () => {
  const { exit, text } = runCommand({ name: 'exit', argument: '' }, sessionOf([]));
  assert.equal(exit, true);
  assert.equal(text, '');
});

test('/show-plan reports the program, its wires, and the divergence of the last turn', () => {
  const failed = runCommand({ name: 'show-plan', argument: '' }, sessionOf([turnOf({ className: 'execution_error', detail: 'Wire "answer" failed: probe failed: the word must be a non-empty string' })]));
  assert.ok(failed.text.includes(PROGRAM.trimEnd()), 'the full program is printed');
  assert.ok(failed.text.includes('wires: @slots literal, @answer jsEval'), 'the parsed wire names are printed');
  assert.ok(failed.text.includes('executed: no'));
  assert.ok(failed.text.includes('divergence: runtime_failure'));
  assert.ok(failed.text.includes('detail: Wire "answer" failed'));

  const executed = runCommand({ name: 'show-plan', argument: '' }, sessionOf([turnOf()]));
  assert.ok(executed.text.includes('executed: yes'));
  assert.match(executed.text, /divergence: none \(the circuit executed/);

  const rejected = runCommand({ name: 'show-plan', argument: '' }, sessionOf([turnOf({ className: 'wrapper_rejected', program: null, wires: [], detail: 'no_wire_declaration' })]));
  assert.match(rejected.text, /no program was generated \(wrapper_rejected: no_wire_declaration\)/);
});

test('/show-plan before the first turn says so instead of printing an empty plan', () => {
  const { text } = runCommand({ name: 'show-plan', argument: '' }, sessionOf([]));
  assert.match(text, /no turn to show yet/);
});

test('/stats counts turns and adds up the usage the server reported', () => {
  const { text } = runCommand({ name: 'stats', argument: '' }, sessionOf([turnOf(), turnOf({ className: 'execution_error' })]));
  assert.match(text, /turns: 2/);
  assert.match(text, /tokens: 200 prompt \+ 100 completion = 300 total/);
  assert.match(text, /executed: 1 of 2/);
});

test('/export writes one JSON line per turn', () => {
  const root = mkdtempSync(join(tmpdir(), 'chat-export-'));
  const file = join(root, 'nested', 'session.jsonl');
  try {
    const { text } = runCommand({ name: 'export', argument: file }, sessionOf([turnOf(), turnOf({ className: 'parse_invalid', detail: 'unexpected token', answer: null })]));
    assert.match(text, /wrote 2 turn\(s\)/);
    const lines = readFileSync(file, 'utf8').trimEnd().split('\n').map((line) => JSON.parse(line));
    assert.equal(lines.length, 2);
    assert.equal(lines[0].class, 'executed');
    assert.equal(lines[0].answer, '7');
    assert.equal(lines[0].program, PROGRAM);
    assert.equal(lines[1].class, 'parse_invalid');
    assert.equal(lines[1].divergence, 'invalid_syntax');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('/export without a path and without turns is refused', () => {
  assert.match(runCommand({ name: 'export', argument: '' }, sessionOf([])).text, /needs a path/);
  assert.match(runCommand({ name: 'export', argument: '/tmp/x.jsonl' }, sessionOf([])).text, /no turn to export yet/);
});

test('the divergence names of the turn classes match the diagnostic vocabulary', () => {
  assert.equal(divergenceOf('generation_transport_error'), 'no_completion');
  assert.equal(divergenceOf('wrapper_rejected'), 'wrapper_rejected');
  assert.equal(divergenceOf('parse_invalid'), 'invalid_syntax');
  assert.equal(divergenceOf('execution_error'), 'runtime_failure');
  assert.equal(divergenceOf('executed'), 'none');
});

test('the interactive loop answers commands locally and sends only questions to the model', async () => {
  // The defect this pins: a `/command` that reaches the model costs a turn, a
  // generation, and tokens, and the owner has to guess the command names.
  let completions = 0;
  const server = createServer((request, response) => {
    if (request.method === 'GET' && request.url === '/health') {
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end('{"status":"ok"}');
      return;
    }
    if (request.method === 'POST' && request.url === '/v1/chat/completions') {
      completions += 1;
      request.resume();
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(JSON.stringify({
        choices: [{ message: { role: 'assistant', content: PROGRAM }, finish_reason: 'stop' }],
        usage: { prompt_tokens: 11, completion_tokens: 22, total_tokens: 33 }
      }));
      return;
    }
    response.writeHead(404).end();
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const root = mkdtempSync(join(tmpdir(), 'chat-cli-'));
  const transcript = join(root, 'session.jsonl');
  try {
    const child = spawn(process.execPath, ['evaluation/chat.mjs', '--base', `http://127.0.0.1:${server.address().port}`, '--no-1.5b'], {
      cwd: REPOSITORY_ROOT,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    let stdout = '';
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    const exited = once(child, 'exit', { signal: AbortSignal.timeout(30_000) });
    child.stdin.end([
      '/help',
      '/model',
      'What is 7 equal to?',
      '/show-plan',
      '/stats',
      `/export ${transcript}`,
      '/exit'
    ].join('\n') + '\n');
    const [code] = await exited;
    child.stdout.destroy();

    assert.equal(code, 0);
    assert.equal(completions, 1, 'only the question is sent to the model');
    for (const command of COMMANDS) assert.ok(stdout.includes(command.usage), `${command.usage} is missing from the printed /help`);
    assert.ok(stdout.includes('✔ 7'), `the answer line must state the executed answer: ${stdout.slice(-300)}`);
    assert.ok(stdout.includes('wires: @slots literal, @answer jsEval'));
    assert.ok(stdout.includes('executed: yes'));
    assert.match(stdout, /turns: 1/, 'six command lines and one question must count as one turn');
    assert.match(stdout, /tokens: 11 prompt \+ 22 completion = 33 total/);
    const exported = readFileSync(transcript, 'utf8').trimEnd().split('\n').map((line) => JSON.parse(line));
    assert.equal(exported.length, 1);
    assert.equal(exported[0].question, 'What is 7 equal to?');
    assert.equal(exported[0].answer, '7');
  } finally {
    await new Promise((resolve) => server.close(resolve));
    rmSync(root, { recursive: true, force: true });
  }
});

test('/use-both toggles the comparison, and an explicit argument sets it', () => {
  // The comparison state lives on the session, so the command must only touch it and
  // must never be sent to a model: a command that leaked into a question would be
  // counted as an evaluation turn and would cost the very tokens the toggle is about.
  const session = {
    artifact: { experiment: 'exp-x', winner: null, gguf: '/tmp/exp-x.gguf' },
    base: 'http://127.0.0.1:8087',
    alias: 'exp-x',
    turns: [],
    compare: { enabled: false, state: 'ready', base: 'http://127.0.0.1:8088', alias: 'base-f16', managed: null, detail: null }
  };
  const run = (argument) => runCommand({ name: 'use-both', argument }, session);

  // A bare toggle flips, so the owner can reach for one word.
  assert.equal(session.compare.enabled, false);
  assert.match(run('').text, /comparison on/);
  assert.equal(session.compare.enabled, true);
  assert.match(run('').text, /comparison off/);
  assert.equal(session.compare.enabled, false);

  // An explicit argument sets the state rather than flipping it.
  assert.match(run('true').text, /comparison on/);
  assert.equal(session.compare.enabled, true);
  assert.match(run('true').text, /comparison on/);
  assert.equal(session.compare.enabled, true, 'true twice must not turn it off');
  assert.match(run('false').text, /comparison off/);
  assert.equal(session.compare.enabled, false);

  // Anything else is refused and changes nothing.
  assert.match(run('maybe').text, /takes true or false/);
  assert.equal(session.compare.enabled, false);

  // It is a command, so the decoder must claim it before it can be a question.
  assert.deepEqual(decodeLine('/use-both true'), { kind: 'command', name: 'use-both', argument: 'true' });
});

test('/use-both reports the base model state instead of promising a comparison it cannot run', () => {
  const makeSession = (state, detail) => ({
    artifact: { experiment: 'exp-x', winner: null, gguf: '/tmp/exp-x.gguf' },
    base: 'http://127.0.0.1:8087',
    alias: 'exp-x',
    turns: [],
    compare: { enabled: false, state, base: null, alias: null, managed: null, detail }
  });
  // Still starting: the next question waits for it, and the command says so.
  const idle = makeSession('idle', null);
  assert.match(runCommand({ name: 'use-both', argument: 'true' }, idle).text, /starting/);
  // Failed: the reason is reported, so a broken base artifact is visible at once.
  const failed = makeSession('failed', 'the base artifact is missing at training/checkpoints/base-f16.gguf');
  assert.match(runCommand({ name: 'use-both', argument: 'true' }, failed).text, /base artifact is missing/);
});

test('each model is asked in the mode it was trained for', () => {
  // The defect this pins: sending the recorded compilation profile to the untuned base
  // model asks a model that never saw SOP Lang to emit SOP Lang, and it answers by
  // imitating the profile's vocabulary with an invented grammar. The two models answer
  // the same question their own way, and each request must say which way that is.
  const requests = [];
  const server = createServer((request, response) => {
    if (request.method === 'GET' && (request.url === '/health' || request.url === '/v1/models')) {
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(request.url === '/health' ? '{"status":"ok"}' : `{"models":[{"name":"${aliasFor(BASE_GGUF)}"}]}`);
      return;
    }
    if (request.method === 'POST' && request.url === '/v1/chat/completions') {
      let body = '';
      request.on('data', (chunk) => { body += String(chunk); });
      request.on('end', () => {
        requests.push(JSON.parse(body));
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ choices: [{ message: { role: 'assistant', content: '7' } }], usage: { completion_tokens: 1, prompt_tokens: 10 } }));
      });
      return;
    }
    response.writeHead(404);
    response.end();
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      // The comparison looks for the base model on `--port + 1`, so this session names
      // the fake server's port as the base and one below it as its own, and both roles
      // are answered by the same fake.
      const child = spawn(process.execPath, [
        'evaluation/chat.mjs',
        '--base', `http://127.0.0.1:${port}`,
        '--port', String(port - 1),
        '--no-1.5b',
        '--once', 'How many cookies are left?'
      ], { encoding: 'utf8' });
      let stdout = '';
      child.stdout.on('data', (chunk) => { stdout += String(chunk); });
      child.on('close', () => {
        server.close();
        // The student's request carries the recorded profile; the base model's carries a
        // plain instruction to answer. Both ask the same question.
        const student = requests.find((r) => String(r.messages[0].content).includes('SOP Lang'));
        const base = requests.find((r) => !String(r.messages[0].content).includes('SOP Lang'));
        assert.ok(student !== undefined, 'the fine-tuned model must be asked with the SOP Lang profile');
        assert.ok(base !== undefined, 'the base model must be asked to answer, not to compile');
        assert.match(String(base.messages[0].content), /answer/i);
        for (const request of requests) {
          assert.equal(request.messages.at(-1).content, 'How many cookies are left?');
        }
        // And the output must say which answer came from which model.
        assert.ok(stdout.includes('ORIGINAL MODEL (untrained)') && stdout.includes('FINE-TUNED MODEL'),
          `both blocks must be labelled: ${stdout.slice(-400)}`);
        resolve();
      });
    });
  });
});

test('a port occupied by a different model is never silently reused', () => {
  // The defect this pins: running --gguf <new> on the default port while a leftover
  // server held the OLD model answered with the old model, and the owner had no way to
  // see it. The contract now: the CLI reports the mismatch and either reclaims the port
  // (a real leftover llama-server) or fails loudly, never answers from the wrong model.
  const server = createServer((request, response) => {
    if (request.method === 'GET' && request.url === '/health') {
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end('{"status":"ok"}');
      return;
    }
    if (request.method === 'GET' && request.url === '/v1/models') {
      response.writeHead(200, { 'content-type': 'application/json' });
      // A model the caller did not ask for.
      response.end('{"models":[{"name":"student-other"}]}');
      return;
    }
    response.writeHead(404);
    response.end();
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      const child = spawn(process.execPath, [
        'evaluation/chat.mjs',
        '--gguf', 'evaluation/registry/exp-011-compositions/gguf/checkpoint-630.gguf',
        '--port', String(port),
        '--single',
        '--once', 'How many r in raspberry?'
      ], { encoding: 'utf8' });
      let stdout = '';
      child.stdout.on('data', (chunk) => { stdout += String(chunk); });
      child.stderr.on('data', (chunk) => { stdout += String(chunk); });
      child.on('close', () => {
        server.close();
        // This fake is not a llama-server process, so the reclaim cannot stop it and the
        // CLI must fail loudly rather than answer from "student-other".
        assert.ok(stdout.includes('serves "student-other"'), `the mismatch must be named: ${stdout.slice(-400)}`);
        assert.ok(stdout.includes('still occupied') || stdout.includes('stopping the leftover'),
          `the CLI must not answer from the wrong model: ${stdout.slice(-400)}`);
        resolve();
      });
    });
  });
});
