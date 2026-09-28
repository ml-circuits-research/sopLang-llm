import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { buildDocx } from '../../skills/scientific-article/scripts/build-docx.mjs';

const directory = fileURLToPath(new URL('../submission/', import.meta.url));
for (const name of (await readdir(directory)).filter(name => /^0[1-5]-.+\.json$/.test(name)).sort()) {
  const result = await buildDocx(resolve(directory, name));
  console.log(`${result.file}: ${result.words} source tokens, ${result.tables} tables, ${result.figures.length} figures, ${result.references.length} references`);
}
