import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractParagraphs, canonicalText, DOCX_PROFILE, normalizeText } from '../context/sources/docx.mjs';

const DOCUMENT = [
  '<w:p><w:r><w:t>First paragraph</w:t></w:r></w:p>',
  '<w:p><w:r><w:t>Second </w:t></w:r><w:br/><w:r><w:t>with a break</w:t></w:r></w:p>',
  '<w:tbl><w:tr><w:tc><w:p><w:r><w:t>cell one</w:t></w:r></w:p>',
  '<w:p><w:r><w:t>cell one, second paragraph</w:t></w:r></w:p></w:tc>',
  '<w:tc><w:p><w:r><w:t>cell two</w:t></w:r></w:p></w:tc></w:tr></w:tbl>',
  '<w:p><w:r><w:t>a &lt; b &amp; c &gt; d</w:t></w:r><w:tab/><w:r><w:t>x</w:t></w:r></w:p>'
].join('');

test('the extraction profile keeps paragraph order and counts cells as paragraphs', () => {
  const paragraphs = extractParagraphs(DOCUMENT);
  assert.deepEqual(
    paragraphs.map((paragraph) => paragraph.text),
    ['First paragraph', 'Second\nwith a break', 'cell one', 'cell one, second paragraph', 'cell two', 'a < b & c > d\tx']
  );
  assert.equal(paragraphs[2].inTable, true);
  assert.equal(paragraphs[0].inTable, false);
});

test('a paragraph after the first one of a cell is still in the table', () => {
  const paragraphs = extractParagraphs(DOCUMENT);
  assert.equal(paragraphs[3].inTable, true, 'the second paragraph of cell one');
  assert.equal(paragraphs[4].inTable, true, 'the second cell');
  assert.equal(paragraphs[5].inTable, false, 'the paragraph after the table');
});

test('numeric character references decode to their characters', () => {
  const paragraphs = extractParagraphs('<w:p><w:r><w:t>caf&#233; &#x2013; &#65;</w:t></w:r></w:p>');
  assert.deepEqual(paragraphs.map((paragraph) => paragraph.text), ['café – A']);
});

test('extraction is faithful to a source word glued to a digit', () => {
  // The seed book prints "0 or1" in one problem; the canonical profile
  // preserves the printed text instead of inventing a space, and the pilot
  // records such blemishes in the dataset report.
  const paragraph = '<w:p><w:r><w:t>Problem. </w:t></w:r><w:r><w:t>Each token can show 0 or1.</w:t></w:r></w:p>';
  const paragraphs = extractParagraphs(paragraph);
  assert.equal(paragraphs[0].text, 'Problem. Each token can show 0 or1.');
});

test('the canonical text joins paragraphs with a single newline', () => {
  const paragraphs = extractParagraphs(DOCUMENT);
  assert.equal(canonicalText(paragraphs).split('\n').length, 7);
  assert.equal(DOCX_PROFILE.version, '1.1.0');
});

test('normalization collapses spaces but keeps line structure', () => {
  assert.equal(normalizeText('  a   b  \n\n\n c  '), 'a b\n\n c');
  assert.equal(normalizeText('line\u00a0one'), 'line one');
});
