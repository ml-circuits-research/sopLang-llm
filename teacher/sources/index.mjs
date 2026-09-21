/**
 * Source registry of the data pipeline.
 *
 * One entry per seed book that has a parser, a family set, and a dataset
 * directory under `training-data/`. The registry is what makes the pilot
 * multi-book: `pilot.mjs` resolves a book id to its parser, its quarantine
 * rules, its family directory, and the identity rules that shape the writer's
 * output. A source entry also declares the rights status that every derivative
 * inherits, so an unresolved rights status can block export instead of being
 * rediscovered per run.
 *
 * A source chooses its own unit of work. The mathematical book is organized in
 * numbered chapters, so a unit is a chapter number; the world book is
 * organized in fifty reasoning families repeated across four grades, so a unit
 * is a family code (G1...N25). The unit is what the CLI filters on, what the
 * manifest index groups by, and what the loader validates against the family
 * modules that exist.
 */

import {
  BOOK_ID as MATH_BOOK_ID,
  BOOK_PATH as MATH_BOOK_PATH,
  BOOK_QUARANTINE_RULES as MATH_QUARANTINE_RULES,
  normalizePrintedAnswer as normalizeMathAnswer,
  parseMathThinking
} from './math-thinking.mjs';
import {
  BOOK_ID as WORLD_BOOK_ID,
  BOOK_PATH as WORLD_BOOK_PATH,
  BOOK_QUARANTINE_RULES as WORLD_QUARANTINE_RULES,
  parseWorldSystem
} from './world-system.mjs';
import {
  BOOK_ID as COMMON_SENSE_BOOK_ID,
  BOOK_PATH as COMMON_SENSE_BOOK_PATH,
  BOOK_QUARANTINE_RULES as COMMON_SENSE_QUARANTINE_RULES,
  parseCommonSense
} from './common-sense.mjs';
import {
  BOOK_ID as LOGICAL_BOOK_ID,
  BOOK_PATH as LOGICAL_BOOK_PATH,
  BOOK_QUARANTINE_RULES as LOGICAL_QUARANTINE_RULES,
  parseLogicalReasoning
} from './logical-reasoning.mjs';
import {
  BOOK_ID as SCIENTIFIC_BOOK_ID,
  BOOK_PATH as SCIENTIFIC_BOOK_PATH,
  BOOK_QUARANTINE_RULES as SCIENTIFIC_QUARANTINE_RULES,
  parseScientificReasoning
} from './scientific-reasoning.mjs';
import {
  BOOK_ID as ADULT_BOOK_ID,
  BOOK_PATH as ADULT_BOOK_PATH,
  BOOK_QUARANTINE_RULES as ADULT_QUARANTINE_RULES,
  parseAdultReasoning
} from './adult-reasoning.mjs';
import {
  BOOK_ID as DECOMPOSE_BOOK_ID,
  BOOK_PATH as DECOMPOSE_BOOK_PATH,
  BOOK_QUARANTINE_RULES as DECOMPOSE_QUARANTINE_RULES,
  parseDecomposeToSolve
} from './decompose-to-solve.mjs';
import { PROCEDURAL_SOURCES } from './procedural.mjs';

export const SOURCES = Object.freeze([
  Object.freeze({
    id: MATH_BOOK_ID,
    path: MATH_BOOK_PATH,
    parse: parseMathThinking,
    quarantineRules: MATH_QUARANTINE_RULES,
    unitLabel: 'chapter',
    unitNoun: 'chapters',
    unitKind: 'number',
    unitOf: (problem) => problem.chapter,
    manifestFile: (unit) => `chapter-${String(unit).padStart(2, '0')}.md`,
    secondary: null,
    // The book's five Romanian polarity answers are shipped as their English
    // equivalents; the mapping is the source's own declaration.
    normalizePrintedAnswer: normalizeMathAnswer,
    rights: 'project-owned seed book, research use',
    permittedUse: 'internal training and evaluation; no public redistribution of source text'
  }),
  Object.freeze({
    id: WORLD_BOOK_ID,
    path: WORLD_BOOK_PATH,
    parse: parseWorldSystem,
    quarantineRules: WORLD_QUARANTINE_RULES,
    unitLabel: 'family',
    unitNoun: 'families',
    unitKind: 'code',
    unitOf: (problem) => problem.familyCode,
    manifestFile: (unit) => `family-${String(unit).toLowerCase()}.md`,
    secondary: Object.freeze({
      label: 'grade',
      noun: 'grades',
      of: (problem) => problem.grade
    }),
    rights: 'project-owned seed book, research use',
    permittedUse: 'internal training and evaluation; no public redistribution of source text'
  }),
  Object.freeze({
    id: COMMON_SENSE_BOOK_ID,
    path: COMMON_SENSE_BOOK_PATH,
    parse: parseCommonSense,
    quarantineRules: COMMON_SENSE_QUARANTINE_RULES,
    unitLabel: 'template',
    unitNoun: 'templates',
    unitKind: 'number',
    unitOf: (problem) => problem.templateOrdinal,
    manifestFile: (unit) => `template-${String(unit).padStart(2, '0')}.md`,
    secondary: null,
    rights: 'project-owned seed book, research use',
    permittedUse: 'internal training and evaluation; no public redistribution of source text'
  }),
  Object.freeze({
    id: LOGICAL_BOOK_ID,
    path: LOGICAL_BOOK_PATH,
    parse: parseLogicalReasoning,
    quarantineRules: LOGICAL_QUARANTINE_RULES,
    unitLabel: 'section',
    unitNoun: 'sections',
    unitKind: 'number',
    unitOf: (problem) => problem.sectionOrdinal,
    manifestFile: (unit) => `section-${String(unit).padStart(3, '0')}.md`,
    secondary: null,
    rights: 'project-owned seed book, research use',
    permittedUse: 'internal training and evaluation; no public redistribution of source text'
  }),
  Object.freeze({
    id: SCIENTIFIC_BOOK_ID,
    path: SCIENTIFIC_BOOK_PATH,
    parse: parseScientificReasoning,
    quarantineRules: SCIENTIFIC_QUARANTINE_RULES,
    unitLabel: 'form',
    unitNoun: 'forms',
    unitKind: 'number',
    unitOf: (problem) => problem.formOrdinal,
    manifestFile: (unit) => `form-${String(unit).padStart(2, '0')}.md`,
    secondary: null,
    rights: 'project-owned seed book, research use',
    permittedUse: 'internal training and evaluation; no public redistribution of source text'
  }),
  Object.freeze({
    id: ADULT_BOOK_ID,
    path: ADULT_BOOK_PATH,
    parse: parseAdultReasoning,
    quarantineRules: ADULT_QUARANTINE_RULES,
    unitLabel: 'section',
    unitNoun: 'sections',
    unitKind: 'number',
    unitOf: (problem) => problem.sectionOrdinal,
    manifestFile: (unit) => `section-${String(unit).padStart(3, '0')}.md`,
    secondary: null,
    rights: 'project-owned seed book, research use',
    permittedUse: 'internal training and evaluation; no public redistribution of source text'
  }),
  Object.freeze({
    id: DECOMPOSE_BOOK_ID,
    path: DECOMPOSE_BOOK_PATH,
    parse: parseDecomposeToSolve,
    quarantineRules: DECOMPOSE_QUARANTINE_RULES,
    unitLabel: 'pattern',
    unitNoun: 'patterns',
    unitKind: 'number',
    unitOf: (problem) => problem.patternOrdinal,
    manifestFile: (unit) => `pattern-${String(unit).padStart(2, '0')}.md`,
    secondary: null,
    rights: 'project-owned seed book, research use',
    permittedUse: 'internal training and evaluation; no public redistribution of source text'
  }),
  ...PROCEDURAL_SOURCES
]);

export const DEFAULT_SOURCE_ID = MATH_BOOK_ID;

export function sourceIds() {
  return SOURCES.map((source) => source.id);
}

export function getSource(id) {
  const source = SOURCES.find((candidate) => candidate.id === id);
  if (source === undefined) {
    throw new Error(`Unknown book "${id}". Known books: ${sourceIds().join(', ')}.`);
  }
  return source;
}
