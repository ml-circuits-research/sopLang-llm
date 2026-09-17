/**
 * Problem family registry.
 *
 * Families are loaded from `chapter-NN.mjs` modules in this directory. A chapter
 * whose case list grows past the file-size rule of DS001 may be split into
 * `chapter-NN-<part>.mjs` modules: every part declares the same chapter number
 * and contributes its own cases, so the loader concatenates them in file order.
 * A chapter is therefore an independent unit of work: adding a chapter adds
 * files, and no shared registry file has to be edited.
 *
 * A family case must declare the printed template it covers, the folder type it
 * belongs to, its knowledge category, the reference parse that a `modelCall`
 * stage would perform, an independent computation, the answer text the source
 * prints, the SOP Lang computation body, and its explanation lines. Duplicate
 * templates are rejected because two families claiming one template would make
 * the dataset ambiguous.
 *
 * The loader validates the compiled program shape as well: the case metadata
 * must agree with the printed template (`type` is the slugified template), and
 * the compiled instance program must be a self-contained translation of the
 * problem — no `input` wire, because nothing injects a binding into a dataset
 * circuit, and no `modelCall` wire, because the compiler already understood the
 * statement when it generated the program. The instance data lives in literal
 * wires and the computation is deterministic `jsEval` work whose `answer` wire
 * the pilot executes and compares.
 */

import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { parseCircuit } from '../../runtime/parser.mjs';
import { slugify } from '../naming.mjs';

const FILE_PATTERN = /^chapter-(\d{2})(?:-[a-z0-9]+)?\.mjs$/;

function chapterOf(fileName) {
  return Number(fileName.slice('chapter-'.length, 'chapter-'.length + 2));
}

export async function loadFamilies({ only = null } = {}) {
  const directory = new URL('.', import.meta.url);
  const allFiles = readdirSync(directory)
    .filter((name) => FILE_PATTERN.test(name))
    .sort();
  const available = new Set(allFiles.map((name) => chapterOf(name)));
  if (only !== null) {
    for (const chapter of only) {
      if (!available.has(chapter)) {
        throw new Error(
          `No family module implements chapter ${chapter}. Implemented chapters: ${[...available].sort((left, right) => left - right).join(', ')}.`
        );
      }
    }
  }
  const files = allFiles.filter((name) => only === null || only.has(chapterOf(name)));
  const families = new Map();

  for (const file of files) {
    const module = await import(pathToFileURL(new URL(file, directory).pathname).href);
    if (typeof module.chapter !== 'number' || !Array.isArray(module.cases)) {
      throw new Error(`Family module ${file} must export a chapter number and a cases array.`);
    }
    for (const entry of module.cases) {
      if (families.has(entry.template)) {
        throw new Error(`Template "${entry.template}" is declared by more than one family (${file}).`);
      }
      validateCase(entry, file);
      families.set(entry.template, entry);
    }
  }

  return { families };
}

function validateCase(entry, file) {
  const required = ['template', 'type', 'category', 'parse', 'solve', 'render', 'explain'];
  for (const field of required) {
    if (entry[field] === undefined) {
      throw new Error(`Family "${entry.template}" in ${file} is missing "${field}".`);
    }
  }
  const expectedType = slugify(entry.template);
  const publishedType = entry.type.length > expectedType.length ? slugify(entry.type) : entry.type;
  if (publishedType !== expectedType) {
    throw new Error(
      `Family "${entry.template}" in ${file} declares type "${entry.type}", but paths and manifests derive the type from the template as "${expectedType}".`
    );
  }
  if (typeof entry.compute !== 'string') {
    throw new Error(`Family "${entry.template}" in ${file} needs a compute body (the jsEval plan of the answer).`);
  }
  if (entry.program !== undefined) {
    throw new Error(
      `Family "${entry.template}" in ${file} declares a full program, but the dataset circuits are assembled from the parsed values: use compute plus an optional facts body.`
    );
  }
  if (entry.category !== 'knowledge' && entry.category !== 'no-knowledge') {
    throw new Error(`Family "${entry.template}" in ${file} declares an unknown category "${entry.category}".`);
  }
  const wires = parseCircuit(buildProgram(entry, {}), { sourceName: entry.template }).wires;
  const answer = wires.find((wire) => wire.name === 'answer');
  if (answer === undefined) {
    throw new Error(`Family "${entry.template}" in ${file} has no "answer" wire, but the pilot executes and compares that output.`);
  }
  if (answer.command !== 'jsEval') {
    throw new Error(
      `Family "${entry.template}" in ${file} declares its answer wire as "${answer.command}"; the answer must be deterministic jsEval work so the printed answer never reaches a model.`
    );
  }
  for (const wire of wires) {
    if (wire.command === 'input' || wire.command === 'modelCall') {
      throw new Error(
        `Family "${entry.template}" in ${file} declares a "${wire.command}" wire; dataset circuits carry the compiled values as literals and contain no input or modelCall stage.`
      );
    }
  }
  const guard = factKeywordGuardOf(entry);
  if (guard !== null) {
    throw new Error(
      `Family "${entry.template}" in ${file} guards its fact wire with the keyword test "${guard}"; the fact must be structured and consumed by the computation instead of asserted by a substring check.`
    );
  }
}

// `String($facts.<field>).includes("<words>")` is the decorative guard shape:
// it pins the English phrasing of a self-authored definition instead of
// consuming the fact. A legitimate fact lookup reads the value directly, or
// finds an element in a declared list.
const FACT_KEYWORD_GUARD_PATTERN = /String\(\s*\$facts[^)]*\)\s*\.\s*includes\([^)]*\)/;

/**
 * Returns the decorative keyword guard found in a family's compute body, or
 * null when the body consumes its fact without a substring assertion. Exported
 * so the family review can assert the shape without loading a whole book.
 */
export function factKeywordGuardOf(entry) {
  if (entry.category !== 'knowledge') {
    return null;
  }
  const match = FACT_KEYWORD_GUARD_PATTERN.exec(String(entry.compute ?? ''));
  return match === null ? null : match[0];
}

/**
 * The SOP Lang program of a family is the compiled plan of one problem
 * instance: a `literal` wire carries the values the compiling model extracted
 * from the statement, an optional `literal` fact wire carries external
 * knowledge the solution needs, and the `answer` wire performs the
 * deterministic `jsEval` computation.
 *
 * The dataset circuits deliberately contain no `input` wire and no
 * `modelCall` wire. The SOP Lang file is itself the output of a model that
 * already read the problem, so a circuit that asks a model to re-parse its own
 * input would be circular, and an input wire would only re-state data the
 * compiled plan already carries. The runtime keeps both commands for other
 * uses; the dataset contract excludes them.
 */
export function buildProgram(entry, slots) {
  const wires = [];
  const facts = factsBody(entry);
  if (facts !== null) {
    wires.push('@facts literal', facts, '');
  }
  wires.push('@slots literal', JSON.stringify(slots, null, 2), '');
  wires.push('@answer jsEval', entry.compute);
  return `${wires.join('\n')}\n`;
}

/**
 * The fact wire body. A family may declare `facts` either as the literal text
 * itself or as a JSON value, which is serialized here; both forms produce the
 * same wire, so an object literal is never silently ignored.
 */
function factsBody(entry) {
  if (typeof entry.facts === 'string') {
    return entry.facts.trim() === '' ? null : entry.facts;
  }
  if (entry.facts !== undefined && entry.facts !== null) {
    return JSON.stringify(entry.facts);
  }
  return null;
}

/**
 * The plan fingerprint of a case: the deterministic content of its circuit
 * (the fact body and the compute body) with the instance values excluded.
 * A compiled circuit embeds the values it was compiled from, so the circuit
 * text differs between the variants of one template; the fingerprint is what
 * identifies the latent plan across variants, and the report counts distinct
 * plans with it while the holdout uses it to keep near-identical plans on one
 * side of the split.
 */
export function planFingerprint(entry) {
  const facts = factsBody(entry);
  return `${facts === null ? '' : facts}\n===\n${entry.compute}`;
}
