/**
 * Problem family registry.
 *
 * Families are loaded from the directory of their book: `chapter-NN.mjs`
 * modules for the mathematical book and `family-<code>.mjs` modules for the
 * world book. A unit whose case list grows past the file-size rule of DS001 may
 * be split into `<unit>-<part>.mjs` modules: every part declares the same unit
 * and contributes its own cases, so the loader concatenates them in file order.
 * A unit is therefore an independent unit of work: adding a chapter or a
 * reasoning family adds files, and no shared registry file has to be edited.
 *
 * A family case must declare the printed template it covers, the folder type it
 * belongs to, its knowledge category, the reference parse that a modelCall
 * stage would perform, an independent computation, the answer text the source
 * prints, the SOP Lang computation body, and its explanation lines. Duplicate
 * templates are rejected because two families claiming one template would make
 * the dataset ambiguous.
 *
 * A case may declare three optional fields. `clarification` adds a sentence to
 * the solver-visible statement when the source's own task leaves a rule
 * implicit (which case of a family the item is, how ties are enumerated).
 * `sharedPremise` materializes the premise a statement hands to an earlier
 * problem. `printedAnswerStatus` with `verifyPrinted` and `printedAnswerReason`
 * ships the computed answer instead of the printed one for a template whose
 * statement determines the computation but not the printed text.
 *
 * The loader validates the compiled program shape as well: the case metadata
 * must agree with the printed template (`type` is the slugified template), the
 * compiled instance program must be a self-contained translation of the
 * problem — no `input` wire, because nothing injects a binding into a dataset
 * circuit, and no `modelCall` wire, because the compiler already understood the
 * statement when it generated the program — and the `answer` wire must carry
 * the probe harness of `probes.mjs`, so every dataset circuit asserts its
 * inputs and its output inside its `jsEval` stage. The instance data lives in
 * literal wires and the computation is deterministic `jsEval` work whose
 * `answer` wire the pilot executes and compares.
 */

import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { parseCircuit } from '../../runtime/parser.mjs';
import { slugify } from '../naming.mjs';
import { parseProfile } from '../../runtime/profile.mjs';
import { getSource } from '../sources/index.mjs';
import { answerBody, probeFindings } from './probes.mjs';

const FAMILY_FILES = new Map([
  ['mathematical-thinking', /^chapter-(\d{2})(?:-[a-z0-9]+)?\.mjs$/],
  ['world-as-a-system', /^family-([a-z]\d{2})(?:-[a-z0-9]+)?\.mjs$/],
  ['common-sense', /^template-(\d{2})(?:-[a-z0-9]+)?\.mjs$/],
  ['logical-reasoning', /^section-(\d{3})(?:-[a-z0-9]+)?\.mjs$/],
  ['scientific-reasoning', /^form-(\d{2})(?:-[a-z0-9]+)?\.mjs$/],
  ['adult-reasoning', /^section-(\d{3})(?:-[a-z0-9]+)?\.mjs$/],
  ['decompose-to-solve', /^pattern-(\d{2})(?:-[a-z0-9]+)?\.mjs$/]
]);

function unitOfFile(book, fileName) {
  const match = FAMILY_FILES.get(book).exec(fileName);
  if (book === 'world-as-a-system') {
    return `${match[1][0]}${Number(match[1].slice(1))}`.toUpperCase();
  }
  return Number(match[1]);
}

export async function loadFamilies({ book = 'mathematical-thinking', only = null } = {}) {
  const source = getSource(book);
  const pattern = FAMILY_FILES.get(book);
  if (pattern === undefined) {
    throw new Error(`No family file layout is registered for book "${book}".`);
  }
  const directory = new URL(`./${book}/`, import.meta.url);
  const allFiles = readdirSync(directory)
    .filter((name) => pattern.test(name))
    .sort();
  const available = new Set(allFiles.map((name) => unitOfFile(book, name)));
  if (only !== null) {
    for (const unit of only) {
      if (!available.has(unit)) {
        throw new Error(
          `No family module implements ${source.unitLabel} ${unit}. Implemented ${source.unitNoun}: ${[...available].sort().join(', ')}.`
        );
      }
    }
  }
  const files = allFiles.filter((name) => only === null || only.has(unitOfFile(book, name)));
  const families = new Map();
  const units = new Set();

  for (const file of files) {
    const module = await import(pathToFileURL(new URL(file, directory).pathname).href);
    if ((typeof module.unit !== 'number' && typeof module.unit !== 'string') || !Array.isArray(module.cases)) {
      throw new Error(`Family module ${book}/${file} must export a unit and a cases array.`);
    }
    const expectedUnit = unitOfFile(book, file);
    if (String(module.unit) !== String(expectedUnit)) {
      throw new Error(
        `Family module ${book}/${file} declares unit ${JSON.stringify(module.unit)}, but its file name names ${JSON.stringify(expectedUnit)}.`
      );
    }
    units.add(module.unit);
    for (const entry of module.cases) {
      if (families.has(entry.template)) {
        throw new Error(`Template "${entry.template}" is declared by more than one family (${file}).`);
      }
      validateCase(entry, file);
      families.set(entry.template, entry);
    }
  }

  if (only !== null) {
    for (const unit of only) {
      if (!units.has(unit)) {
        throw new Error(`Family module for ${source.unitLabel} ${unit} was not loaded.`);
      }
    }
  }

  return { families, units };
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
  if (entry.clarification !== undefined) {
    const usable = typeof entry.clarification === 'function' || (typeof entry.clarification === 'string' && entry.clarification.trim() !== '');
    if (!usable) {
      throw new Error(`Family "${entry.template}" in ${file} declares an empty clarification; declare the text a solver receives or drop the field.`);
    }
  }
  if (
    entry.printedAnswerStatus !== undefined &&
    typeof entry.printedAnswerStatus !== 'function' &&
    !PRINTED_ANSWER_STATUSES.has(entry.printedAnswerStatus)
  ) {
    throw new Error(
      `Family "${entry.template}" in ${file} declares an unknown printedAnswerStatus "${entry.printedAnswerStatus}"; use ${[...PRINTED_ANSWER_STATUSES].join(', ')} or a function of the parsed values and the solution.`
    );
  }
  if (entry.printedAnswerStatus !== undefined && entry.printedAnswerStatus !== 'match' && typeof entry.printedAnswerStatus !== 'function') {
    if (typeof entry.verifyPrinted !== 'function') {
      throw new Error(
        `Family "${entry.template}" in ${file} ships a computed answer instead of the printed one, so it must declare verifyPrinted(parsed, solution, printed) and prove the printed answer has the declared status.`
      );
    }
    if (typeof entry.printedAnswerReason !== 'string' || entry.printedAnswerReason.trim() === '') {
      throw new Error(
        `Family "${entry.template}" in ${file} ships a computed answer instead of the printed one, so it must declare printedAnswerReason: the sentence the dataset report records for that case.`
      );
    }
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
/**
 * The statuses a family may declare for the printed answer of its template.
 * `match` is the default: the printed answer is the value the circuit must
 * reproduce. `alternative` means the task admits several valid answers and the
 * source prints one of them; `inconsistent` means the printed value contradicts
 * the statement's own values. Both ship the computed answer under
 * `computed_verified` and keep the printed answer as reference material.
 */
const PRINTED_ANSWER_STATUSES = new Set(['match', 'alternative', 'inconsistent']);

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
 * deterministic `jsEval` computation. The answer body is the family
 * computation wrapped in the probe harness of `probes.mjs`, so every dataset
 * circuit asserts its slots and its output with `probe(...)` calls.
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
  // Intermediate wires of a decomposition plan (DS008, "Additional circuit
  // shapes"): each one publishes a named value the answer wire reads through
  // `$name`. A `jsEval` stage carries the same probe harness as the answer
  // wire, so no stage can publish an unchecked value; a declarative stage
  // (`graphPath`, `aggregate`, or `fraction`) carries its own body, which the
  // command validates and executes, so its contract is asserted by the command
  // rather than by probe text in the target.
  const declaredContainers = new Set();
  for (const wire of entry.wires ?? []) {
    // Container wires carry their profile body verbatim; the declarative
    // commands' own contracts validate it at execution, and buildProgram only
    // asserts the structural order the epoch rule needs: a mutation or a filter
    // may only name a container that an earlier wire declared, so the runtime
    // always reads a declared store.
    if (wire.command === 'container') {
      declaredContainers.add(wire.name);
    } else if (['containerAdd', 'containerUpsert', 'containerRemove', 'containerFilter'].includes(wire.command)) {
      let referenced = null;
      try {
        const profile = parseProfile(wire.body);
        referenced = wire.command === 'containerFilter'
          ? (typeof profile.source === 'string' ? profile.source.replace(/^\$/, '') : null)
          : (typeof profile.target === 'string' ? profile.target : null);
      } catch {
        referenced = null;
      }
      if (referenced !== null && !declaredContainers.has(referenced)) {
        throw new Error(`the intermediate wire ${wire.name} (${wire.command}) names ${referenced} before any container declares it`);
      }
    }
    wires.push(`@${wire.name} ${wire.command}`, wire.command === 'jsEval' ? answerBody(wire.body) : String(wire.body), '');
  }
  wires.push('@answer jsEval', answerBody(entry.compute));
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
  // The fingerprint is the plan identity: the fact body, every intermediate wire
  // (name, command, body, in order), and the compute body, without the instance
  // values. A family with no intermediate wires produces exactly the two-section
  // string it produced before, so widening the shape does not renumber the
  // fingerprints of the shipped suite.
  const parts = [facts === null ? '' : facts];
  for (const wire of entry.wires ?? []) {
    parts.push(`${wire.name}\u0000${wire.command}\u0000${wire.body}`);
  }
  parts.push(entry.compute);
  return parts.join('\n===\n');
}
