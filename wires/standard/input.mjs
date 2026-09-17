/**
 * `input` binds a value supplied by the wrapper.
 *
 * An input wire declares a name the wrapper fills for one request, such as the
 * current problem, a source chunk, or a runtime parameter. Its body is empty and
 * its value is immutable for the request snapshot. The runtime reads the
 * binding from the request inputs rather than from the wire body, so the
 * executor never runs.
 */

export const inputCommand = {
  name: 'input',
  version: '1.0.0',
  effectClass: 'pure',
  determinism: 'deterministic',
  manifest: {
    name: 'input',
    version: '1.0.0',
    summary: 'Bind a value supplied by the wrapper, such as the current problem, chunk, or runtime parameter.',
    whenToUse: 'Declare when a value arrives from the wrapper for this request.',
    whenNotToUse: 'Do not use to embed large source documents; keep them in the source store.',
    bodyFormat: 'empty',
    outputSchema: { type: 'any' },
    effectClass: 'pure',
    determinism: 'deterministic'
  },
  analyze() {
    return { values: [], structural: [], target: null };
  },
  validate({ body, wire }) {
    if (String(body).trim() !== '') {
      return { ok: false, message: `input wire "${wire}" must have an empty body.` };
    }
    return { ok: true };
  },
  async execute() {
    return undefined;
  }
};
