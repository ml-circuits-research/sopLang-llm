/**
 * `literal` produces a literal scalar, JSON value, or text body.
 *
 * The body is parsed as JSON when it is valid JSON, and otherwise it is
 * returned as text. Large source documents do not belong in a literal body;
 * they stay in the source store and are referenced through input wires.
 */

export const literalCommand = {
  name: 'literal',
  version: '1.0.0',
  effectClass: 'pure',
  determinism: 'deterministic',
  manifest: {
    name: 'literal',
    version: '1.0.0',
    summary: 'Produce a literal scalar, JSON value, or text body.',
    whenToUse: 'Use for constants and small structured values embedded in the circuit.',
    whenNotToUse: 'Do not embed large source text; reference it through an input wire or a source identifier.',
    bodyFormat: 'json-or-text',
    outputSchema: { type: 'any' },
    effectClass: 'pure',
    determinism: 'deterministic'
  },
  analyze() {
    return { values: [], structural: [], target: null };
  },
  async execute(ctx) {
    return parseLiteralBody(ctx.body);
  }
};

export function parseLiteralBody(body) {
  const text = String(body ?? '').trim();
  if (text === '') {
    return '';
  }
  try {
    return JSON.parse(text);
  } catch {
    return String(body ?? '');
  }
}
