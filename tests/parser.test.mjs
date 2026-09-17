import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCircuit, serializeCircuit, escapeBody } from '../runtime/parser.mjs';

test('parses a minimal program into ordered wires', () => {
  const program = parseCircuit('@selected jsEval\nreturn 1;\n\n@output jsEval\nreturn 2;');
  assert.deepEqual(
    program.wires.map((wire) => [wire.name, wire.command]),
    [
      ['selected', 'jsEval'],
      ['output', 'jsEval']
    ]
  );
});

test('a body extends until the next declaration at column one', () => {
  const program = parseCircuit('@a jsEval\nline one\nline two\n\n@b jsEval\nreturn 1;');
  assert.equal(program.wires[0].body, 'line one\nline two');
  assert.equal(program.wires[1].body, 'return 1;');
});

test('an indented @ inside a body does not start a wire', () => {
  const program = parseCircuit('@a jsEval\n  @not-a-wire jsEval\nreturn 1;');
  assert.equal(program.wires.length, 1);
  assert.equal(program.wires[0].body, '  @not-a-wire jsEval\nreturn 1;');
});

test('an escaped declaration becomes a literal @ line in the body', () => {
  const program = parseCircuit('@a jsEval\n\\@b jsEval\nreturn 1;');
  assert.equal(program.wires[0].body, '@b jsEval\nreturn 1;');
});

test('rejects a malformed declaration', () => {
  assert.throws(() => parseCircuit('@bad\nreturn 1;'), { code: 'parse_error' });
  assert.throws(() => parseCircuit('@1bad jsEval\nreturn 1;'), { code: 'parse_error' });
});

test('rejects content before the first declaration', () => {
  assert.throws(() => parseCircuit('stray line\n@a jsEval\nreturn 1;'), { code: 'parse_error' });
});

test('rejects an empty program', () => {
  assert.throws(() => parseCircuit('\n\n'), { code: 'parse_error' });
});

test('rejects duplicate wire names', () => {
  assert.throws(() => parseCircuit('@a jsEval\nreturn 1;\n@a jsEval\nreturn 2;'), { code: 'parse_error' });
});

test('rejects an escaped declaration outside a body', () => {
  assert.throws(() => parseCircuit('\\@a jsEval\nreturn 1;'), { code: 'parse_error' });
});

test('accepts arbitrary Unicode inside values', () => {
  const program = parseCircuit('@a literal\n{ "text": "世界 🌍 ✓ ø" }');
  assert.match(program.wires[0].body, /世界/);
});

test('round-trips a circuit through serialization', () => {
  const original = '@a jsEval\nreturn $b + 1;\n\n@b literal\n2';
  const parsed = parseCircuit(original);
  const serialized = serializeCircuit(parsed.wires);
  const reparsed = parseCircuit(serialized);
  assert.deepEqual(
    reparsed.wires.map((wire) => [wire.name, wire.command, wire.body]),
    parsed.wires.map((wire) => [wire.name, wire.command, wire.body])
  );
});

test('serialization escapes a body line that looks like a declaration', () => {
  const body = '@danger jsEval\nreturn 1;';
  const escaped = escapeBody(body);
  assert.equal(escaped, '\\@danger jsEval\nreturn 1;');
  const reparsed = parseCircuit(`@a jsEval\n${escaped}`);
  assert.equal(reparsed.wires[0].body, body);
});
