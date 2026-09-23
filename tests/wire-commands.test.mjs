/**
 * The declarative wire commands: `graphPath`, `aggregate`, and `fraction`.
 *
 * Each command owns an operation-specific contract that the generated circuit
 * previously re-asserted with its own JavaScript and probes. These tests pin
 * the contract the way the dataset depends on it: a valid body executes to the
 * value the old transcription computed, a malformed body fails validation
 * before execution, and a bad runtime value fails as a structured
 * `execution_error` naming the contract clause, which is the class of mistake
 * the command makes impossible.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { createRuntime } from '../runtime/kernel.mjs';

function runtime() {
  return createRuntime();
}

function code(result) {
  return result.status === 'completed' ? 'completed' : result.code;
}

function slotsProgram(body) {
  return `@slots literal\n${body}\n\n`;
}

test('graphPath answers reachability with yes or no over an undirected edge list', async () => {
  const source = slotsProgram(JSON.stringify({ edges: [[12, 15], [15, 8], [8, 3]], from: 12, target: 3 })) +
    '@reach graphPath\nfrom: $slots.from\nto: $slots.target\nedges: $slots.edges\n';
  const reached = await runtime().run(source, { outputs: ['reach'] });
  assert.equal(code(reached), 'completed');
  assert.equal(reached.outputs.reach, 'yes');

  const apart = slotsProgram(JSON.stringify({ edges: [[12, 15], [8, 3]], from: 12, target: 3 })) +
    '@reach graphPath\nfrom: $slots.from\nto: $slots.target\nedges: $slots.edges\n';
  const noPath = await runtime().run(apart, { outputs: ['reach'] });
  assert.equal(noPath.outputs.reach, 'no');
});

test('graphPath counts the degree of a start node', async () => {
  const source = slotsProgram(JSON.stringify({ edges: [[12, 15], [15, 8], [15, 3]], node: 15 })) +
    '@degree graphPath\nfrom: $slots.node\nedges: $slots.edges\ncount: true\n';
  const result = await runtime().run(source, { outputs: ['degree'] });
  assert.equal(code(result), 'completed');
  assert.equal(result.outputs.degree, 3);
});

test('graphPath reads the start and target nodes from a prior wire', async () => {
  const source = slotsProgram(JSON.stringify({ edges: [[1, 2], [2, 3], [3, 4]], target: 4 })) +
    '@largest jsEval\nreturn 1;\n\n' +
    '@reach graphPath\nfrom: $largest\nto: $slots.target\nedges: $slots.edges\n';
  const result = await runtime().run(source, { outputs: ['reach'] });
  assert.equal(result.outputs.reach, 'yes');
});

test('graphPath rejects a body that names neither to nor count', async () => {
  const source = slotsProgram(JSON.stringify({ edges: [[1, 2]], from: 1 })) +
    '@bad graphPath\nfrom: $slots.from\nedges: $slots.edges\n';
  const result = await runtime().run(source, { outputs: ['bad'] });
  assert.equal(result.code, 'validation_error');
});

test('graphPath rejects a start node absent from the edges', async () => {
  const source = slotsProgram(JSON.stringify({ edges: [[1, 2]], from: 7 })) +
    '@degree graphPath\nfrom: $slots.from\nedges: $slots.edges\ncount: true\n';
  const result = await runtime().run(source, { outputs: ['degree'] });
  assert.equal(result.code, 'execution_error');
  assert.equal(result.error.details.contract, 'start_present');
});

test('graphPath rejects a target node absent from the edges and a start equal to the target', async () => {
  const absent = slotsProgram(JSON.stringify({ edges: [[1, 2]], from: 1, target: 9 })) +
    '@reach graphPath\nfrom: $slots.from\nto: $slots.target\nedges: $slots.edges\n';
  const absentResult = await runtime().run(absent, { outputs: ['reach'] });
  assert.equal(absentResult.code, 'execution_error');
  assert.equal(absentResult.error.details.contract, 'target_present');

  const same = slotsProgram(JSON.stringify({ edges: [[1, 2]], from: 1, target: 1 })) +
    '@reach graphPath\nfrom: $slots.from\nto: $slots.target\nedges: $slots.edges\n';
  const sameResult = await runtime().run(same, { outputs: ['reach'] });
  assert.equal(sameResult.code, 'execution_error');
  assert.equal(sameResult.error.details.contract, 'distinct_nodes');
});

test('graphPath rejects an edge list whose entries are not pairs', async () => {
  const source = slotsProgram(JSON.stringify({ edges: [[1, 2, 3]], from: 1 })) +
    '@degree graphPath\nfrom: $slots.from\nedges: $slots.edges\ncount: true\n';
  const result = await runtime().run(source, { outputs: ['degree'] });
  assert.equal(result.code, 'execution_error');
  assert.equal(result.error.details.contract, 'edge_pairs');
});

test('aggregate filters by a threshold and reduces to each scalar', async () => {
  const slots = JSON.stringify({ values: [4, 9, 12, 2, 18], threshold: 6 });
  const run = (op) => runtime().run(
    slotsProgram(slots) +
    `@out aggregate\nsource: $slots.values\nop: ${op}\npredicate:\n  above: $slots.threshold\n`,
    { outputs: ['out'] }
  );
  assert.equal((await run('sum')).outputs.out, 39);
  assert.equal((await run('count')).outputs.out, 3);
  assert.equal((await run('min')).outputs.out, 9);
  assert.equal((await run('max')).outputs.out, 18);
  assert.equal((await run('average')).outputs.out, 13);
});

test('aggregate reduces an empty kept list to zero for sum and count and rejects it for min, max, and average', async () => {
  const slots = JSON.stringify({ values: [1, 2, 3], threshold: 100 });
  const run = (op) => runtime().run(
    slotsProgram(slots) +
    `@out aggregate\nsource: $slots.values\nop: ${op}\npredicate:\n  above: $slots.threshold\n`,
    { outputs: ['out'] }
  );
  assert.equal((await run('sum')).outputs.out, 0);
  assert.equal((await run('count')).outputs.out, 0);
  for (const op of ['min', 'max', 'average']) {
    const result = await run(op);
    assert.equal(result.code, 'execution_error', `${op} on an empty kept list must fail`);
    assert.equal(result.error.details.contract, 'non_empty_kept');
  }
});

test('aggregate supports the atLeast and divisibleBy predicates', async () => {
  const atLeast = slotsProgram(JSON.stringify({ values: [5, 10, 15], minimum: 10 })) +
    '@out aggregate\nsource: $slots.values\nop: sum\npredicate:\n  atLeast: $slots.minimum\n';
  assert.equal((await runtime().run(atLeast, { outputs: ['out'] })).outputs.out, 25);

  const divisible = slotsProgram(JSON.stringify({ values: [1, 2, 3, 4, 6], divisor: 3 })) +
    '@out aggregate\nsource: $slots.values\nop: count\npredicate:\n  divisibleBy: $slots.divisor\n';
  assert.equal((await runtime().run(divisible, { outputs: ['out'] })).outputs.out, 2);
});

test('aggregate selects a field from record elements', async () => {
  const source = slotsProgram(JSON.stringify({ rows: [{ amount: 5 }, { amount: 15 }], threshold: 10 })) +
    '@out aggregate\nsource: $slots.rows\nop: sum\nfield: amount\npredicate:\n  above: $slots.threshold\n';
  const result = await runtime().run(source, { outputs: ['out'] });
  assert.equal(result.outputs.out, 15);
});

test('aggregate rejects an unknown operation and a malformed predicate before execution', async () => {
  const unknown = slotsProgram(JSON.stringify({ values: [1] })) +
    '@out aggregate\nsource: $slots.values\nop: median\n';
  const unknownResult = await runtime().run(unknown, { outputs: ['out'] });
  assert.equal(unknownResult.code, 'validation_error');

  const malformed = slotsProgram(JSON.stringify({ values: [1], threshold: 0 })) +
    '@out aggregate\nsource: $slots.values\nop: sum\npredicate:\n  above: $slots.threshold\n  atLeast: $slots.threshold\n';
  const malformedResult = await runtime().run(malformed, { outputs: ['out'] });
  assert.equal(malformedResult.code, 'validation_error');
});

test('fraction reduces a divisibility count over a list to a reduced fraction or a whole number', async () => {
  const reduced = slotsProgram(JSON.stringify({ divisor: 2 })) +
    '@kept jsEval\nreturn [2, 4, 6, 8, 3, 5];\n\n' +
    '@chance fraction\nsource: $kept\ndivisibleBy: $slots.divisor\n';
  const reducedResult = await runtime().run(reduced, { outputs: ['chance'] });
  assert.equal(reducedResult.outputs.chance, '2/3');

  const whole = slotsProgram(JSON.stringify({ divisor: 2 })) +
    '@kept jsEval\nreturn [2, 4, 6, 8];\n\n' +
    '@chance fraction\nsource: $kept\ndivisibleBy: $slots.divisor\n';
  const wholeResult = await runtime().run(whole, { outputs: ['chance'] });
  assert.equal(wholeResult.outputs.chance, '1');
});

test('fraction reduces a stated numerator and denominator', async () => {
  const source = slotsProgram(JSON.stringify({ favourable: 2, total: 8 })) +
    '@chance fraction\nnumerator: $slots.favourable\ndenominator: $slots.total\n';
  const result = await runtime().run(source, { outputs: ['chance'] });
  assert.equal(result.outputs.chance, '1/4');
});

test('fraction rejects a zero denominator, a negative favourable count, and a favourable count above the total', async () => {
  const run = (slots) => runtime().run(
    slotsProgram(JSON.stringify(slots)) +
    '@chance fraction\nnumerator: $slots.favourable\ndenominator: $slots.total\n',
    { outputs: ['chance'] }
  );
  const zero = await run({ favourable: 1, total: 0 });
  assert.equal(zero.code, 'execution_error');
  assert.equal(zero.error.details.contract, 'positive_total');

  const negative = await run({ favourable: -1, total: 5 });
  assert.equal(negative.code, 'execution_error');
  assert.equal(negative.error.details.contract, 'whole_favourable');

  const above = await run({ favourable: 6, total: 5 });
  assert.equal(above.code, 'execution_error');
  assert.equal(above.error.details.contract, 'favourable_within_total');
});

test('fraction rejects a body that declares neither form and a non-positive divisor', async () => {
  const neither = slotsProgram(JSON.stringify({})) +
    '@chance fraction\nnumerator: $slots.favourable\n';
  const neitherResult = await runtime().run(neither, { outputs: ['chance'] });
  assert.equal(neitherResult.code, 'validation_error');

  const badDivisor = slotsProgram(JSON.stringify({ divisor: 0 })) +
    '@kept jsEval\nreturn [2, 4];\n\n' +
    '@chance fraction\nsource: $kept\ndivisibleBy: $slots.divisor\n';
  const badDivisorResult = await runtime().run(badDivisor, { outputs: ['chance'] });
  assert.equal(badDivisorResult.code, 'execution_error');
  assert.equal(badDivisorResult.error.details.contract, 'positive_divisor');
});
