/**
 * Probe harness for dataset circuits.
 *
 * Every dataset circuit carries assertions in its `jsEval` stage. The harness
 * below is emitted by `buildProgram` around the family computation, so a probe
 * failure is a structured `execution_error` instead of a silently wrong answer:
 *
 * - two input probes assert that the compiled `slots` wire carries a non-empty
 *   object, because every computation reads its instance data from there;
 * - the family computation runs inside an async closure, so its `return` is a
 *   value the harness can inspect before publishing it;
 * - one output probe asserts that the computation produced a non-empty answer.
 *
 * A family body may call `probe(condition, message)` itself for domain
 * assertions (a value must be a known member of the stated list, a score must
 * be a non-negative integer, and so on). The helper is defined before the
 * closure, so those calls are in scope, and the loader rejects a family whose
 * assembled answer wire lacks the harness.
 */

export const PROBE_HELPER =
  'const probe = (condition, message) => { if (!condition) { throw new Error("probe failed: " + message); } };';

const INPUT_PROBES = Object.freeze([
  'probe(typeof $slots === "object" && $slots !== null && !Array.isArray($slots), "the compiled slots wire must carry an object");',
  'probe(Object.keys($slots).length > 0, "the compiled slots wire must not be empty");'
]);

const OUTPUT_PROBE =
  'probe(answer !== undefined && answer !== null && String(answer).length > 0, "the computation returned an empty answer");';

/** The `answer` wire body of a dataset circuit: probes around the computation. */
export function answerBody(compute) {
  return [
    PROBE_HELPER,
    ...INPUT_PROBES,
    'const answer = await (async () => {',
    String(compute),
    '})();',
    OUTPUT_PROBE,
    'return answer;'
  ].join('\n');
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
    findings.push({ wire: match[1], probes: probeCount(match[2]) });
  }
  return findings;
}
