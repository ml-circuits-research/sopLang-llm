import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findValueReferences, findValueNames, findInstructionNames } from '../runtime/dependencies.mjs';

test('finds a value reference in code position', () => {
  assert.deepEqual(findValueNames('return $rows.length;'), ['rows']);
});

test('finds references in order without duplicates', () => {
  assert.deepEqual(findValueNames('return $a + $b + $a;'), ['a', 'b']);
});

test('ignores a value reference inside a double-quoted literal', () => {
  assert.deepEqual(findValueNames('return "$rows";'), []);
});

test('ignores a value reference inside a single-quoted literal', () => {
  assert.deepEqual(findValueNames("return '$rows';"), []);
});

test('ignores a value reference inside a line comment', () => {
  assert.deepEqual(findValueNames('// $rows is not a dependency\nreturn 1;'), []);
});

test('ignores a value reference inside a block comment', () => {
  assert.deepEqual(findValueNames('/* $rows */\nreturn 1;'), []);
});

test('finds a reference in a template interpolation', () => {
  assert.deepEqual(findValueNames('return `count ${$rows.length}`;'), ['rows']);
});

test('ignores text that looks like a reference inside a template literal', () => {
  assert.deepEqual(findValueNames('return `literal $rows text`;'), []);
});

test('handles nested template interpolations with literals', () => {
  assert.deepEqual(findValueNames('return `${"$a"} and ${$b}`;'), ['b']);
});

test('handles an escaped dollar sign', () => {
  assert.deepEqual(findValueNames('return "\\$rows" + $real;'), ['real']);
});

test('does not treat a bare dollar as a dependency but accepts underscores', () => {
  assert.deepEqual(findValueNames('return $ + $_x;'), ['_x']);
});

test('records the offset of the first occurrence', () => {
  const references = findValueReferences('return $rows.map(x => x + $total);');
  assert.deepEqual(
    references.map((reference) => reference.name),
    ['rows', 'total']
  );
  assert.equal(references[0].offset, 'return '.length);
});

test('handles a reference after an unterminated-looking comment-like string', () => {
  assert.deepEqual(findValueNames('return "// $nothere" + $real;'), ['real']);
});

test('handles braces inside a template interpolation', () => {
  assert.deepEqual(findValueNames('return `${ { a: $b }.a }`;'), ['b']);
});

test('ignores a value reference inside a regular expression literal', () => {
  assert.deepEqual(findValueNames('const re = /$ghost/;\nreturn $real;'), ['real']);
  assert.deepEqual(findValueNames('return /[$]ghost/.test($text);'), ['text']);
});

test('ignores a value reference in property position', () => {
  assert.deepEqual(findValueNames('return obj.$price + $real;'), ['real']);
  assert.deepEqual(findValueNames('return obj?.$price;'), []);
});

test('treats a literal object key as data and a shorthand key as a reference', () => {
  // Literal key position: `$price` names the property, it reads no wire.
  assert.deepEqual(findValueNames('const o = { $price: 7 };\nreturn o.$price;'), []);
  assert.deepEqual(findValueNames('return { a: 1, $total: 2 };'), []);
  // Shorthand position: `$price` is a reference to the parameter.
  assert.deepEqual(findValueNames('return { $price };'), ['price']);
  assert.deepEqual(findValueNames('const merged = { a, $price };\nreturn merged;'), ['price']);
});

test('a literal object-key body runs instead of reporting unresolved dependencies', async () => {
  const { createRuntime } = await import('../runtime/kernel.mjs');
  const result = await createRuntime().run(
    '@out jsEval\nconst o = { $price: 7 };\nreturn o.$price + 1;',
    { outputs: ['out'] }
  );
  assert.equal(result.status, 'completed');
  assert.equal(result.outputs.out, 8);
});

test('finds a value reference in a spread expression', () => {
  assert.deepEqual(findValueNames('const sorted = [...$values].sort();'), ['values']);
  assert.deepEqual(findValueNames('return { ...$defaults, extra: 1 };'), ['defaults']);
});

test('does not treat division as a regular expression literal', () => {
  assert.deepEqual(findValueNames('const ratio = $a / $b;'), ['a', 'b']);
});

test('finds references in both branches around a regular expression literal', () => {
  assert.deepEqual(findValueNames('if ($a > 0) { return /x/.test($b); }'), ['a', 'b']);
});

test('does not split a longer identifier that ends in a reference shape', () => {
  assert.deepEqual(findValueNames('return foo$bar;'), []);
});

test('reads instruction text without hiding references behind apostrophes', () => {
  assert.deepEqual(findInstructionNames("What's $x?"), ['x']);
  assert.deepEqual(findInstructionNames('Judge if $a and $b are equal.'), ['a', 'b']);
  assert.deepEqual(findInstructionNames('Use \\$literal dollar signs.'), []);
  assert.deepEqual(findInstructionNames('The cost was 5$ and $9 in total.'), []);
});

test('an instruction dependency reaches the model instead of being dropped', async () => {
  const { createRuntime } = await import('../runtime/kernel.mjs');
  let received = null;
  const result = await createRuntime().run("@verdict modelCall\nWhat's $x?", {
    inputs: { x: 42 },
    outputs: ['verdict'],
    models: {
      modelCall: async ({ values }) => {
        received = values;
        return 'answered';
      }
    }
  });
  assert.equal(result.status, 'completed');
  assert.equal(received.x, 42);
});
