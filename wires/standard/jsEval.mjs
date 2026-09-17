import { findValueReferences } from '../../runtime/dependencies.mjs';
import { applyCircuitResult } from '../../runtime/metaprogramming.mjs';

/**
 * `jsEval` executes JavaScript over declared `$wire` dependencies.
 *
 * The universal deterministic escape hatch. Sorting, counting, joining,
 * filtering, aggregating, validating, and serializing belong here whenever the
 * remaining subproblem is mechanical. The body runs as an async function body
 * with the declared dependencies as parameters, and a `circuit` parameter gives
 * access to the transactional graph API without exposing a hidden value read.
 *
 * Execution happens in an isolated guest realm, so dependency values arrive as
 * copies and the body cannot reach the host process, the module system, or a
 * stored value. A body that stages circuit operations must commit them; an
 * uncommitted transaction never publishes. The JavaScript time a body consumes
 * is charged against the request budget.
 */

const CIRCUIT_API_PATTERN = /(^|[^.\w$])circuit\b/;

export const jsEvalCommand = {
  name: 'jsEval',
  version: '1.1.0',
  effectClass: 'pure',
  mayStage: ['structural_transaction', 'container_patch'],
  determinism: 'deterministic',
  manifest: {
    name: 'jsEval',
    version: '1.1.0',
    summary: 'Execute JavaScript over declared $wire dependencies; may stage graph or container transactions through the runtime API.',
    whenToUse: 'Use whenever the remaining subproblem is mechanical: arithmetic, sorting, joins, filters, aggregation, validation, serialization.',
    whenNotToUse: 'Do not use to make semantic judgments about text; use modelCall for those.',
    bodyFormat: 'javascript',
    syntax: '@out jsEval\nreturn $rows.filter(row => row.enabled === true);',
    inputContract: {
      requiredDependencies: ['value'],
      notes: 'All referenced values must appear as $wire dependencies outside strings and comments.'
    },
    outputSchema: { type: 'any' },
    effectClass: 'pure',
    determinism: 'deterministic',
    examples: [
      {
        source: '@selected jsEval\nreturn $rows.filter(row => row.enabled === true);',
        explanation: 'Filters a rows value by a boolean field.'
      },
      {
        source: '@expand jsEval\nfor (const group of $groups) {\n  circuit.addWire(`score_${group.id}`, { command: "jsEval", body: "return 1;" });\n}\nreturn circuit.commit({ result: $groups.length });',
        explanation: 'Stages new wires through the transactional circuit API and commits them.'
      }
    ]
  },
  analyze({ body }) {
    const references = findValueReferences(body);
    return {
      values: references.map((reference) => reference.name),
      structural: [],
      containerReads: [],
      containerWrites: [],
      target: null
    };
  },
  validate() {
    return { ok: true };
  },
  async execute(ctx) {
    const result = await ctx.javascript.sandbox.invoke({
      body: ctx.body,
      values: ctx.values,
      wire: ctx.wire,
      budget: ctx.budget,
      definitions: mentionsCircuitApi(ctx.body) ? ctx.definitionsSnapshot() : null
    });
    chargeJavaScriptTime(ctx, result.durationMs);
    if (ctx.circuit !== undefined && ctx.circuit !== null) {
      applyCircuitResult({
        transaction: ctx.circuit,
        result,
        wire: ctx.wire,
        recordStructuralReads: ctx.recordStructuralReads ?? null
      });
    }
    return result.value;
  }
};

export function mentionsCircuitApi(body) {
  return CIRCUIT_API_PATTERN.test(String(body ?? ''));
}

export function chargeJavaScriptTime(ctx, durationMs) {
  if (ctx.budget === undefined || ctx.budget === null) {
    return;
  }
  ctx.budget.charge('jsTimeMs', Math.max(1, Math.ceil(durationMs)), { wire: ctx.wire });
}
