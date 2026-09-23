import { findInstructionReferences } from '../../runtime/dependencies.mjs';
import { SopError } from '../../runtime/errors.mjs';
import { parseProfile } from '../../runtime/profile.mjs';

/**
 * `aggregate` filters a source list by a declared predicate and reduces the
 * kept records to one scalar in a single command: sum, count, min, max, or
 * average.
 *
 * The predicate is a tiny declarative form — a comparison against a threshold
 * (`above`, `atLeast`, `below`, `atMost`) or a divisibility test
 * (`divisibleBy`) — named in the body, never a second JavaScript. The source
 * is a list of whole numbers, so the kept records are the elements that pass
 * the predicate. A `field` names which field to compare for a list of records;
 * without it, the element itself is compared.
 *
 * The command owns the non-empty and whole-number contract the generated
 * filter-then-summarize stages previously re-asserted with their own probes:
 * `sum` and `count` reduce an empty kept list to zero, while `min`, `max`, and
 * `average` reject an empty kept list as a structured `execution_error`; every
 * reduction runs over numbers and returns a whole number for whole inputs
 * (`average` returns the exact mean). A malformed predicate or an unknown
 * operation is a validation failure before execution.
 */

const OPS = new Set(['sum', 'count', 'min', 'max', 'average']);
const PREDICATE_KINDS = new Set(['above', 'atLeast', 'below', 'atMost', 'divisibleBy']);

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

function subjectOf(element, field) {
  if (field === null) {
    return element;
  }
  return element !== null && typeof element === 'object' && !Array.isArray(element) ? element[field] : undefined;
}

function matches(kind, subject, threshold) {
  if (typeof subject !== 'number' || !Number.isFinite(subject)) {
    return false;
  }
  switch (kind) {
    case 'above':
      return subject > threshold;
    case 'atLeast':
      return subject >= threshold;
    case 'below':
      return subject < threshold;
    case 'atMost':
      return subject <= threshold;
    case 'divisibleBy':
      return subject % threshold === 0;
    default:
      return false;
  }
}

function parsePredicate(value, wire) {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new SopError('validation_error', `aggregate wire "${wire}" declares a predicate that is not a mapping.`, {
      wire
    });
  }
  const keys = Object.keys(value).filter((key) => PREDICATE_KINDS.has(key));
  if (keys.length !== 1) {
    throw new SopError('validation_error', `aggregate wire "${wire}" must name exactly one of above, atLeast, below, atMost, or divisibleBy.`, {
      wire
    });
  }
  return { kind: keys[0], value: value[keys[0]] };
}

function assertNumbers(kept, ctx) {
  for (const value of kept) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new SopError('execution_error', `Wire "${ctx.wire}" needs numeric records to reduce, and a kept record is not a number`, {
        wire: ctx.wire,
        contract: 'numeric_records'
      });
    }
  }
}

function reduce(op, kept, ctx) {
  switch (op) {
    case 'count':
      return kept.length;
    case 'sum':
      assertNumbers(kept, ctx);
      return kept.reduce((total, value) => total + value, 0);
    case 'min':
    case 'max': {
      if (kept.length === 0) {
        throw new SopError('execution_error', `Wire "${ctx.wire}" cannot take the ${op} of an empty kept list`, {
          wire: ctx.wire,
          contract: 'non_empty_kept'
        });
      }
      assertNumbers(kept, ctx);
      return kept.reduce((best, value) => (op === 'min' ? Math.min(best, value) : Math.max(best, value)));
    }
    case 'average': {
      if (kept.length === 0) {
        throw new SopError('execution_error', `Wire "${ctx.wire}" cannot average an empty kept list`, {
          wire: ctx.wire,
          contract: 'non_empty_kept'
        });
      }
      assertNumbers(kept, ctx);
      const total = kept.reduce((sum, value) => sum + value, 0);
      return total / kept.length;
    }
    default:
      throw new SopError('execution_error', `Wire "${ctx.wire}" names the unknown aggregate operation "${op}"`, {
        wire: ctx.wire,
        contract: 'known_operation'
      });
  }
}

export const aggregateCommand = {
  name: 'aggregate',
  version: '1.0.0',
  effectClass: 'pure',
  determinism: 'deterministic',
  manifest: {
    name: 'aggregate',
    version: '1.0.0',
    summary: 'Filter a source list by a declared predicate and reduce the kept records to one scalar: sum, count, min, max, or average.',
    whenToUse: 'Use when a plan filters a list by a threshold or divisibility and then reduces the kept records to a single number.',
    whenNotToUse: 'Do not use when the kept records must be published as a list, or when the predicate is a computation too specific to name.',
    bodyFormat: 'profile',
    syntax: '@average aggregate\nsource: $slots.scores\nop: average\npredicate:\n  atLeast: $slots.minimum',
    inputContract: {
      requiredDependencies: ['source list', 'predicate value'],
      notes: 'All referenced values appear as $wire dependencies; the predicate is one comparison or divisibility key.'
    },
    outputSchema: { type: 'number' },
    effectClass: 'pure',
    determinism: 'deterministic',
    examples: [
      {
        source: '@kept aggregate\nsource: $slots.values\nop: sum\npredicate:\n  above: $slots.threshold',
        explanation: 'Sums the values above the threshold in one command.'
      },
      {
        source: '@qualifying aggregate\nsource: $slots.scores\nop: average\npredicate:\n  atLeast: $slots.minimum',
        explanation: 'Averages the scores at or above the minimum in one command.'
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
      if (profile.source === undefined) {
        return { ok: false, message: `aggregate wire "${wire}" requires a source field.` };
      }
      if (typeof profile.op !== 'string' || !OPS.has(profile.op)) {
        return { ok: false, message: `aggregate wire "${wire}" requires an op of sum, count, min, max, or average.` };
      }
      // The predicate structure is checked here so a malformed predicate fails as
      // a validation error before execution rather than as a runtime surprise.
      parsePredicate(profile.predicate, wire);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  },
  async execute(ctx) {
    const profile = parseProfile(ctx.body);
    const source = resolveReference(profile.source, ctx);
    if (!Array.isArray(source)) {
      throw new SopError('execution_error', `Wire "${ctx.wire}" reads a source that is not a list`, {
        wire: ctx.wire,
        contract: 'source_list'
      });
    }
    const predicate = parsePredicate(profile.predicate, ctx.wire);
    const field = typeof profile.field === 'string' && profile.field !== '' ? profile.field : null;
    const threshold = predicate === null ? null : resolveReference(predicate.value, ctx);
    const kept = [];
    for (const element of source) {
      // The field, when named, selects the value both the predicate compares and
      // the reduction reduces; without it the element itself is the value.
      const subject = field === null ? element : subjectOf(element, field);
      if (predicate === null || matches(predicate.kind, subject, threshold)) {
        kept.push(subject);
      }
    }
    return reduce(profile.op, kept, ctx);
  }
};
