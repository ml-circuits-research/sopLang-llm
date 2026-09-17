/**
 * JSON Schema validation for container records and output contracts.
 *
 * The runtime validates schemas without a third-party validator, so the
 * supported profile is published and enforced fail-closed. A schema that uses a
 * keyword, a type name, or a constraint form outside the profile is rejected as
 * `unsupported_schema` before any data is accepted, instead of being silently
 * ignored.
 *
 * Supported constraint keywords: type, enum, const, required, properties,
 * patternProperties, additionalProperties, items, minItems, maxItems,
 * uniqueItems, minLength, maxLength, pattern, minimum, maximum,
 * exclusiveMinimum, exclusiveMaximum, multipleOf, minProperties, maxProperties,
 * allOf, anyOf, oneOf, not. Boolean schemas are supported: `true` accepts every
 * value and `false` accepts none.
 *
 * Annotation keywords are accepted and carry no constraint: title, description,
 * default, examples, $comment, deprecated, readOnly, writeOnly.
 *
 * A schema object is analysed once per identity and the result is cached, so
 * validating a stream of records does not repeat the structural analysis.
 * Schemas are treated as immutable once they reach the validator.
 */

import { canonicalJson } from './hashing.mjs';
import { SopError } from './errors.mjs';

export const SCHEMA_PROFILE = Object.freeze({
  name: 'soplang-json-schema',
  version: '1.0.0',
  types: Object.freeze(['string', 'number', 'integer', 'boolean', 'null', 'array', 'object']),
  constraints: Object.freeze([
    'type',
    'enum',
    'const',
    'required',
    'properties',
    'patternProperties',
    'additionalProperties',
    'items',
    'minItems',
    'maxItems',
    'uniqueItems',
    'minLength',
    'maxLength',
    'pattern',
    'minimum',
    'maximum',
    'exclusiveMinimum',
    'exclusiveMaximum',
    'multipleOf',
    'minProperties',
    'maxProperties',
    'allOf',
    'anyOf',
    'oneOf',
    'not'
  ]),
  annotations: Object.freeze(['title', 'description', 'default', 'examples', '$comment', 'deprecated', 'readOnly', 'writeOnly'])
});

const CHECKED_KEYWORDS = new Set([...SCHEMA_PROFILE.constraints, ...SCHEMA_PROFILE.annotations]);
const COUNT_KEYWORDS = Object.freeze(['minItems', 'maxItems', 'minProperties', 'maxProperties', 'minLength', 'maxLength']);
const NUMBER_KEYWORDS = Object.freeze(['minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum']);
const COMBINATOR_KEYWORDS = Object.freeze(['allOf', 'anyOf', 'oneOf']);
const supportCache = new WeakMap();

export function validateValueAgainstSchema(value, schema, path = '') {
  if (schema === null || schema === undefined) {
    return { ok: true, message: '', path };
  }
  const support = analyzeSchemaSupport(schema);
  if (!support.ok) {
    return support;
  }
  return validate(value, schema, path);
}

/**
 * Analyse a schema without a value. The runtime calls this before accepting a
 * container declaration or a declared output contract, so an unsupported
 * constraint fails before any data reaches the store.
 */
export function analyzeSchemaSupport(schema, path = '$') {
  if (schema === null || schema === undefined || typeof schema === 'boolean') {
    return { ok: true, message: '', path };
  }
  if (typeof schema !== 'object' || Array.isArray(schema)) {
    return unsupported(path, 'the schema must be an object or a boolean');
  }
  if (supportCache.has(schema)) {
    return supportCache.get(schema);
  }
  supportCache.set(schema, { ok: true, message: '', path });

  const result = analyzeSchemaObject(schema, path);
  if (result.ok) {
    supportCache.set(schema, result);
  }
  return result;
}

function analyzeSchemaObject(schema, path) {
  for (const key of Object.keys(schema)) {
    if (!CHECKED_KEYWORDS.has(key)) {
      return unsupported(path, `schema keyword "${key}" is not part of schema profile ${profileName()}`);
    }
  }

  if (schema.type !== undefined) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (types.length === 0) {
      return unsupported(path, 'the declared type list is empty');
    }
    for (const type of types) {
      if (typeof type !== 'string' || !SCHEMA_PROFILE.types.includes(type)) {
        return unsupported(path, `type "${String(type)}" is not one of ${SCHEMA_PROFILE.types.join(', ')}`);
      }
    }
  }

  if (schema.enum !== undefined && !Array.isArray(schema.enum)) {
    return unsupported(path, '"enum" must be an array');
  }
  if (schema.required !== undefined) {
    if (!Array.isArray(schema.required) || schema.required.some((field) => typeof field !== 'string')) {
      return unsupported(path, '"required" must be an array of field names');
    }
  }

  for (const key of COUNT_KEYWORDS) {
    if (schema[key] !== undefined && (!Number.isInteger(schema[key]) || schema[key] < 0)) {
      return unsupported(path, `"${key}" must be a non-negative integer`);
    }
  }
  for (const key of NUMBER_KEYWORDS) {
    if (schema[key] !== undefined && typeof schema[key] !== 'number') {
      return unsupported(path, `"${key}" must be a number`);
    }
  }
  if (schema.multipleOf !== undefined && (typeof schema.multipleOf !== 'number' || schema.multipleOf <= 0)) {
    return unsupported(path, '"multipleOf" must be a positive number');
  }
  if (schema.uniqueItems !== undefined && typeof schema.uniqueItems !== 'boolean') {
    return unsupported(path, '"uniqueItems" must be a boolean');
  }
  if (schema.pattern !== undefined && !isValidPattern(schema.pattern)) {
    return unsupported(path, `"pattern" ${JSON.stringify(String(schema.pattern))} is not a valid regular expression`);
  }
  if (Array.isArray(schema.items)) {
    return unsupported(path, 'tuple-style items are not part of schema profile ' + profileName());
  }

  for (const key of ['properties', 'patternProperties']) {
    if (schema[key] === undefined) {
      continue;
    }
    if (!isSchemaObject(schema[key])) {
      return unsupported(path, `"${key}" must be a mapping of schemas`);
    }
    for (const [field, fieldSchema] of Object.entries(schema[key])) {
      if (key === 'patternProperties' && !isValidPattern(field)) {
        return unsupported(path, `"patternProperties" key ${JSON.stringify(field)} is not a valid regular expression`);
      }
      const result = analyzeSchemaSupport(fieldSchema, path === '$' ? field : `${path}.${field}`);
      if (!result.ok) {
        return result;
      }
    }
  }

  for (const key of ['additionalProperties', 'items', 'not']) {
    if (schema[key] === undefined) {
      continue;
    }
    const result = analyzeSchemaSupport(schema[key], `${path}.${key}`);
    if (!result.ok) {
      return result;
    }
  }

  for (const key of COMBINATOR_KEYWORDS) {
    if (schema[key] === undefined) {
      continue;
    }
    if (!Array.isArray(schema[key]) || schema[key].length === 0) {
      return unsupported(path, `"${key}" must be a non-empty array of schemas`);
    }
    for (const [index, branch] of schema[key].entries()) {
      const result = analyzeSchemaSupport(branch, `${path}.${key}[${index}]`);
      if (!result.ok) {
        return result;
      }
    }
  }

  return { ok: true, message: '', path };
}

export function assertSchemaSupported(schema, { context = 'schema' } = {}) {
  const result = analyzeSchemaSupport(schema);
  if (!result.ok) {
    throw new SopError('unsupported_schema', `The ${context} is unsupported: ${result.message}`, { path: result.path });
  }
  return schema;
}

function validate(value, schema, path) {
  if (typeof schema === 'boolean') {
    if (schema) {
      return acceptance(path);
    }
    return failure('validation_error', `value at ${path || '$'} is rejected by a false schema`, path);
  }

  if (schema.type !== undefined) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((type) => matchesType(value, type))) {
      return failure('validation_error', `expected type ${types.join(' or ')} at ${path || '$'} but received ${describeType(value)}`, path);
    }
  }

  if (schema.const !== undefined && canonicalJson(schema.const) !== canonicalJson(value)) {
    return failure('validation_error', `value at ${path || '$'} does not equal the declared constant`, path);
  }

  if (schema.enum !== undefined && !schema.enum.some((candidate) => canonicalJson(candidate) === canonicalJson(value))) {
    return failure('validation_error', `value at ${path || '$'} is not in the declared enum`, path);
  }

  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      return failure('validation_error', `text at ${path || '$'} is shorter than minLength ${schema.minLength}`, path);
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      return failure('validation_error', `text at ${path || '$'} is longer than maxLength ${schema.maxLength}`, path);
    }
    if (schema.pattern !== undefined && !new RegExp(schema.pattern).test(value)) {
      return failure('validation_error', `text at ${path || '$'} does not match ${schema.pattern}`, path);
    }
  }

  if (typeof value === 'number' && !Number.isNaN(value)) {
    const bounds = [
      ['minimum', value >= schema.minimum, 'below minimum'],
      ['maximum', value <= schema.maximum, 'above maximum'],
      ['exclusiveMinimum', value > schema.exclusiveMinimum, 'not above exclusiveMinimum'],
      ['exclusiveMaximum', value < schema.exclusiveMaximum, 'not below exclusiveMaximum']
    ];
    for (const [keyword, within, description] of bounds) {
      if (schema[keyword] !== undefined && !within) {
        return failure('validation_error', `number at ${path || '$'} is ${description} ${schema[keyword]}`, path);
      }
    }
    if (schema.multipleOf !== undefined) {
      const quotient = value / schema.multipleOf;
      if (Math.abs(quotient - Math.round(quotient)) > 1e-9) {
        return failure('validation_error', `number at ${path || '$'} is not a multiple of ${schema.multipleOf}`, path);
      }
    }
  }

  if (Array.isArray(value)) {
    if (schema.items !== undefined) {
      for (let index = 0; index < value.length; index += 1) {
        const result = validate(value[index], schema.items, `${path}[${index}]`);
        if (!result.ok) {
          return result;
        }
      }
    }
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      return failure('validation_error', `array at ${path || '$'} has fewer than minItems ${schema.minItems}`, path);
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      return failure('validation_error', `array at ${path || '$'} has more than maxItems ${schema.maxItems}`, path);
    }
    if (schema.uniqueItems === true) {
      const seen = new Set();
      for (const entry of value) {
        const key = canonicalJson(entry);
        if (seen.has(key)) {
          return failure('validation_error', `array at ${path || '$'} contains a duplicate item`, path);
        }
        seen.add(key);
      }
    }
  }

  if (isSchemaObject(value)) {
    const objectResult = validateObject(value, schema, path);
    if (!objectResult.ok) {
      return objectResult;
    }
  }

  return validateCombinators(value, schema, path);
}

function validateObject(value, schema, path) {
  if (Array.isArray(schema.required)) {
    for (const field of schema.required) {
      if (value[field] === undefined) {
        return failure('validation_error', `missing required field "${field}" at ${path || '$'}`, path || '$');
      }
    }
  }

  const properties = isSchemaObject(schema.properties) ? schema.properties : null;
  const matched = new Set();

  if (properties !== null) {
    for (const [field, fieldSchema] of Object.entries(properties)) {
      if (value[field] === undefined) {
        continue;
      }
      matched.add(field);
      const result = validate(value[field], fieldSchema, path ? `${path}.${field}` : field);
      if (!result.ok) {
        return result;
      }
    }
  }

  if (isSchemaObject(schema.patternProperties)) {
    for (const [pattern, fieldSchema] of Object.entries(schema.patternProperties)) {
      const expression = new RegExp(pattern);
      for (const field of Object.keys(value)) {
        if (!expression.test(field)) {
          continue;
        }
        matched.add(field);
        const result = validate(value[field], fieldSchema, path ? `${path}.${field}` : field);
        if (!result.ok) {
          return result;
        }
      }
    }
  }

  const extras = Object.keys(value).filter((field) => !matched.has(field));
  if (schema.additionalProperties === false) {
    if (extras.length > 0) {
      return failure('validation_error', `unexpected field "${extras[0]}" at ${path || '$'}`, path || '$');
    }
  } else if (schema.additionalProperties !== undefined && schema.additionalProperties !== true) {
    for (const field of extras) {
      const result = validate(value[field], schema.additionalProperties, path ? `${path}.${field}` : field);
      if (!result.ok) {
        return result;
      }
    }
  }

  if (schema.minProperties !== undefined && Object.keys(value).length < schema.minProperties) {
    return failure('validation_error', `object at ${path || '$'} has fewer than minProperties ${schema.minProperties}`, path);
  }
  if (schema.maxProperties !== undefined && Object.keys(value).length > schema.maxProperties) {
    return failure('validation_error', `object at ${path || '$'} has more than maxProperties ${schema.maxProperties}`, path);
  }
  return acceptance(path);
}

function validateCombinators(value, schema, path) {
  if (Array.isArray(schema.allOf)) {
    for (const [index, branch] of schema.allOf.entries()) {
      const result = validate(value, branch, path);
      if (!result.ok) {
        return failure(result.code ?? 'validation_error', `allOf[${index}] failed: ${result.message}`, path);
      }
    }
  }
  if (Array.isArray(schema.anyOf) && !schema.anyOf.some((branch) => validate(value, branch, path).ok)) {
    return failure('validation_error', `value at ${path || '$'} matches no anyOf branch`, path);
  }
  if (Array.isArray(schema.oneOf)) {
    const matches = schema.oneOf.filter((branch) => validate(value, branch, path).ok).length;
    if (matches !== 1) {
      return failure('validation_error', `value at ${path || '$'} matches ${matches} oneOf branches instead of exactly one`, path);
    }
  }
  if (schema.not !== undefined && validate(value, schema.not, path).ok) {
    return failure('validation_error', `value at ${path || '$'} matches a schema it must not match`, path);
  }
  return acceptance(path);
}

function acceptance(path) {
  return { ok: true, message: '', path };
}

function failure(code, message, path) {
  return { ok: false, code, message, path };
}

function unsupported(path, message) {
  return failure('unsupported_schema', `the schema at ${path || '$'} is unsupported: ${message}`, path);
}

function profileName() {
  return `${SCHEMA_PROFILE.name} ${SCHEMA_PROFILE.version}`;
}

function isValidPattern(pattern) {
  if (typeof pattern !== 'string') {
    return false;
  }
  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
}

function isSchemaObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function matchesType(value, type) {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && !Number.isNaN(value);
    case 'integer':
      return Number.isInteger(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'null':
      return value === null;
    case 'array':
      return Array.isArray(value);
    case 'object':
      return isSchemaObject(value);
    default:
      return false;
  }
}

function describeType(value) {
  if (value === null) {
    return 'null';
  }
  if (Array.isArray(value)) {
    return 'array';
  }
  return typeof value;
}
