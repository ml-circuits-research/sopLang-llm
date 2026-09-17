/**
 * Dependency analysis for wire bodies.
 *
 * A `$name` sequence is a value dependency only when it appears as a value
 * reference in the body language of the command. Two analyzers are provided
 * because the body languages differ:
 *
 * `findValueReferences` reads JavaScript. It walks the body once, tracking
 * single-quote, double-quote, template-literal, regular-expression, and comment
 * context, and records each identifier-shaped `$name` occurrence that is a code
 * reference:
 *
 * - `$name` in code position is a dependency.
 * - "$name" and '$name' inside literals are data.
 * - `text ${$name}` inside a template literal is a dependency because it is an
 *   interpolation; `text $name` outside an interpolation is data.
 * - `// $name` and block comments produce no dependencies.
 * - `` /$name/ `` is a regular-expression literal and `obj.$name` is a property
 *   name, so neither invents a dependency.
 * - `` { $price: 7 } `` uses `$price` as a literal property key, so it invents
 *   no dependency; the shorthand `` { $price } `` is a value reference.
 * - `\$name` is escaped text and produces no dependency.
 *
 * `findInstructionReferences` reads instruction text such as a `modelCall`
 * body. Prose has no string literals, so an apostrophe must never hide a
 * reference: `What's $x?` reads `$x`. A `$name` occurrence is a reference unless
 * it is escaped as `\$name`.
 *
 * Both return the ordered list of distinct value names with the offset of the
 * first occurrence, which the runtime uses for diagnostics.
 */

import { isValidWireName } from './identifiers.mjs';

const IDENTIFIER_START = /[A-Za-z_]/;
const IDENTIFIER_PART = /[A-Za-z0-9_]/;
const WORD_CHAR = /[A-Za-z0-9_$]/;
const REGEX_PRECEDING = new Set([
  '',
  '(',
  ',',
  '=',
  ':',
  '[',
  '!',
  '&',
  '|',
  '?',
  '{',
  '}',
  ';',
  '+',
  '-',
  '*',
  '%',
  '<',
  '>',
  '~',
  '^'
]);
const REGEX_PRECEDING_WORDS = new Set([
  'return',
  'typeof',
  'instanceof',
  'in',
  'of',
  'new',
  'delete',
  'void',
  'case',
  'do',
  'else',
  'yield',
  'await',
  'default'
]);

export function findValueReferences(body) {
  const text = String(body ?? '');
  const references = [];
  const seen = new Set();
  const record = (name, offset) => {
    if (!seen.has(name) && isValidWireName(name)) {
      seen.add(name);
      references.push({ name, offset });
    }
  };
  scanJavaScript(text, record, 0);
  return references;
}

export function findValueNames(body) {
  return findValueReferences(body).map((reference) => reference.name);
}

export function findInstructionReferences(body) {
  const text = String(body ?? '');
  const references = [];
  const seen = new Set();
  const length = text.length;
  let index = 0;

  while (index < length) {
    const char = text[index];
    if (char === '\\') {
      index += 2;
      continue;
    }
    if (char === '$' && typeof text[index + 1] === 'string' && IDENTIFIER_START.test(text[index + 1])) {
      let cursor = index + 2;
      while (cursor < length && IDENTIFIER_PART.test(text[cursor])) {
        cursor += 1;
      }
      const name = text.slice(index + 1, cursor);
      if (isValidWireName(name) && !seen.has(name)) {
        seen.add(name);
        references.push({ name, offset: index });
      }
      index = cursor;
      continue;
    }
    index += 1;
  }

  return references;
}

export function findInstructionNames(body) {
  return findInstructionReferences(body).map((reference) => reference.name);
}

function scanJavaScript(text, record, base) {
  const length = text.length;
  let index = 0;
  let lastChar = '';
  let lastWord = '';

  const regexAllowed = () => (lastChar === '' ? true : REGEX_PRECEDING.has(lastChar) || REGEX_PRECEDING_WORDS.has(lastWord));

  const consumeIdentifier = (start) => {
    let cursor = start;
    while (cursor < length && WORD_CHAR.test(text[cursor])) {
      cursor += 1;
    }
    const word = text.slice(start, cursor);
    lastWord = word;
    lastChar = word[word.length - 1];
    return cursor;
  };

  while (index < length) {
    const char = text[index];

    if (char === '/' && text[index + 1] === '/') {
      index += 2;
      while (index < length && text[index] !== '\n') {
        index += 1;
      }
      continue;
    }

    if (char === '/' && text[index + 1] === '*') {
      index += 2;
      while (index < length && !(text[index] === '*' && text[index + 1] === '/')) {
        index += 1;
      }
      index += 2;
      continue;
    }

    if (char === '\\') {
      index += 2;
      continue;
    }

    if (char === '"' || char === "'") {
      const quote = char;
      index += 1;
      while (index < length) {
        if (text[index] === '\\') {
          index += 2;
          continue;
        }
        if (text[index] === quote) {
          index += 1;
          break;
        }
        index += 1;
      }
      lastChar = quote;
      lastWord = '';
      continue;
    }

    if (char === '`') {
      index = skipTemplate(text, index, record, base, lastChar, lastWord);
      lastChar = '`';
      lastWord = '';
      continue;
    }

    if (char === '/' && regexAllowed()) {
      index = skipRegexLiteral(text, index);
      lastChar = '/';
      lastWord = '';
      continue;
    }

    if (char === '$') {
      const previous = index === 0 ? '' : text[index - 1];
      const spread = previous === '.' && text.slice(Math.max(0, index - 3), index) === '...';
      const next = text[index + 1];
      if (!WORD_CHAR.test(previous) && !(previous === '.' && !spread) && typeof next === 'string' && IDENTIFIER_START.test(next)) {
        let cursor = index + 2;
        while (cursor < length && IDENTIFIER_PART.test(text[cursor])) {
          cursor += 1;
        }
        if (!isPropertyKeyPosition(text, index, cursor)) {
          record(text.slice(index + 1, cursor), base + index);
        }
        lastWord = text.slice(index, cursor);
        lastChar = text[cursor - 1];
        index = cursor;
        continue;
      }
      lastChar = char;
      lastWord = '';
      index += 1;
      continue;
    }

    if (/[A-Za-z_$]/.test(char)) {
      index = consumeIdentifier(index);
      continue;
    }

    if (/[0-9]/.test(char)) {
      let cursor = index;
      while (cursor < length && /[0-9A-Fa-fxXoObBeE._+-n]/.test(text[cursor])) {
        if ((text[cursor] === '+' || text[cursor] === '-') && !/[eE]/.test(text[cursor - 1])) {
          break;
        }
        cursor += 1;
      }
      lastChar = text[cursor - 1];
      lastWord = '';
      index = cursor;
      continue;
    }

    if (!/\s/.test(char)) {
      lastChar = char;
      lastWord = '';
    }
    index += 1;
  }
}

/**
 * A `$name` is a literal property key, not a value reference, when an
 * object-literal opener (`{` or a `,` between members) precedes it and a colon
 * follows it: `` { $price: 7 } `` declares the key "$price" and never reads the
 * wire `price`. Without the colon the occurrence is a shorthand value reference
 * (`` { $price } ``) and stays a dependency.
 */
function isPropertyKeyPosition(text, start, identifierEnd) {
  let back = start - 1;
  while (back >= 0 && /\s/.test(text[back])) {
    back -= 1;
  }
  if (back < 0 || (text[back] !== '{' && text[back] !== ',')) {
    return false;
  }
  let forward = identifierEnd;
  while (forward < text.length && /\s/.test(text[forward])) {
    forward += 1;
  }
  return text[forward] === ':';
}

function skipTemplate(text, start, record, base, lastChar, lastWord) {
  const length = text.length;
  let index = start + 1;
  while (index < length) {
    if (text[index] === '\\') {
      index += 2;
      continue;
    }
    if (text[index] === '$' && text[index + 1] === '{') {
      const interpolationStart = index + 2;
      let depth = 1;
      let cursor = interpolationStart;
      while (cursor < length && depth > 0) {
        const inner = text[cursor];
        if (inner === '\\') {
          cursor += 2;
          continue;
        }
        if (inner === '"' || inner === "'") {
          const quote = inner;
          cursor += 1;
          while (cursor < length && text[cursor] !== quote) {
            if (text[cursor] === '\\') {
              cursor += 1;
            }
            cursor += 1;
          }
          cursor += 1;
          continue;
        }
        if (inner === '`') {
          cursor = skipTemplate(text, cursor, record, base + cursor, lastChar, lastWord);
          continue;
        }
        if (inner === '{') {
          depth += 1;
        } else if (inner === '}') {
          depth -= 1;
        }
        cursor += 1;
      }
      scanJavaScript(text.slice(interpolationStart, cursor - 1), record, base + interpolationStart);
      index = cursor;
      continue;
    }
    if (text[index] === '`') {
      return index + 1;
    }
    index += 1;
  }
  return index;
}

function skipRegexLiteral(text, start) {
  const length = text.length;
  let index = start + 1;
  let inClass = false;
  while (index < length) {
    const char = text[index];
    if (char === '\\') {
      index += 2;
      continue;
    }
    if (char === '\n') {
      return index;
    }
    if (char === '[') {
      inClass = true;
    } else if (char === ']') {
      inClass = false;
    } else if (char === '/' && !inClass) {
      index += 1;
      while (index < length && WORD_CHAR.test(text[index])) {
        index += 1;
      }
      return index;
    }
    index += 1;
  }
  return index;
}
