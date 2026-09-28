import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, cp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { unzip } from './zip.mjs';
import { renderCitations } from './markdown.mjs';

test('a copied skill builds an editable document from another working directory', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'scientific-article-test-'));
  try {
    await cp(new URL('../', import.meta.url), join(directory, 'skill'), { recursive: true });
    await writeFile(join(directory, 'source.md'), '# A & B\n\n## Abstract\n\nA claim [@verified].\n\nKeywords: one; two\n\n## 1. Evidence\n\nTable 1. Native table.\n\n| Input | Output |\n| --- | --- |\n| <x> | 4 |\n\n<!-- REFERENCES -->\n');
    await writeFile(join(directory, 'refs.json'), JSON.stringify({ verified: {
      citation: 'Example, 2026', sort: 'Example 2026', entry: 'Example (2026). Verified source.', url: 'https://example.org/source'
    } }));
    await writeFile(join(directory, 'job.json'), JSON.stringify({ source: 'source.md',
      output: 'result.docx', bibliography: 'refs.json', citationStyle: 'numbered' }));
    execFileSync(process.execPath, [join(directory, 'skill/scripts/build-docx.mjs'), join(directory, 'job.json')],
      { cwd: tmpdir(), timeout: 10000 });
    const files = unzip(await readFile(join(directory, 'result.docx')));
    const xml = files['word/document.xml'].toString();
    assert.match(xml, /A &amp; B/);
    assert.match(xml, /&lt;x&gt;/);
    assert.equal((xml.match(/<w:tbl>/g) ?? []).length, 1);
    assert.match(xml, /A claim \[1\]/);
    assert.match(files['word/_rels/document.xml.rels'].toString(), /https:\/\/example.org\/source/);
    assert.doesNotMatch(files['docProps/core.xml'].toString(), /creator|lastModifiedBy/);
    assert.doesNotMatch(await readFile(join(directory, 'result.md'), 'utf8'), /\[@|<!-- REFERENCES/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('an unknown reference or unsupported citation style cannot silently reach publication', () => {
  assert.throws(() => renderCitations('A claim [@missing].\n<!-- REFERENCES -->', {}), /Unknown reference/);
  assert.throws(() => renderCitations('<!-- REFERENCES -->', {}, 'unrecognized'), /Unknown citation style/);
});
