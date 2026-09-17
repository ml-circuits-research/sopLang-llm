import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRuntime } from '../runtime/kernel.mjs';
import { ContainerStore } from '../runtime/containers.mjs';
import { SCHEMA_PROFILE, analyzeSchemaSupport, assertSchemaSupported, validateValueAgainstSchema } from '../runtime/schema.mjs';

test('additionalProperties false rejects an unexpected field', () => {
  const result = validateValueAgainstSchema({ unexpected: 1 }, { type: 'object', additionalProperties: false });
  assert.equal(result.ok, false);
  assert.equal(result.message.includes('unexpected field'), true);
});

test('additionalProperties false without properties rejects every field', () => {
  const result = validateValueAgainstSchema({ any: 1 }, { type: 'object', additionalProperties: false });
  assert.equal(result.ok, false);
});

test('a number below the declared minimum is rejected', () => {
  const result = validateValueAgainstSchema(2, { type: 'number', minimum: 3 });
  assert.equal(result.ok, false);
  assert.equal(result.message.includes('below minimum'), true);
});

test('a false schema accepts nothing and a true schema accepts everything', () => {
  assert.equal(validateValueAgainstSchema(1, false).ok, false);
  assert.equal(validateValueAgainstSchema({ anything: true }, true).ok, true);
});

test('supported constraints are enforced for records and outputs', async () => {
  const schema = {
    type: 'object',
    required: ['id', 'confidence'],
    additionalProperties: false,
    properties: {
      id: { type: 'string', pattern: '^k[0-9]+$' },
      confidence: { type: 'number', minimum: 0, maximum: 1 },
      tags: { type: 'array', items: { type: 'string' }, maxItems: 2, uniqueItems: true }
    }
  };
  assert.equal(validateValueAgainstSchema({ id: 'k1', confidence: 0.5, tags: ['a'] }, schema).ok, true);
  assert.equal(validateValueAgainstSchema({ id: 'x1', confidence: 0.5 }, schema).ok, false);
  assert.equal(validateValueAgainstSchema({ id: 'k1', confidence: 2 }, schema).ok, false);
  assert.equal(validateValueAgainstSchema({ id: 'k1', confidence: 0.5, tags: ['a', 'a'] }, schema).ok, false);
  assert.equal(validateValueAgainstSchema({ id: 'k1', confidence: 0.5, extra: 1 }, schema).ok, false);

  const accepted = await createRuntime().run(
    '@claims container\nkind: table\nprimaryKey: id\nschema:\n  type: object\n  required: [id]\n  additionalProperties: false\n  properties:\n    id: { type: string }\n\n@add containerAdd\ntarget: claims\nitems:\n  - id: k1\n    extra: 1',
    { outputs: ['claims'] }
  );
  assert.equal(accepted.status, 'failed');
  assert.equal(accepted.code, 'validation_error');
});

test('an unsupported keyword is reported instead of being ignored', () => {
  const analysis = analyzeSchemaSupport({ type: 'object', $ref: '#/definitions/x' });
  assert.equal(analysis.ok, false);
  assert.equal(analysis.code, 'unsupported_schema');
  assert.equal(analysis.message.includes('$ref'), true);
  assert.throws(() => assertSchemaSupported({ format: 'date-time' }), { code: 'unsupported_schema' });
});

test('an unsupported type name or malformed constraint fails closed', () => {
  assert.equal(validateValueAgainstSchema('x', { type: 'text' }).code, 'unsupported_schema');
  assert.equal(validateValueAgainstSchema(1, { minimum: 'three' }).code, 'unsupported_schema');
  assert.equal(validateValueAgainstSchema([1], { items: [{ type: 'number' }] }).code, 'unsupported_schema');
});

test('an unsupported container schema is rejected before data is accepted', () => {
  const store = new ContainerStore();
  assert.throws(() => store.declare('claims', { kind: 'table', schema: { type: 'object', if: { type: 'string' } } }), {
    code: 'unsupported_schema'
  });
});

test('an unsupported output schema fails before the circuit runs', async () => {
  const result = await createRuntime().run('@output jsEval\nreturn 1;', {
    outputSchema: { type: 'object', dependencies: { a: ['b'] } }
  });
  assert.equal(result.status, 'failed');
  assert.equal(result.code, 'unsupported_schema');
  assert.equal(result.epochs, 0);
});

test('combinators and multipleOf are enforced', () => {
  assert.equal(validateValueAgainstSchema(6, { allOf: [{ type: 'number' }, { multipleOf: 3 }] }).ok, true);
  assert.equal(validateValueAgainstSchema(5, { allOf: [{ type: 'number' }, { multipleOf: 3 }] }).ok, false);
  assert.equal(validateValueAgainstSchema(5, { anyOf: [{ type: 'string' }, { type: 'number' }] }).ok, true);
  assert.equal(validateValueAgainstSchema(true, { anyOf: [{ type: 'string' }, { type: 'number' }] }).ok, false);
  assert.equal(validateValueAgainstSchema(5, { oneOf: [{ type: 'number' }, { type: 'integer' }] }).ok, false);
  assert.equal(validateValueAgainstSchema('x', { not: { type: 'string' } }).ok, false);
});

test('the published profile names the supported keywords', () => {
  assert.equal(SCHEMA_PROFILE.name, 'soplang-json-schema');
  assert.equal(SCHEMA_PROFILE.constraints.includes('additionalProperties'), true);
  assert.equal(SCHEMA_PROFILE.constraints.includes('$ref'), false);
});
