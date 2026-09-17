import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseProfile } from '../runtime/profile.mjs';
import { createRegistry, CommandRegistry } from '../runtime/registry.mjs';
import { createStandardCommands, standardCommands } from '../wires/standard/index.mjs';

test('reads a flat mapping', () => {
  assert.deepEqual(parseProfile('target: events\noperation: add'), { target: 'events', operation: 'add' });
});

test('reads scalars of each supported type', () => {
  const profile = parseProfile('a: 1\nb: 1.5\nc: true\nd: false\ne: null\nf: text\ng: "quoted"');
  assert.deepEqual(profile, { a: 1, b: 1.5, c: true, d: false, e: null, f: 'text', g: 'quoted' });
});

test('reads a nested mapping', () => {
  const profile = parseProfile('kind: table\nschema:\n  type: object\n  required: [id]');
  assert.deepEqual(profile.schema, { type: 'object', required: ['id'] });
});

test('reads a sequence of scalars', () => {
  const profile = parseProfile('actors:\n  - c1\n  - c2');
  assert.deepEqual(profile.actors, ['c1', 'c2']);
});

test('reads a sequence of mappings', () => {
  const profile = parseProfile(
    ['items:', '  - id: e1', '    name: first', '  - id: e2', '    name: second'].join('\n')
  );
  assert.deepEqual(profile.items, [
    { id: 'e1', name: 'first' },
    { id: 'e2', name: 'second' }
  ]);
});

test('reads flow mappings and flow sequences', () => {
  const profile = parseProfile('span: { sourceId: bookA, start: 830, end: 1011 }\nactors: [a, b, c]');
  assert.deepEqual(profile.span, { sourceId: 'bookA', start: 830, end: 1011 });
  assert.deepEqual(profile.actors, ['a', 'b', 'c']);
});

test('reads a raw code block for a predicate body', () => {
  const profile = parseProfile('source: $claims\npredicate:\n  return row.confidence >= 0.8;');
  assert.equal(profile.predicate, 'return row.confidence >= 0.8;');
});

test('reads multiple statements in a raw block', () => {
  const profile = parseProfile(
    ['source: $claims', 'predicate:', '  const limit = 0.5;', '  return row.score > limit;'].join('\n')
  );
  assert.equal(profile.predicate, 'const limit = 0.5;\nreturn row.score > limit;');
});

test('ignores comment lines and blank lines', () => {
  const profile = parseProfile('# a comment\ntarget: events\n\noperation: add');
  assert.deepEqual(profile, { target: 'events', operation: 'add' });
});

test('reads a value that references a wire', () => {
  const profile = parseProfile('target: events\nitems: $rows');
  assert.equal(profile.items, '$rows');
});

test('rejects unexpected indentation', () => {
  assert.throws(() => parseProfile('a: 1\n  b: 2'), { code: 'parse_error' });
});

test('rejects an unterminated flow sequence', () => {
  assert.throws(() => parseProfile('a: [1, 2'), { code: 'parse_error' });
});

test('the standard vocabulary registers every reference-profile command', () => {
  const registry = createRegistry(createStandardCommands());
  assert.deepEqual(registry.names(), [
    'container',
    'containerAdd',
    'containerFilter',
    'containerRemove',
    'containerUpsert',
    'input',
    'jsEval',
    'literal',
    'modelCall'
  ]);
});

test('the registry rejects a duplicate name when replace is false', () => {
  const registry = new CommandRegistry();
  const command = {
    name: 'demo',
    version: '1.0.0',
    effectClass: 'pure',
    analyze: () => ({ values: [] }),
    execute: async () => 1
  };
  registry.register(command);
  assert.throws(() => registry.register(command, { replace: false }), { code: 'validation_error' });
});

test('the registry requires an analyze function', () => {
  const registry = new CommandRegistry();
  assert.throws(
    () => registry.register({ name: 'demo', execute: async () => 1 }),
    { code: 'validation_error' }
  );
});

test('every standard command carries a model-visible manifest', () => {
  for (const command of standardCommands) {
    assert.equal(typeof command.manifest.name, 'string', `${command.name} manifest name`);
    assert.equal(typeof command.manifest.summary, 'string', `${command.name} manifest summary`);
    assert.equal(command.manifest.whenToUse.length > 0, true, `${command.name} whenToUse`);
    assert.equal(Array.isArray(command.mayStage || []), true);
  }
});

test('the registry exposes manifests for a capability catalog', () => {
  const registry = createRegistry(createStandardCommands());
  const names = registry.manifests().map((manifest) => manifest.name);
  assert.ok(names.includes('jsEval'));
  assert.ok(names.includes('containerFilter'));
});

test('a command may be registered by an installer and resolved by name', async () => {
  const registry = createRegistry(createStandardCommands());
  registry.register({
    name: 'text.paraphrase',
    version: '1.0.0',
    effectClass: 'neural',
    manifest: { name: 'text.paraphrase', summary: 'Rewrite text.', whenToUse: 'wording change' },
    analyze: () => ({ values: [] }),
    validate: () => ({ ok: true }),
    async execute() {
      return 'rewritten';
    }
  });
  assert.equal(registry.has('text.paraphrase'), true);
  assert.equal(registry.require('text.paraphrase').manifest.summary, 'Rewrite text.');
});
