import { test } from 'node:test';
import assert from 'node:assert/strict';

import { getSource } from '../teacher/sources/index.mjs';
import { registerDocxSource } from '../context/sources/docx.mjs';
import { loadFamilies, buildProgram } from '../teacher/families/index.mjs';
import { createRuntime } from '../runtime/kernel.mjs';
import { parseCircuit } from '../runtime/parser.mjs';
import { answerMatches } from '../teacher/naming.mjs';
import { solverText } from '../teacher/statements.mjs';

/**
 * The dv8 structure experiment: every book-family compute body that the static
 * checker flagged as bloated has been restructured into a modular multi-wire
 * plan (`entry.wires`). This test proves the invariant the experiment exists
 * for: a refactored circuit still reproduces its family's oracle on real book
 * instances, and it now carries strictly more wires than the single-answer-body
 * plan it replaced. The oracles (parse/solve/render) are untouched, so any
 * refactor that changed an answer fails here.
 */

const BOOKS = [
  'mathematical-thinking',
  'world-as-a-system',
  'common-sense',
  'logical-reasoning',
  'scientific-reasoning',
  'adult-reasoning',
  'decompose-to-solve'
];

const SAMPLES_PER_FAMILY = 10;

function wireCount(program) {
  return parseCircuit(program, { sourceName: 'dv8-structure' }).wires.length;
}

/** A book, its parsed problems, and its families, loaded once per book. */
async function loadBook(book) {
  const source = getSource(book);
  const problems = source.parse(registerDocxSource(source.path).paragraphs).problems;
  const { families } = await loadFamilies({ book });
  return { problems, families };
}

/** The families of a book that were refactored into a multi-wire plan. */
function refactoredFamilies(families) {
  return [...families.values()].filter((entry) => Array.isArray(entry.wires) && entry.wires.length > 0);
}

for (const book of BOOKS) {
  test(`dv8 structure: ${book} refactored circuits reproduce their oracles`, async () => {
    const { problems, families } = await loadBook(book);
    const runtime = createRuntime();
    const refactored = refactoredFamilies(families);
    assert.ok(refactored.length > 0, `${book}: no refactored families found`);

    for (const entry of refactored) {
      const instances = problems
        .filter((problem) => problem.templateKey === entry.template)
        .slice(0, SAMPLES_PER_FAMILY);
      assert.ok(instances.length > 0, `${entry.template}: the book has no instances to sample`);

      for (const problem of instances) {
        const statement = solverText(entry, problem);
        const parsed = entry.parse(statement);
        const expected = entry.render(entry.solve(parsed));

        const program = buildProgram(entry, parsed);
        const baseline = buildProgram({ ...entry, wires: undefined }, parsed);
        assert.ok(
          wireCount(program) > wireCount(baseline),
          `${entry.template}: the refactored plan did not add wires`
        );

        const result = await runtime.run(program, { outputs: ['answer'] });
        assert.equal(result.status, 'completed', `${entry.template}: circuit ${result.status}:${result.code}`);
        const computed = String(result.outputs.answer);
        assert.ok(
          answerMatches(expected, computed),
          `${entry.template}: oracle says "${expected}", circuit says "${computed}"`
        );
      }
    }
  });
}
