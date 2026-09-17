import { findValueReferences } from '../../runtime/dependencies.mjs';
import { SopError } from '../../runtime/errors.mjs';
import { parseProfile } from '../../runtime/profile.mjs';
import { createJsSandbox } from '../../runtime/sandbox.mjs';
import { chargeJavaScriptTime } from './jsEval.mjs';

/**
 * Container commands: declare, add, upsert, remove, and filter.
 *
 * A container declaration is a structural state declaration whose schema and
 * identity policy become trusted runtime state. Mutation commands stage patches
 * against the revision visible at the start of the epoch; the store commits
 * compatible patches together, increments the revision once per grouped commit,
 * and invalidates the wires that read the container.
 *
 * `containerFilter` is a pure derived view. It reads the source container
 * revision and any predicate dependencies, evaluates its predicate in the
 * isolated guest realm, and retains provenance in the view it returns. A filter
 * may read another derived view, so filters compose as ordinary dependency
 * chains.
 */

const profileSandbox = createJsSandbox();

export const containerCommand = {
  name: 'container',
  version: '1.1.0',
  effectClass: 'pure',
  determinism: 'deterministic',
  manifest: {
    name: 'container',
    version: '1.1.0',
    summary: 'Declare a typed persistent collection and its schema and identity policy.',
    whenToUse: 'Use during planning to define the persistent state a task needs.',
    whenNotToUse: 'Do not use for small transient values; use jsEval or literal for those.',
    bodyFormat: 'profile',
    syntax: '@characters container\nkind: table\nprimaryKey: id\nschema:\n  type: object\n  required: [id, name, sourceSpans]',
    outputSchema: { type: 'object' },
    effectClass: 'pure',
    determinism: 'deterministic'
  },
  analyze({ wire }) {
    // A declaration's value is the container snapshot, so the wire reads the
    // container it declares. A commit invalidates the declaration wire and the
    // next epoch returns the new revision.
    return { values: [], structural: [], containerReads: [wire], containerWrites: [], target: wire };
  },
  validate({ body, wire }) {
    try {
      const profile = parseProfile(body);
      if (profile.kind === undefined) {
        return { ok: false, message: `container wire "${wire}" requires a kind.` };
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  },
  async execute(ctx) {
    if (ctx.containers.has(ctx.wire)) {
      return ctx.containers.snapshot(ctx.wire);
    }
    const profile = parseProfile(ctx.body);
    ctx.containers.declare(ctx.wire, {
      kind: profile.kind,
      primaryKey: profile.primaryKey ?? null,
      identity: profile.identity ?? null,
      schema: profile.schema ?? null,
      mergePolicy: profile.mergePolicy ?? 'reject'
    });
    return ctx.containers.snapshot(ctx.wire);
  }
};

export const containerAddCommand = mutationCommand('containerAdd', 'add', {
  summary: 'Stage one or more new records for a target container.',
  whenToUse: 'Use when reading a source chunk and contributing new records to a declared container.',
  whenNotToUse: 'Do not use to replace an existing keyed record; use containerUpsert.',
  syntax: '@chunk042_events containerAdd\ntarget: events\nitems:\n  - id: event_042_01\n    actors: [char_hamlet]'
});

export const containerUpsertCommand = mutationCommand('containerUpsert', 'upsert', {
  summary: 'Stage keyed inserts or replacements under a declared merge policy.',
  whenToUse: 'Use when a record identity is known and the update may replace, merge, or preserve a competing assertion.',
  whenNotToUse: 'Do not use without a declared identity rule; the default policy rejects conflicts instead of choosing a winner.',
  syntax: '@resolve_characters containerUpsert\ntarget: characters\nmergePolicy: competing-assertion\nitems: $resolvedRecords'
});

export const containerRemoveCommand = mutationCommand('containerRemove', 'remove', {
  summary: 'Stage deletion or tombstone operations under an explicit identity contract.',
  whenToUse: 'Use when a record leaves the current canonical view but history must remain auditable.',
  whenNotToUse: 'Do not use to rewrite history; the store keeps a tombstone instead of erasing the record.',
  syntax: '@retract containerRemove\ntarget: claims\nitems:\n  - id: claim_017'
});

function mutationCommand(name, operation, manifestFields) {
  return {
    name,
    version: '1.1.0',
    effectClass: 'container_patch',
    determinism: 'deterministic',
    manifest: {
      name,
      version: '1.1.0',
      summary: manifestFields.summary,
      whenToUse: manifestFields.whenToUse,
      whenNotToUse: manifestFields.whenNotToUse,
      bodyFormat: 'profile',
      syntax: manifestFields.syntax,
      inputContract: {
        requiredDependencies: ['container target', 'value'],
        notes: 'The target names a declared container; items may reference a $wire value.'
      },
      outputSchema: { type: 'object' },
      effectClass: 'container_patch',
      determinism: 'deterministic'
    },
    analyze({ body }) {
      const profile = parseProfile(body);
      const items = profile.items;
      const values = typeof items === 'string' && items.startsWith('$') ? [items.slice(1)] : [];
      return {
        values,
        structural: [],
        containerReads: [],
        containerWrites: typeof profile.target === 'string' ? [profile.target] : [],
        target: typeof profile.target === 'string' ? profile.target : null
      };
    },
    validate({ body, wire }) {
      try {
        const profile = parseProfile(body);
        if (typeof profile.target !== 'string') {
          return { ok: false, message: `${name} wire "${wire}" requires a target.` };
        }
        return { ok: true };
      } catch (error) {
        return { ok: false, message: error.message };
      }
    },
    async execute(ctx) {
      const profile = parseProfile(ctx.body);
      const items = resolveItems(profile.items, ctx);
      ctx.stagePatch({
        target: profile.target,
        operation,
        items,
        mergePolicy: profile.mergePolicy
      });
      return { staged: items.length, target: profile.target, operation };
    }
  };
}

export const containerFilterCommand = {
  name: 'containerFilter',
  version: '1.1.0',
  effectClass: 'pure',
  determinism: 'deterministic',
  manifest: {
    name: 'containerFilter',
    version: '1.1.0',
    summary: 'Define a pure derived view of a source container while retaining provenance.',
    whenToUse: 'Use to select the records a later step should read, keeping the source revision visible.',
    whenNotToUse: 'Do not use to change the source container; filters produce derived views only.',
    bodyFormat: 'profile',
    syntax: '@highConfidenceClaims containerFilter\nsource: $claims\npredicate:\n  return row.confidence >= $threshold;',
    inputContract: {
      requiredDependencies: ['container', 'predicate value'],
      notes: 'The source names a container value; the predicate is JavaScript over a row.'
    },
    outputSchema: { type: 'object' },
    effectClass: 'pure',
    determinism: 'deterministic'
  },
  analyze({ body }) {
    const profile = parseProfile(body);
    const predicateReferences = findValueReferences(String(profile.predicate ?? ''));
    const sourceName = typeof profile.source === 'string' ? profile.source.replace(/^\$/, '') : null;
    return {
      values: predicateReferences.map((reference) => reference.name).filter((name) => name !== 'row'),
      structural: [],
      containerReads: sourceName === null ? [] : [sourceName],
      containerWrites: [],
      target: sourceName
    };
  },
  validate({ body, wire }) {
    try {
      const profile = parseProfile(body);
      if (typeof profile.source !== 'string') {
        return { ok: false, message: `containerFilter wire "${wire}" requires a source.` };
      }
      if (typeof profile.predicate !== 'string' || profile.predicate.trim() === '') {
        return { ok: false, message: `containerFilter wire "${wire}" requires a predicate.` };
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  },
  async execute(ctx) {
    const profile = parseProfile(ctx.body);
    const source = readContainerValue(profile.source, ctx);
    const predicateSource = String(profile.predicate ?? '');
    const records = Array.isArray(source.records) ? source.records : [];
    const predicateValues = {};
    for (const reference of findValueReferences(predicateSource)) {
      if (reference.name === 'row') {
        continue;
      }
      predicateValues[reference.name] = ctx.values[reference.name];
    }
    const filtered = [];
    let predicateMs = 0;
    for (const row of records) {
      const outcome = await profileSandbox.invoke({
        body: `const row = $__row;\n${predicateSource}`,
        values: { ...predicateValues, __row: row },
        wire: `${ctx.wire}:predicate`,
        budget: ctx.budget
      });
      predicateMs += outcome.durationMs;
      if (outcome.value === true) {
        filtered.push(row);
      }
    }
    chargeJavaScriptTime(ctx, predicateMs);
    return ctx.containers.viewOf(source.__container, filtered, sourceRevisionOf(source));
  }
};

/**
 * The revision a derived view was computed from. A view of a view keeps the
 * base container revision, so provenance stays traceable through a filter
 * chain, and every link of the chain is invalidated by the base commit.
 */
function sourceRevisionOf(source) {
  return source.kind === 'view' ? source.sourceRevision : source.revision;
}

function resolveItems(items, ctx) {
  if (typeof items === 'string' && items.startsWith('$')) {
    const name = items.slice(1);
    const value = ctx.values[name];
    if (value === undefined) {
      throw new SopError('execution_error', `Container patch referenced undefined value "${name}".`, {
        wire: ctx.wire,
        dependency: name
      });
    }
    if (value !== null && typeof value === 'object' && value.__container !== undefined && Array.isArray(value.records)) {
      // A container snapshot or a derived view contributes its records.
      return value.records;
    }
    return Array.isArray(value) ? value : [value];
  }
  if (Array.isArray(items)) {
    return items;
  }
  if (items === null || items === undefined) {
    return [];
  }
  return [items];
}

function readContainerValue(reference, ctx) {
  if (typeof reference !== 'string' || !reference.startsWith('$')) {
    throw new SopError('execution_error', `containerFilter source "${reference}" must be a $wire reference.`, {
      wire: ctx.wire
    });
  }
  const value = ctx.values[reference.slice(1)];
  if (value === null || typeof value !== 'object' || value.__container === undefined) {
    throw new SopError('execution_error', `containerFilter source "${reference}" is not a container value.`, {
      wire: ctx.wire
    });
  }
  return value;
}

export const containerCommands = [
  containerCommand,
  containerAddCommand,
  containerUpsertCommand,
  containerRemoveCommand,
  containerFilterCommand
];
