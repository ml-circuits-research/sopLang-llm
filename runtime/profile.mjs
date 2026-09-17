/**
 * Reader for the readable SOP Lang command profiles.
 *
 * Container declarations and container patches use a small indentation-based
 * profile format rather than raw JSON, because the model reads and writes it
 * directly. The reader supports the subset the reference profile needs:
 *
 * - mappings with `key: value`
 * - nested blocks by indentation
 * - sequences written as `- item`, including sequences of mappings
 * - flow mappings `{ id: x, start: 1 }` and flow sequences `[a, b]`
 * - raw code blocks such as a `predicate:` body
 * - quoted strings, numbers, booleans, and null
 *
 * The implementation normalizes the profile into a plain object, and the
 * runtime treats the result as the command payload.
 */

import { SopError } from './errors.mjs';

const KEY_PATTERN = /^([A-Za-z_][A-Za-z0-9_-]*):(.*)$/;

export function parseProfile(body, { sourceName = 'profile' } = {}) {
  const text = String(body ?? '').replace(/\r\n/g, '\n');
  const lines = [];
  for (const rawLine of text.split('\n')) {
    const trimmed = rawLine.trim();
    if (trimmed === '' || trimmed.startsWith('#')) {
      continue;
    }
    lines.push({ indent: countIndent(rawLine), text: trimmed });
  }
  if (lines.length === 0) {
    return {};
  }
  const [value] = parseBlock(lines, 0, lines[0].indent, sourceName);
  return value;
}

function parseBlock(lines, index, indent, sourceName) {
  const line = lines[index];
  if (line.indent < indent) {
    return [null, index];
  }
  if (line.text.startsWith('- ')) {
    return parseSequence(lines, index, indent, sourceName);
  }
  if (KEY_PATTERN.test(line.text)) {
    return parseMapping(lines, index, indent, sourceName);
  }
  return parseRawBlock(lines, index, indent, sourceName);
}

function parseMapping(lines, index, indent, sourceName) {
  const result = {};
  let cursor = index;

  while (cursor < lines.length) {
    const line = lines[cursor];
    if (line.indent < indent) {
      break;
    }
    if (line.indent > indent) {
      throw new SopError('parse_error', `Unexpected indentation at "${line.text}" in ${sourceName}.`, {
        line: cursor + 1
      });
    }
    if (line.text.startsWith('- ')) {
      break;
    }
    const match = line.text.match(KEY_PATTERN);
    if (match === null) {
      break;
    }
    const key = match[1];
    const rest = match[2].trim();
    if (rest !== '') {
      result[key] = parseFlowValue(rest, sourceName);
      cursor += 1;
      continue;
    }
    const next = lines[cursor + 1];
    if (next === undefined || next.indent <= indent) {
      result[key] = null;
      cursor += 1;
      continue;
    }
    const [nestedValue, nextIndex] = parseBlock(lines, cursor + 1, next.indent, sourceName);
    result[key] = nestedValue;
    cursor = nextIndex;
  }

  return [result, cursor];
}

function parseSequence(lines, index, indent, sourceName) {
  const result = [];
  let cursor = index;

  while (cursor < lines.length) {
    const line = lines[cursor];
    if (line.indent < indent) {
      break;
    }
    if (line.indent !== indent || !line.text.startsWith('- ')) {
      break;
    }

    const itemText = line.text.slice(2).trim();
    if (itemText === '') {
      const next = lines[cursor + 1];
      if (next === undefined || next.indent <= indent) {
        result.push(null);
        cursor += 1;
        continue;
      }
      const [nestedValue, nextIndex] = parseBlock(lines, cursor + 1, next.indent, sourceName);
      result.push(nestedValue);
      cursor = nextIndex;
      continue;
    }

    if (KEY_PATTERN.test(itemText)) {
      const virtualIndent = indent + 2;
      const virtual = [{ indent: virtualIndent, text: itemText }];
      let scan = cursor + 1;
      while (scan < lines.length && lines[scan].indent > indent) {
        virtual.push({
          indent: virtualIndent + Math.max(0, lines[scan].indent - indent - 2),
          text: lines[scan].text
        });
        scan += 1;
      }
      const [itemValue] = parseMapping(virtual, 0, virtualIndent, sourceName);
      result.push(itemValue);
      cursor = scan;
      continue;
    }

    result.push(parseFlowValue(itemText, sourceName));
    cursor += 1;
  }

  return [result, cursor];
}

function parseRawBlock(lines, index, indent, sourceName) {
  const collected = [];
  let cursor = index;
  while (cursor < lines.length && lines[cursor].indent >= indent) {
    const extra = lines[cursor].indent - indent;
    collected.push(`${' '.repeat(extra)}${lines[cursor].text}`);
    cursor += 1;
  }
  if (collected.length === 0) {
    throw new SopError('parse_error', `Expected a value at line ${index + 1} in ${sourceName}.`, {
      line: index + 1
    });
  }
  return [collected.join('\n'), cursor];
}

export function parseFlowValue(text, sourceName = 'profile') {
  const trimmed = text.trim();
  if (trimmed.startsWith('{')) {
    return parseFlowMapping(trimmed, sourceName);
  }
  if (trimmed.startsWith('[')) {
    return parseFlowSequence(trimmed, sourceName);
  }
  return parseScalar(trimmed);
}

function parseFlowMapping(text, sourceName) {
  if (!text.endsWith('}')) {
    throw new SopError('parse_error', `Unterminated flow mapping in ${sourceName}: ${text}`, {});
  }
  const inner = text.slice(1, -1).trim();
  const result = {};
  if (inner === '') {
    return result;
  }
  for (const entry of splitTopLevel(inner)) {
    const separator = findTopLevelColon(entry);
    if (separator === -1) {
      throw new SopError('parse_error', `Flow mapping entry is missing a colon in ${sourceName}: ${entry}`, {});
    }
    const key = entry.slice(0, separator).trim();
    const value = entry.slice(separator + 1).trim();
    result[key] = parseFlowValue(value, sourceName);
  }
  return result;
}

function parseFlowSequence(text, sourceName) {
  if (!text.endsWith(']')) {
    throw new SopError('parse_error', `Unterminated flow sequence in ${sourceName}: ${text}`, {});
  }
  const inner = text.slice(1, -1).trim();
  if (inner === '') {
    return [];
  }
  return splitTopLevel(inner).map((entry) => parseFlowValue(entry.trim(), sourceName));
}

function splitTopLevel(text) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let start = 0;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quote !== null) {
      if (char === '\\') {
        index += 1;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '{' || char === '[') {
      depth += 1;
      continue;
    }
    if (char === '}' || char === ']') {
      depth -= 1;
      continue;
    }
    if (char === ',' && depth === 0) {
      parts.push(text.slice(start, index));
      start = index + 1;
    }
  }
  parts.push(text.slice(start));
  return parts.map((part) => part.trim()).filter((part) => part !== '');
}

function findTopLevelColon(text) {
  let depth = 0;
  let quote = null;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quote !== null) {
      if (char === '\\') {
        index += 1;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '{' || char === '[') {
      depth += 1;
      continue;
    }
    if (char === '}' || char === ']') {
      depth -= 1;
      continue;
    }
    if (char === ':' && depth === 0) {
      return index;
    }
  }
  return -1;
}

function parseScalar(text) {
  if (text.startsWith('"') && text.endsWith('"') && text.length >= 2) {
    return JSON.parse(text);
  }
  if (text.startsWith("'") && text.endsWith("'") && text.length >= 2) {
    return text.slice(1, -1);
  }
  if (text === 'true') {
    return true;
  }
  if (text === 'false') {
    return false;
  }
  if (text === 'null' || text === '~') {
    return null;
  }
  if (/^-?\d+(\.\d+)?$/.test(text)) {
    return Number(text);
  }
  return text;
}

export function countIndent(line) {
  const leading = line.match(/^[ \t]*/)[0];
  let count = 0;
  for (const char of leading) {
    count += char === '\t' ? 2 : 1;
  }
  return count;
}
