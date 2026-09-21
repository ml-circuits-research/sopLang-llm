/**
 * Loader and validator for procedural sources.
 *
 * A procedural source is a registered source whose statements come from its own
 * generator (DS008, "Procedural source families"). This module is the analogue
 * of `teacher/families/index.mjs` for those sources: it imports a generator
 * module, validates every family, and returns the family map the pilot keys a
 * generated problem by, so the rest of the pipeline compiles a generated
 * instance exactly like a book problem.
 *
 * The validation is strict on purpose. A generator is code that writes training
 * statements, so a family that cannot parse its own statements, whose oracle
 * returns an empty answer, or whose identity is not a slug would produce a
 * dataset row that no verifier could trace back — the failures belong at load
 * time, before a single file is written.
 */

import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { slugify } from '../naming.mjs';
import { sampleInstances } from './random.mjs';

export const PROCEDURAL_DIRECTORY = fileURLToPath(new URL('.', import.meta.url));

const DIFFICULTY_AXES = Object.freeze(['subproblems', 'dependencyDepth', 'branching', 'irrelevantInformation', 'symbolicShare']);
const FAMILY_FUNCTIONS = Object.freeze(['sample', 'statement', 'parse', 'oracle', 'explain']);

/** One validated family, with the plan shape it fixes. */
export function validateProceduralFamily(family, where) {
  if (family === null || typeof family !== 'object') {
    throw new Error(`${where} must be an object`);
  }
  for (const field of ['id', 'name', 'type', 'category', 'compute', 'difficulty']) {
    if (family[field] === undefined) {
      throw new Error(`${where} is missing ${field}`);
    }
  }
  for (const field of FAMILY_FUNCTIONS) {
    if (typeof family[field] !== 'function') {
      throw new Error(`${where} must declare ${field} as a function`);
    }
  }
  if (family.type !== slugify(family.name)) {
    throw new Error(`${where}: the type "${family.type}" must equal the slug of the name "${family.name}"`);
  }
  if (family.id !== family.type) {
    throw new Error(`${where}: the id "${family.id}" must equal the type "${family.type}"`);
  }
  if (!['knowledge', 'no-knowledge'].includes(family.category)) {
    throw new Error(`${where}: the category must be knowledge or no-knowledge`);
  }
  if (typeof family.compute !== 'string' || family.compute.trim() === '') {
    throw new Error(`${where}: compute must be a non-empty circuit body`);
  }
  for (const axis of DIFFICULTY_AXES) {
    if (typeof family.difficulty[axis] !== 'number') {
      throw new Error(`${where}: the difficulty vector is missing the numeric axis ${axis}`);
    }
  }
  return family;
}

/** A family whose own smoke instance fails to round-trip is a generator defect, not a data defect. */
export function smokeFamily(family, { seed }) {
  const [instance] = sampleInstances({ family, seed, count: 1 });
  if (instance === undefined) {
    throw new Error(`${family.id}: the sampler produced no instance`);
  }
  const reparsed = family.parse(instance.statement);
  if (JSON.stringify(reparsed) !== JSON.stringify(instance.slots)) {
    throw new Error(`${family.id}: the reference parse does not recover the sampled values`);
  }
  const answer = family.oracle(instance.slots);
  if (typeof answer !== 'string' || answer.trim() === '') {
    throw new Error(`${family.id}: the oracle returned an empty answer`);
  }
  if (instance.statement.includes(answer)) {
    throw new Error(`${family.id}: the statement carries its own answer`);
  }
  return { instance, answer };
}

/**
 * Imports a generator module and returns its families keyed by the name the
 * pilot keys a problem by, plus the metadata of the generator that produced
 * them. `source` is the registry entry: it names the module, the version the
 * dataset records, and the seed its instances are sampled from.
 */
export async function loadProceduralFamilies({ source, only = null, smoke = true }) {
  const modulePath = source.generator.startsWith('/') ? source.generator : join(PROCEDURAL_DIRECTORY, source.generator);
  const module = await import(pathToFileURL(modulePath).href);
  if (module.sourceId !== source.id) {
    throw new Error(`${source.generator} declares sourceId "${module.sourceId}", but the registry entry is "${source.id}"`);
  }
  if (module.generatorVersion !== source.generatorVersion) {
    throw new Error(`${source.generator} declares generatorVersion "${module.generatorVersion}", but the registry entry expects "${source.generatorVersion}"`);
  }
  if (!Array.isArray(module.families) || module.families.length === 0) {
    throw new Error(`${source.generator} must export a non-empty families array`);
  }
  const families = new Map();
  const ordered = [];
  for (const candidate of module.families) {
    const family = validateProceduralFamily(candidate, `${source.generator} family ${candidate?.id ?? candidate?.name ?? '?'}`);
    if (only !== null && !only.has(family.id)) {
      continue;
    }
    if (families.has(family.name)) {
      throw new Error(`the family name "${family.name}" is declared twice in ${source.generator}`);
    }
    if (smoke) {
      smokeFamily(family, { seed: source.seed });
    }
    families.set(family.name, family);
    ordered.push(family);
  }
  if (families.size === 0) {
    throw new Error(`no family of ${source.generator} matched the requested units`);
  }
  return { families, ordered, generator: { id: source.id, version: module.generatorVersion, seed: source.seed } };
}
