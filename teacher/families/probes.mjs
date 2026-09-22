/**
 * Domain assertions for dataset circuits.
 *
 * The generic part of what used to be a probe preamble is now the input and
 * output contract of the `jsEval` command itself (`wires/standard/jsEval.mjs`,
 * version 2): a dependency must be defined, a `slots` record must be a non-empty
 * object, and the body must not publish `null`, `undefined`, or the empty
 * string. Those three clauses were previously re-emitted as fixed text inside
 * every generated target — 18.96% of the target tokens of the shipped suite —
 * although they are identical in all 8415 `jsEval` stages; the command asserts
 * them once, so the target no longer teaches the model to write them.
 *
 * What remains here is the part that is NOT generic: a family's own assertions
 * about its domain (a value must be a member of the stated list, a score must be
 * a non-negative integer, a remainder must be smaller than the divisor). Those
 * are judgements only the family can make, they vary per family, and they stay in
 * the body where the model writes them. `answerBody` therefore returns the
 * computation unchanged, and this module keeps the helpers the loader, the
 * verifier, and the provenance probe need to read a body that carries domain
 * assertions:
 *
 * - `probeCount` counts the `probe(` calls of a body;
 * - `stripProbeStatements` removes the assertion statements, so the provenance
 *   probe can ask whether the *computation* reads an input value;
 * - `probeFindings` reports the per-wire counts of an assembled program.
 */

export const PROBE_HELPER =
  'const probe = (condition, message) => { if (!condition) { throw new Error("probe failed: " + message); } };';

/**
 * The `answer` wire body of a dataset circuit: the family computation.
 *
 * A family that writes domain assertions declares the `probe` helper itself,
 * because it is the family's own text now: the code emitted for a family either
 * defines the helper it calls or does not call one. `buildProgram` never injects
 * a preamble, so the trained form carries no statement that is the same in every
 * example.
 */
export function answerBody(compute) {
  // The computation, unchanged. The sandbox provides `probe(condition, message)` to
  // every jsEval body (jsEval command version 2.1), so a family that writes domain
  // assertions calls it without carrying the helper's definition — that text was
  // identical in 7745 of 8735 targets and is not taught any more. `PROBE_HELPER`
  // stays exported for the preservation view, whose derived JavaScript runs outside
  // the sandbox and must carry its own helper.
  return String(compute);
}

/**
 * The probe calls of a circuit body, counted per `probe(` occurrence. The
 * harness guarantees at least three; a family that adds domain assertions
 * raises the count. Exported so the loader and the tests can gate the shape
 * without executing anything.
 */
export function probeCount(source) {
  return [...String(source ?? '').matchAll(/\bprobe\(/g)].length;
}

/**
 * The circuit body with its probe statements and the probe-helper definition
 * removed. The provenance probe of `training-data/verify.mjs` uses this to ask
 * whether the *computation* reads an input value: a body whose only references
 * to `$slots` live inside its assertions does not derive its answer from the
 * instance data, and must still be reported as a stored answer. A probe call is
 * expected to be written on one line, which is the style of the harness and of
 * the family domain assertions.
 */
export function stripProbeStatements(source) {
  return String(source ?? '')
    .split('\n')
    .filter((line) => !/\bprobe\s*\(/.test(line) && !/^const probe\s*=/.test(line.trim()))
    .join('\n');
}

/**
 * The probe finding of one assembled program: the `jsEval` wires that declare
 * `probe(` calls, with the count per wire. A dataset program whose answer wire
 * declares no probe is a shape violation, because the probe harness is part of
 * the circuit contract of DS008.
 */
export function probeFindings(source) {
  const findings = [];
  for (const line of String(source ?? '').split('\n\n')) {
    const match = /^@(\w+)\s+jsEval\n([\s\S]*)$/.exec(line);
    if (match === null) {
      continue;
    }
    findings.push({ wire: match[1], probes: probeCount(match[2]), assertions: assertionCount(match[2]) });
  }
  return findings;
}

/**
 * The domain assertions of a circuit body: a `probe(...)` call, or a plain
 * `throw` a family writes when a probe helper would not express the condition.
 * Both are assertions about the family's own values and both end the run as a
 * structured `execution_error`. The generic clauses about a defined dependency,
 * a non-empty `slots`, and a non-empty result are not counted here: the `jsEval`
 * command asserts them, so restating them adds nothing.
 */
export function assertionCount(source) {
  const text = String(source ?? '');
  const probes = probeCount(text);
  // The probe helper's own `throw` is not an assertion a family made about its
  // values: it is the mechanism behind every `probe(...)` call, so counting both
  // would report one domain assertion as two.
  const helperThrows = text.includes(PROBE_HELPER) ? 1 : 0;
  return probes + [...text.matchAll(/\bthrow\b/g)].length - helperThrows;
}
