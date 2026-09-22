import { findValueReferences } from '../../runtime/dependencies.mjs';
import { SopError } from '../../runtime/errors.mjs';
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
 * The command owns its input contract, so a compiled plan does not restate it.
 * Version 2.1 adds the probe helper: the sandbox defines
 * `probe(condition, message)` in the guest scope, so a body writes its own domain
 * assertions as bare `probe(...)` calls and never carries the helper's definition —
 * that text was identical in 7745 of 8735 targets and belonged to the command, not
 * to the plan. A body that still declares its own helper (an artifact trained before
 * this change) shadows the sandbox binding and runs unchanged.
 * `version 2` asserts, before the body runs, that every dependency value is
 * defined, that a dependency carrying a compiled `slots` record is a non-empty
 * object, and after the body runs that it produced a value that is not `null`,
 * `undefined`, or the empty string. Both failures are structured
 * `execution_error`s naming the wire and the contract clause, which is what the
 * dataset previously obtained from a probe preamble repeated inside every
 * generated target: 18.96% of the target tokens of the shipped suite were that
 * fixed preamble, and a preamble the model must emit token by token is work the
 * command can do once for every circuit (DS004, DS008 "Compiled plan profile").
 * The contract covers the fixable, generic cases only; a family that must assert
 * something about its own domain still writes its own assertion in the body.
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
  version: '2.1.0',
  effectClass: 'pure',
  mayStage: ['structural_transaction', 'container_patch'],
  determinism: 'deterministic',
  manifest: {
    name: 'jsEval',
    version: '2.1.0',
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
    assertInputContract({ values: ctx.values, wire: ctx.wire });
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
    assertOutputContract({ value: result.value, wire: ctx.wire, committed: result.committed === true });
    return result.value;
  }
};

/**
 * The input contract of `jsEval`, checked before the body runs.
 *
 * A dependency the body declares must carry a defined value, and a dependency
 * that is a compiled `slots` record must be a non-empty object. Both are
 * properties of every dataset circuit, so asserting them here rather than inside
 * every generated target removes a fixed preamble from the trained form without
 * losing the guarantee: a malformed input still ends the run as a structured
 * `execution_error` instead of letting the body compute on it.
 */
export function assertInputContract({ values, wire }) {
  for (const [name, value] of Object.entries(values ?? {})) {
    if (value === undefined) {
      throw new SopError('execution_error', `Wire "${wire}" reads "$${name}", which has no value`, {
        wire,
        contract: 'dependency_defined'
      });
    }
    // A compiled record is an object with at least one field. An array or a
    // primitive under the name `slots` is not a compiled record, so carrying one is
    // the same defect as carrying an empty object: the check applies whenever the
    // name is declared, not only when the body happens to read it, which is what a
    // reader of the circuit expects and what the preamble this contract replaces did.
    if (name !== 'slots') {
      continue;
    }
    if (value !== null && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0) {
      continue;
    }
    throw new SopError('execution_error', `Wire "${wire}" reads "$slots", which must carry the compiled record as a non-empty object`, {
      wire,
      contract: 'slots_not_empty'
    });
  }
}

/**
 * The output contract of `jsEval`, checked after the body runs.
 *
 * `null`, `undefined`, and the empty string are the values a downstream wire
 * reads as "nothing was computed"; publishing one turns a computation failure
 * into a wrong answer that looks like a value, so they end the run instead.
 * `0` and `false` are values, not absences, and pass.
 *
 * A wire that staged a structural transaction is exempt: a body may end in
 * `circuit.commit(...)`, which publishes through the transaction and returns
 * nothing at all, so an absent return is that shape rather than a failed
 * computation.
 */
export function assertOutputContract({ value, wire, committed = false }) {
  if (committed) {
    return;
  }
  if (value === undefined || value === null || value === '') {
    throw new SopError('execution_error', `Wire "${wire}" produced an empty value`, {
      wire,
      contract: 'non_empty_result'
    });
  }
}

export function mentionsCircuitApi(body) {
  return CIRCUIT_API_PATTERN.test(String(body ?? ''));
}

export function chargeJavaScriptTime(ctx, durationMs) {
  if (ctx.budget === undefined || ctx.budget === null) {
    return;
  }
  ctx.budget.charge('jsTimeMs', Math.max(1, Math.ceil(durationMs)), { wire: ctx.wire });
}
