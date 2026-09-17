/**
 * Runtime value profile.
 *
 * The runtime moves values between execution realms: the kernel realm, the
 * JavaScript guest realm of `jsEval`, and the persistent container store. A
 * value crosses a realm boundary only through this profile, so the semantics of
 * a transferred value are explicit and versioned:
 *
 * - `null`, booleans, numbers, strings, and `undefined` transfer as themselves.
 * - `NaN`, infinities, `-0`, and `bigint` values transfer through a tag.
 * - arrays, plain objects, `Date`, `Map`, `Set`, and `RegExp` transfer
 *   structurally, so the receiver owns a fresh copy of the value.
 * - functions, symbols, class instances, promises, and cyclic structures are
 *   not transferable; they are reported as `unsupported_value`.
 *
 * A transferred value is always a copy. Mutating the copy inside a guest realm
 * or a command never reaches the caller, the value store, or a container
 * revision; persistent change requires a committed container patch.
 *
 * The codec source is defined once and instantiated in both realms, so the
 * encoding, the decoding, and their error messages cannot diverge.
 */

import { SopError } from './errors.mjs';

export const VALUE_PROFILE = Object.freeze({
  name: 'soplang-value-transfer',
  version: '1.0.0',
  types: Object.freeze([
    'null',
    'undefined',
    'boolean',
    'number',
    'bigint',
    'string',
    'array',
    'object',
    'date',
    'map',
    'set',
    'regexp'
  ])
});

export const TRANSFER_CODEC_SOURCE = `
function transferFailure(path, reason) {
  const error = new Error('the value at ' + path + ' cannot be transferred: ' + reason);
  error.sopCode = 'unsupported_value';
  return error;
}

function transferDescribe(value) {
  if (value === null) { return 'null'; }
  if (Array.isArray(value)) { return 'array'; }
  const prototype = Object.getPrototypeOf(value);
  if (prototype === null) { return 'object without a prototype'; }
  const name = prototype.constructor && prototype.constructor.name;
  return name ? 'instance of ' + name : 'object';
}

function encodeTransfer(value) {
  const active = new Set();
  const encode = (item, path) => {
    if (item === null) { return null; }
    const type = typeof item;
    if (type === 'boolean' || type === 'string') { return item; }
    if (type === 'number') {
      if (Number.isNaN(item)) { return { t: 'nan' }; }
      if (item === Infinity) { return { t: 'inf' }; }
      if (item === -Infinity) { return { t: 'ninf' }; }
      if (Object.is(item, -0)) { return { t: 'nzero' }; }
      return item;
    }
    if (type === 'undefined') { return { t: 'undefined' }; }
    if (type === 'bigint') { return { t: 'bigint', v: item.toString() }; }
    if (type === 'function' || type === 'symbol') { throw transferFailure(path, type); }
    if (active.has(item)) { throw transferFailure(path, 'cyclic structure'); }
    active.add(item);
    let encoded;
    if (Array.isArray(item)) {
      encoded = { t: 'array', v: item.map((entry, index) => encode(entry, path + '[' + index + ']')) };
    } else if (item instanceof Date) {
      encoded = { t: 'date', v: item.toISOString() };
    } else if (item instanceof Map) {
      const entries = [];
      let index = 0;
      for (const entry of item.entries()) {
        entries.push([encode(entry[0], path + '.{key ' + index + '}'), encode(entry[1], path + '.{value ' + index + '}')]);
        index += 1;
      }
      encoded = { t: 'map', v: entries };
    } else if (item instanceof Set) {
      const entries = [];
      let index = 0;
      for (const entry of item.values()) {
        entries.push(encode(entry, path + '.{' + index + '}'));
        index += 1;
      }
      encoded = { t: 'set', v: entries };
    } else if (item instanceof RegExp) {
      encoded = { t: 'regexp', v: [item.source, item.flags] };
    } else {
      const prototype = Object.getPrototypeOf(item);
      if (prototype !== null && prototype !== Object.prototype) { throw transferFailure(path, 'instance of ' + transferDescribe(item)); }
      encoded = { t: 'object', v: Object.keys(item).map((key) => [key, encode(item[key], path + '.' + key)]) };
    }
    active.delete(item);
    return encoded;
  };
  return JSON.stringify(encode(value, '$'));
}

function decodeTransfer(text) {
  const decode = (item) => {
    if (item === null || typeof item !== 'object') { return item; }
    switch (item.t) {
      case 'undefined': return undefined;
      case 'nan': return NaN;
      case 'inf': return Infinity;
      case 'ninf': return -Infinity;
      case 'nzero': return -0;
      case 'bigint': return BigInt(item.v);
      case 'date': return new Date(item.v);
      case 'regexp': return new RegExp(item.v[0], item.v[1]);
      case 'array': return item.v.map(decode);
      case 'set': {
        const result = new Set();
        for (const entry of item.v) { result.add(decode(entry)); }
        return result;
      }
      case 'map': {
        const result = new Map();
        for (const entry of item.v) { result.set(decode(entry[0]), decode(entry[1])); }
        return result;
      }
      case 'object': {
        const result = {};
        for (const entry of item.v) { result[entry[0]] = decode(entry[1]); }
        return result;
      }
      default: throw transferFailure('$', 'unknown transfer tag ' + String(item.t));
    }
  };
  return decode(JSON.parse(text));
}
`;

const hostCodec = new Function(`${TRANSFER_CODEC_SOURCE}\nreturn { encodeTransfer, decodeTransfer };`)();

export function encodeValue(value, { wire = null, role = 'value' } = {}) {
  try {
    return hostCodec.encodeTransfer(value);
  } catch (error) {
    throw new SopError('unsupported_value', `${role}${wire === null ? '' : ` of wire "${wire}"`} is not transferable: ${String(error.message ?? error)}`, {
      wire,
      role
    });
  }
}

export function decodeValue(text, { wire = null, role = 'value' } = {}) {
  try {
    return hostCodec.decodeTransfer(String(text));
  } catch (error) {
    throw new SopError('unsupported_value', `${role}${wire === null ? '' : ` of wire "${wire}"`} could not be decoded: ${String(error.message ?? error)}`, {
      wire,
      role
    });
  }
}

/**
 * A deep copy in the value profile. The copy shares no nested reference with
 * the input, so a receiver cannot mutate the caller's structure.
 */
export function copyValue(value, context = {}) {
  return decodeValue(encodeValue(value, context), context);
}

/**
 * Freeze a value graph so an in-process consumer cannot mutate a stored value
 * or a container record outside a declared effect. Cycles are tolerated.
 */
export function freezeValue(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (Array.isArray(value) || value instanceof Set) {
    for (const entry of value) {
      freezeValue(entry, seen);
    }
  } else if (value instanceof Map) {
    for (const [key, entry] of value.entries()) {
      freezeValue(key, seen);
      freezeValue(entry, seen);
    }
  } else {
    for (const key of Object.keys(value)) {
      freezeValue(value[key], seen);
    }
  }
  return Object.freeze(value);
}
