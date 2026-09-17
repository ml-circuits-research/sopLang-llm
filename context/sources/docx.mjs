/**
 * Canonical DOCX source extraction for the data pipeline.
 *
 * The extractor is defined by a versioned profile so a derivative can always be
 * traced back to the bytes it came from:
 *
 * - `readZipEntry` reads one member of the container with the built-in zlib
 *   inflater, so no external archive tool is required.
 * - `extractParagraphs` walks `word/document.xml` in document order and returns
 *   one record per paragraph with its ordinal index, its decoded text, and
 *   whether the paragraph belongs to a table cell.
 * - The canonical text joins paragraph texts with a single newline, converts
 *   `<w:br/>` to a newline and `<w:tab/>` to a tab inside a paragraph, decodes
 *   XML entities, and normalizes spaces and trailing whitespace. Unicode
 *   characters are preserved as they appear in the document.
 * - Tables are flattened in document order: a cell is a paragraph, so the
 *   canonical text keeps the cell texts in reading order and the paragraph
 *   index mapping keeps cell boundaries recoverable.
 * - Images, drawings, footnotes, headers, comments, and content controls are
 *   outside the profile. The extractor counts drawing elements and reports the
 *   count, and it never guesses text that the profile does not cover.
 *
 * A source registration records the raw hash, the canonical hash, the extractor
 * version, and the byte size, which is what a dataset manifest inherits.
 */

import { readFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { sha256 } from '../../runtime/hashing.mjs';

export const DOCX_PROFILE = Object.freeze({
  name: 'docx-canvas-text',
  version: '1.1.0',
  member: 'word/document.xml',
  paragraphSeparator: '\n',
  notes: 'Paragraph-order text extraction with br and tab conversion, XML entity decoding including numeric character references, and space normalization.'
});

export function readZipEntry(buffer, name) {
  const eocd = findEndOfCentralDirectory(buffer);
  const entryCount = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);
  for (let index = 0; index < entryCount; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error(`Malformed central directory at entry ${index}.`);
    }
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const nameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const entryName = buffer.toString('utf8', offset + 46, offset + 46 + nameLength);
    if (entryName === name) {
      const localNameLength = buffer.readUInt16LE(localOffset + 26);
      const localExtraLength = buffer.readUInt16LE(localOffset + 28);
      const start = localOffset + 30 + localNameLength + localExtraLength;
      const data = buffer.subarray(start, start + compressedSize);
      return method === 0 ? Buffer.from(data) : inflateRawSync(data);
    }
    offset += 46 + nameLength + extraLength + commentLength;
  }
  throw new Error(`The archive does not contain "${name}".`);
}

function findEndOfCentralDirectory(buffer) {
  const limit = Math.max(0, buffer.length - 66_000);
  for (let offset = buffer.length - 22; offset >= limit; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      return offset;
    }
  }
  throw new Error('The archive has no end-of-central-directory record.');
}

export function extractParagraphs(documentXml) {
  const paragraphs = [];
  const parts = documentXml.split('</w:p>');
  // A cell can span several paragraphs, so membership in a table is a running
  // depth over the enclosing `<w:tc>` element rather than a property of one
  // split part: every `<w:tc>` or `</w:tc>` in a part precedes this
  // paragraph's close, and the close of a cell always lands in the part after
  // the cell's last paragraph. Adjacent cells balance out within one part.
  let tableDepth = 0;
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];
    tableDepth += (part.match(/<w:tc[ >]/g) ?? []).length - (part.match(/<\/w:tc>/g) ?? []).length;
    if (!part.includes('<w:p ') && !part.includes('<w:p>')) {
      continue;
    }
    const text = paragraphText(part);
    paragraphs.push({ index: paragraphs.length, text, inTable: tableDepth > 0 });
  }
  return paragraphs;
}

function paragraphText(part) {
  const withBreaks = part.replace(/<w:br\s*\/>/g, '\n').replace(/<w:tab\s*\/>/g, '\t');
  const withoutTags = withBreaks.replace(/<[^>]+>/g, '');
  return normalizeText(decodeEntities(withoutTags));
}

function decodeEntities(text) {
  return text.replace(/&(lt|gt|amp|quot|apos|#\d+|#x[0-9A-Fa-f]+);/g, (match, code) => {
    if (code === 'lt') return '<';
    if (code === 'gt') return '>';
    if (code === 'amp') return '&';
    if (code === 'quot') return '"';
    if (code === 'apos') return "'";
    const codePoint = code.startsWith('#x') ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
    if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff || Number.isNaN(codePoint)) {
      return match;
    }
    return String.fromCodePoint(codePoint);
  });
}

export function normalizeText(text) {
  return String(text ?? '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function canonicalText(paragraphs, { paragraphSeparator = '\n' } = {}) {
  return paragraphs.map((paragraph) => paragraph.text).join(paragraphSeparator);
}

export function canonicalHashOf(text) {
  return sha256(String(text));
}

/**
 * Register a DOCX source: the record a dataset manifest inherits, with the raw
 * hash of the bytes, the canonical hash of the extracted text, and the extractor
 * version that produced it.
 */
export function registerDocxSource(path) {
  const buffer = readFileSync(path);
  const documentXml = readZipEntry(buffer, DOCX_PROFILE.member).toString('utf8');
  const paragraphs = extractParagraphs(documentXml);
  const text = canonicalText(paragraphs);
  const drawings = (documentXml.match(/<w:drawing>/g) ?? []).length;
  return {
    path,
    rawHash: sha256(buffer),
    canonicalHash: canonicalHashOf(text),
    extractor: `${DOCX_PROFILE.name} ${DOCX_PROFILE.version}`,
    byteSize: buffer.length,
    paragraphs,
    text,
    drawings
  };
}

export function paragraphSpan(paragraphs, fromIndex, toIndex) {
  const slice = paragraphs.filter((paragraph) => paragraph.index >= fromIndex && paragraph.index <= toIndex);
  return {
    from: fromIndex,
    to: toIndex,
    characters: slice.reduce((total, paragraph) => total + paragraph.text.length + 1, 0)
  };
}
