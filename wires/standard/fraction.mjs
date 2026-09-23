import { findInstructionReferences } from '../../runtime/dependencies.mjs';
import { SopError } from '../../runtime/errors.mjs';
import { parseProfile } from '../../runtime/profile.mjs';

/**
 * `fraction` reduces a ratio to a reduced fraction or a whole number, running
 * Euclid's greatest-common-divisor in the command.
 *
 * The body names either a favourable count and a total (`numerator` and
 * `denominator`), or a source list and a divisibility divisor (`source` and
 * `divisibleBy`, which counts the elements the divisor divides). The command
 * reduces the ratio and returns `numerator/denominator`, or the whole integer
 * when the denominator reduces to one, exactly the form the generated
 * probability body previously computed with its own gcd loop and re-asserted
 * with a regex probe.
 *
 * The command owns the reduced-fraction contract: a zero or non-positive
 * total, a negative favourable count, and a favourable count above the total
 * are structured `execution_error`s, and the result is always a whole number
 * or a reduced `a/b` string.
 */

function resolveReference(reference, ctx) {
  if (typeof reference === 'string' && reference.startsWith('$')) {
    const dotted = reference.slice(1);
    const [root, ...path] = dotted.split('.');
    let value = ctx.values[root];
    if (value === undefined) {
      throw new SopError('execution_error', `Wire "${ctx.wire}" reads "$${root}", which has no value`, {
        wire: ctx.wire,
        dependency: root
      });
    }
    for (const key of path) {
      if (value === null || value === undefined) {
        throw new SopError('execution_error', `Wire "${ctx.wire}" reads "$${root}.${key}", which is not present`, {
          wire: ctx.wire,
          dependency: root
        });
      }
      value = value[key];
    }
    return value;
  }
  return reference;
}

function gcd(left, right) {
  let a = left;
  let b = right;
  while (b !== 0) {
    const remainder = b;
    b = a % b;
    a = remainder;
  }
  return a;
}

function reducedFraction(favourable, total, ctx) {
  if (!Number.isInteger(favourable) || favourable < 0) {
    throw new SopError('execution_error', `Wire "${ctx.wire}" names a favourable count that is not a whole, non-negative number`, {
      wire: ctx.wire,
      contract: 'whole_favourable'
    });
  }
  if (!Number.isInteger(total) || total <= 0) {
    throw new SopError('execution_error', `Wire "${ctx.wire}" names a total that is not a positive whole number`, {
      wire: ctx.wire,
      contract: 'positive_total'
    });
  }
  if (favourable > total) {
    throw new SopError('execution_error', `Wire "${ctx.wire}" names a favourable count above its total`, {
      wire: ctx.wire,
      contract: 'favourable_within_total'
    });
  }
  const divisor = gcd(favourable, total);
  const numerator = favourable / divisor;
  const denominator = total / divisor;
  return denominator === 1 ? String(numerator) : `${numerator}/${denominator}`;
}

export const fractionCommand = {
  name: 'fraction',
  version: '1.0.0',
  effectClass: 'pure',
  determinism: 'deterministic',
  manifest: {
    name: 'fraction',
    version: '1.0.0',
    summary: 'Reduce a ratio to a reduced fraction or a whole number, running the greatest-common-divisor in the command.',
    whenToUse: 'Use to report a probability or a ratio as a reduced fraction without writing a gcd loop.',
    whenNotToUse: 'Do not use for decimal rounding, percentages, or ratios whose denominator is not a stated whole number.',
    bodyFormat: 'profile',
    syntax: '@chance fraction\nsource: $kept\ndivisibleBy: $slots.favourableDivisor',
    inputContract: {
      requiredDependencies: ['numerator and denominator, or a source list and a divisibility divisor'],
      notes: 'All referenced values appear as $wire dependencies; the result is a reduced a/b string or a whole number.'
    },
    outputSchema: { type: 'string' },
    effectClass: 'pure',
    determinism: 'deterministic',
    examples: [
      {
        source: '@chance fraction\nsource: $kept\ndivisibleBy: $slots.favourableDivisor',
        explanation: 'Counts the kept values divisible by the divisor and returns the count over the list length, reduced.'
      },
      {
        source: '@ratio fraction\nnumerator: $favourable\ndenominator: $total',
        explanation: 'Reduces the two named counts directly.'
      }
    ]
  },
  analyze({ body }) {
    return {
      values: findInstructionReferences(body).map((reference) => reference.name),
      structural: [],
      containerReads: [],
      containerWrites: [],
      target: null
    };
  },
  validate({ body, wire }) {
    try {
      const profile = parseProfile(body);
      const hasPair = profile.numerator !== undefined && profile.denominator !== undefined;
      const hasList = profile.source !== undefined && profile.divisibleBy !== undefined;
      if (hasPair === hasList) {
        return {
          ok: false,
          message: `fraction wire "${wire}" must declare either "numerator" and "denominator", or "source" and "divisibleBy".`
        };
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  },
  async execute(ctx) {
    const profile = parseProfile(ctx.body);
    if (profile.source !== undefined) {
      const source = resolveReference(profile.source, ctx);
      if (!Array.isArray(source)) {
        throw new SopError('execution_error', `Wire "${ctx.wire}" reads a source that is not a list`, {
          wire: ctx.wire,
          contract: 'source_list'
        });
      }
      const divisor = resolveReference(profile.divisibleBy, ctx);
      if (!Number.isInteger(divisor) || divisor <= 0) {
        throw new SopError('execution_error', `Wire "${ctx.wire}" names a divisibility divisor that is not a positive whole number`, {
          wire: ctx.wire,
          contract: 'positive_divisor'
        });
      }
      let favourable = 0;
      for (const value of source) {
        if (typeof value === 'number' && Number.isFinite(value) && value % divisor === 0) {
          favourable += 1;
        }
      }
      return reducedFraction(favourable, source.length, ctx);
    }
    const favourable = resolveReference(profile.numerator, ctx);
    const total = resolveReference(profile.denominator, ctx);
    return reducedFraction(favourable, total, ctx);
  }
};
