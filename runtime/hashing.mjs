import { createHash } from 'node:crypto';

/**
 * Canonical hashing helpers.
 *
 * The runtime identifies wire definitions and values by hash so that caching,
 * invalidation, and transaction replay can compare exact revisions. Hashing is
 * deterministic for the same logical input:
 *
 * - canonicalJson orders object keys lexicographically.
 * - hashDefinition digests a command identity, its version, and the normalized
 *   wire body.
 * - hashValue digests a canonical JSON encoding of a runtime value.
 */

export function canonicalJson(value, seen = new WeakSet()) {
  if (value === null) {
    return 'null';
  }
  const type = typeof value;
  if (type === 'number') {
    if (Number.isNaN(value)) {
      return '"__NaN__"';
    }
    if (value === Infinity) {
      return '"__Infinity__"';
    }
    if (value === -Infinity) {
      return '"-__Infinity__"';
    }
    return JSON.stringify(value);
  }
  if (type === 'string' || type === 'boolean') {
    return JSON.stringify(value);
  }
  if (type === 'undefined') {
    return '"__undefined__"';
  }
  if (type === 'bigint') {
    return JSON.stringify(`${value}n`);
  }
  if (type === 'function' || type === 'symbol') {
    return JSON.stringify(String(value));
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item, seen)).join(',')}]`;
  }
  if (value instanceof Date) {
    return JSON.stringify(value.toISOString());
  }
  if (value instanceof Map) {
    const entries = [...value.entries()].map(
      ([key, item]) => `${canonicalJson(key, seen)}:${canonicalJson(item, seen)}`
    );
    entries.sort();
    return `{${entries.join(',')}}`;
  }
  if (value instanceof Set) {
    const entries = [...value.values()].map((item) => canonicalJson(item, seen));
    entries.sort();
    return `[${entries.join(',')}]`;
  }
  if (type === 'object') {
    if (seen.has(value)) {
      return '"__cycle__"';
    }
    seen.add(value);
    const keys = Object.keys(value).sort();
    const body = keys
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key], seen)}`)
      .join(',');
    seen.delete(value);
    return `{${body}}`;
  }
  return JSON.stringify(String(value));
}

export function sha256(payload) {
  return createHash('sha256').update(payload).digest('hex');
}

export function hashDefinition({ command, commandVersion = '', body = '' }) {
  return sha256(canonicalJson({ command, version: commandVersion, body: normalizeBody(body) }));
}

export function hashValue(value) {
  return sha256(canonicalJson(value));
}

export function normalizeBody(body) {
  const text = String(body ?? '').replace(/\r\n/g, '\n');
  const lines = text.split('\n').map((line) => line.replace(/[ \t]+$/g, ''));
  while (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines.join('\n');
}

export function shortHash(hash, length = 12) {
  return String(hash).slice(0, length);
}
