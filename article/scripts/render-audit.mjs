import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'audit/rendered');
const render = process.argv.includes('--render');
const probes = [['pdfinfo', '-v'], ['pdftotext', '-v'], ['pdftoppm', '-v'], ['montage', '-version']];
if (render) probes.push(['libreoffice', '--version']);
for (const [command, flag] of probes) {
  try { execFileSync(command, [flag], { stdio: 'pipe', timeout: 5000 }); }
  catch (error) { throw new Error(`Required local audit tool ${command} is unavailable. See article/README.md; no software is installed automatically.`, { cause: error }); }
}
await mkdir(output, { recursive: true });
const names = (await readdir(resolve(root, 'docs'))).filter(name => name.endsWith('.docx')).sort();
if (render) {
  execFileSync('libreoffice', [`-env:UserInstallation=file:///tmp/soplang-article-lo-${process.pid}`,
    '--headless', '--convert-to', 'pdf', '--outdir', output,
    ...names.map(name => resolve(root, 'docs', name))], { stdio: 'pipe', timeout: 120000 });
}
const geometry = [];
for (const name of names) {
  const stem = name.slice(0, -5), pdf = resolve(output, stem + '.pdf');
  const directory = resolve(output, stem);
  await mkdir(directory, { recursive: true });
  execFileSync('pdftotext', ['-layout', pdf, resolve(output, stem + '.txt')], { timeout: 10000 });
  execFileSync('pdftotext', ['-bbox', pdf, resolve(output, stem + '.xhtml')], { timeout: 10000 });
  const bbox = await readFile(resolve(output, stem + '.xhtml'), 'utf8');
  const pages = [...bbox.matchAll(/<page width="([\d.]+)" height="([\d.]+)">([\s\S]*?)<\/page>/g)];
  let words = 0;
  for (const [index, page] of pages.entries()) {
    const width = Number(page[1]), height = Number(page[2]);
    for (const word of page[3].matchAll(/<word xMin="([\d.-]+)" yMin="([\d.-]+)" xMax="([\d.-]+)" yMax="([\d.-]+)"/g)) {
      words++;
      const [left, top, right, bottom] = word.slice(1).map(Number);
      if (left < 8 || top < 8 || right > width - 8 || bottom > height - 8) {
        throw new Error(`${stem}: possible clipped text on page ${index + 1}`);
      }
    }
  }
  execFileSync('pdftoppm', ['-scale-to', '620', '-png', pdf, resolve(directory, 'page')], { timeout: 30000 });
  // Poppler changes zero-padding when a document crosses a power of ten pages.
  // Select the current canonical names, not older page-01/page-1 duplicates.
  const digits = String(pages.length).length;
  const images = pages.map((_, index) => resolve(directory,
    `page-${String(index + 1).padStart(digits, '0')}.png`));
  execFileSync('montage', [...images, '-tile', '3x', '-geometry', '620x877+6+6',
    '-background', '#dddddd', resolve(output, stem + '-contact.png')], { timeout: 30000 });
  geometry.push({ manuscript: stem, pages: pages.length, extractedWords: words, clippedTextDetected: false });
  console.log(`${stem}: ${pages.length} pages, ${words} extracted words, geometry checked`);
}
await writeFile(resolve(root, 'audit/render-geometry.json'), JSON.stringify(geometry, null, 2) + '\n');
