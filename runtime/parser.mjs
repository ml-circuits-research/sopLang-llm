import { normalizeBody } from './hashing.mjs';
import { isValidWireName } from './identifiers.mjs';
import { SopError } from './errors.mjs';

/**
 * SOP Lang parser.
 *
 * A declaration begins at the start of a line with `@`, followed by a wire name
 * and a wire command. Everything until the next valid declaration belongs to
 * that wire's body. A body line that must literally begin with a valid
 * declaration marker is escaped as `\@name command`, and the escape is removed
 * before the body reaches the command.
 *
 * The parser accepts any command token without validating it, because command
 * validation belongs to the registry. It rejects a malformed command token and
 * a malformed wire name so that the declaration boundary stays unambiguous.
 */

const DECLARATION_PATTERN = /^@([A-Za-z_][A-Za-z0-9_]*)[ \t]+(\S+)[ \t]*$/;
const ESCAPED_PREFIX = '\\@';

export function parseCircuit(source, { sourceName = 'inline' } = {}) {
  if (typeof source !== 'string') {
    throw new SopError('parse_error', 'SOP Lang source must be a string.', { sourceName });
  }

  const text = source.replace(/\r\n/g, '\n');
  const lines = text.split('\n');
  const wires = [];
  let current = null;
  let lineNumber = 0;

  const pushCurrent = () => {
    if (current === null) {
      return;
    }
    current.body = normalizeBody(current.bodyLines.join('\n'));
    delete current.bodyLines;
    wires.push(current);
    current = null;
  };

  for (const rawLine of lines) {
    lineNumber += 1;
    const line = rawLine;

    if (line.startsWith('\\@')) {
      if (current === null) {
        throw new SopError('parse_error', `Unexpected escaped declaration outside a wire body at line ${lineNumber}.`, {
          sourceName,
          line: lineNumber
        });
      }
      current.bodyLines.push(line.slice(1));
      continue;
    }

    if (line.startsWith('@')) {
      const match = line.match(DECLARATION_PATTERN);
      if (match === null) {
        throw new SopError('parse_error', `Malformed wire declaration at line ${lineNumber}: "${line}".`, {
          sourceName,
          line: lineNumber
        });
      }
      pushCurrent();
      current = {
        name: match[1],
        command: match[2],
        body: '',
        bodyLines: [],
        line: lineNumber,
        sourceName
      };
      continue;
    }

    if (current === null) {
      if (line.trim() === '') {
        continue;
      }
      throw new SopError('parse_error', `Content before the first wire declaration at line ${lineNumber}.`, {
        sourceName,
        line: lineNumber
      });
    }

    current.bodyLines.push(line);
  }

  pushCurrent();

  if (wires.length === 0) {
    throw new SopError('parse_error', 'The program contains no wire declarations.', { sourceName });
  }

  const seen = new Set();
  for (const wire of wires) {
    if (seen.has(wire.name)) {
      throw new SopError('parse_error', `Duplicate wire name "${wire.name}" at line ${wire.line}.`, {
        sourceName,
        line: wire.line,
        wire: wire.name
      });
    }
    seen.add(wire.name);
  }

  return {
    sourceName,
    source: text,
    wires: wires.map((wire) => ({
      name: wire.name,
      command: wire.command,
      body: wire.body,
      line: wire.line,
      sourceName
    }))
  };
}

export function serializeCircuit(wires) {
  const blocks = wires.map((wire) => {
    const body = String(wire.body ?? '');
    const escaped = body
      .split('\n')
      .map((line) => (line.startsWith('@') ? `${ESCAPED_PREFIX}${line.slice(1)}` : line))
      .join('\n');
    return `@${wire.name} ${wire.command}\n${escaped}`;
  });
  return `${blocks.join('\n\n')}\n`;
}

export function isEscapedDeclaration(line) {
  return line.startsWith('\\@');
}

export function escapeBody(body) {
  return String(body ?? '')
    .split('\n')
    .map((line) => (line.startsWith('@') ? `${ESCAPED_PREFIX}${line.slice(1)}` : line))
    .join('\n');
}

export { isValidWireName };
