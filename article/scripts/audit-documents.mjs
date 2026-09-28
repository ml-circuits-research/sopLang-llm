import assert from 'node:assert/strict';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { unzip } from '../../skills/scientific-article/scripts/zip.mjs';
import { parseMarkdown } from '../../skills/scientific-article/scripts/markdown.mjs';
import { auditTableValues } from './audit-table-values.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const article = resolve(root, 'article');
const results = JSON.parse(await readFile(resolve(article, 'evidence/results.json')));
const hashes = JSON.parse(await readFile(resolve(article, 'evidence/source-hashes.json')));
const baselineHashes = JSON.parse(await readFile(resolve(article, 'evidence/baseline-source-hashes.json')));
const baselines = JSON.parse(await readFile(resolve(article, 'evidence/baseline-results.json')));
const allHashes = [...new Map([...hashes, ...baselineHashes].map(row => [row.path, row])).values()];
for (const record of allHashes) {
  const bytes = await readFile(resolve(root, record.path));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256, `Changed source: ${record.path}`);
}
const bibliography = JSON.parse(await readFile(resolve(article, 'evidence/bibliography.json')));
const reports = [];
for (const filename of (await readdir(resolve(article, 'manuscripts'))).filter(name => name.endsWith('.md')).sort()) {
  const name = filename.slice(0, -3);
  const source = await readFile(resolve(article, 'manuscripts', filename), 'utf8');
  const blocks = parseMarkdown(source);
  assert.doesNotMatch(source, /\bexp-\d+|\bdv\d+\b|checkpoint-\d+/, `${name}: unexplained archive labels in manuscript`);
  assert.match(source, /```sop\n/, `${name}: missing complete language example`);
  assert.ok(source.includes('convention') && source.includes('dependency') && source.includes('command'), `${name}: language conventions missing`);
  const abstract = source.split('## Abstract\n\n')[1].split('\n\n')[0];
  const abstractWords = abstract.trim().split(/\s+/).length;
  assert.ok(abstractWords >= 150 && abstractWords <= 250, `${name}: abstract length`);
  const keywords = source.match(/^Keywords: (.+)$/m)[1].split(';');
  assert.ok(keywords.length >= 4 && keywords.length <= 6);
  const citations = [...new Set([...source.matchAll(/\[@([^\]]+)\]/g)].map(match => match[1]))];
  for (const key of citations) assert.ok(bibliography[key], `${name}: unknown citation ${key}`);
  const paragraphs = blocks.filter(block => block.type === 'paragraph');
  const narrative = paragraphs.filter(block => !/^(Figure|Table) \d+\./.test(block.text)).map(block => block.text).join('\n');
  for (const label of ['Figure', 'Table']) {
    const captions = paragraphs.filter(block => new RegExp(`^${label} \\d+\\.`).test(block.text));
    captions.forEach((block, index) => {
      assert.ok(block.text.startsWith(`${label} ${index + 1}.`), `${name}: ${label} numbering`);
      assert.ok(narrative.includes(`${label} ${index + 1}`), `${name}: missing ${label} callout`);
    });
  }
  const quantitativeRowsChecked = auditTableValues(name, blocks.filter(block => block.type === 'table'), results, baselines);
  if (/^(01|02|04)/.test(name)) assert.doesNotMatch(source, /77\.2%|544\/705|66\/100|\b17B\b/);
  const bytes = await readFile(resolve(article, 'docs', name + '.docx'));
  const zip = unzip(bytes);
  const xml = zip['word/document.xml'].toString();
  const manifest = JSON.parse(await readFile(resolve(article, 'docs', name + '.build.json')));
  assert.equal(createHash('sha256').update(source).digest('hex'), manifest.sourceSha256, `${name}: DOCX source is stale`);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), manifest.sha256);
  assert.equal((xml.match(/<w:tbl>/g) ?? []).length, blocks.filter(block => block.type === 'table').length);
  assert.equal((xml.match(/<w:drawing>/g) ?? []).length, blocks.filter(block => block.type === 'figure').length);
  assert.doesNotMatch(xml, /\[@[a-z]|TODO|FIXME|PLACEHOLDER/);
  assert.doesNotMatch(zip['docProps/core.xml'].toString(), /creator|lastModifiedBy/);
  const final = await readFile(resolve(article, 'docs', name + '.md'), 'utf8');
  assert.doesNotMatch(final, /<!-- REFERENCES -->|\[@[a-z]/);
  let pages;
  const pdf = resolve(article, 'audit/rendered', name + '.pdf');
  try {
    const info = execFileSync('pdfinfo', [pdf], { encoding: 'utf8', timeout: 10000 });
    pages = Number(info.match(/Pages:\s+(\d+)/)[1]);
    execFileSync('pdftotext', ['-layout', pdf, pdf.replace(/\.pdf$/, '.txt')], { timeout: 10000 });
    const text = await readFile(pdf.replace(/\.pdf$/, '.txt'), 'utf8');
    assert.ok(text.includes('References'), `${name}: missing rendered bibliography`);
    assert.doesNotMatch(text, /\uFFFD/);
    assert.ok(text.length > source.length * 0.8, `${name}: possible rendered text loss`);
  } catch (error) {
    throw new Error(`PDF audit requires an existing rendered PDF and Poppler tools for ${name}; see article/README.md.`, { cause: error });
  }
  reports.push({ manuscript: name, abstractWords, keywords: keywords.length, references: citations.length, quantitativeRowsChecked,
    tables: manifest.tables, figures: manifest.figures.length, pages, sha256: manifest.sha256 });
}
assert.equal(reports.length, 5);
const report = { auditedOn: '2026-09-28', sourceFilesChecked: allHashes.length,
  archivedItemRecords: results.recordCount, reports,
  scope: 'Automated consistency checks. Scientific argument and visual layout also require the recorded manual review.' };
await writeFile(resolve(article, 'audit/document-checks.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
