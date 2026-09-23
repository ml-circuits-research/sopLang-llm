import { findInstructionReferences } from '../../runtime/dependencies.mjs';
import { SopError } from '../../runtime/errors.mjs';
import { parseProfile } from '../../runtime/profile.mjs';

/**
 * `graphPath` answers a reachability or neighbour question over a stated
 * undirected edge list without writing a traversal.
 *
 * The body names an edge list (`edges`), a start node (`from`), and either a
 * target node (`to`) for a reachability verdict or `count: true` for the
 * degree of the start node. The command builds the adjacency structure and runs
 * a bounded, deterministic breadth-first search in host code, so a compiled
 * plan never writes a queue, a seen set, or a shift loop.
 *
 * The command owns the whole-number and yes/no contract. Reachability returns
 * exactly the strings `yes` or `no`; a neighbour count returns the whole degree
 * of the start node. Malformed edges, a start node that appears in no edge, a
 * target node that appears in no edge, and a start equal to the target are
 * structured `execution_error`s naming the wire and the contract clause, which
 * is the guard the generated body previously re-asserted with its own probe.
 *
 * The executor is deterministic: adjacency is built in edge order and the
 * traversal visits each node once, so the verdict depends only on the declared
 * edges and nodes, never on object key ordering or a runtime iteration order.
 */

function isComparableScalar(value) {
  return (typeof value === 'number' && Number.isFinite(value)) || typeof value === 'string';
}

/** Resolve a `$name` or a `$name.field.path` reference against the wire's dependency values. */
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

function nodeOf(value, ctx, role) {
  if (!isComparableScalar(value)) {
    throw new SopError('execution_error', `Wire "${ctx.wire}" names a ${role} node that is not a comparable scalar`, {
      wire: ctx.wire,
      contract: 'comparable_node'
    });
  }
  return value;
}

function edgeListOf(value, ctx) {
  if (!Array.isArray(value)) {
    throw new SopError('execution_error', `Wire "${ctx.wire}" names an edge list that is not a list`, {
      wire: ctx.wire,
      contract: 'edge_list'
    });
  }
  const edges = [];
  for (const edge of value) {
    if (!Array.isArray(edge) || edge.length !== 2) {
      throw new SopError('execution_error', `Wire "${ctx.wire}" names an edge list whose entries are not [a, b] pairs`, {
        wire: ctx.wire,
        contract: 'edge_pairs'
      });
    }
    if (!isComparableScalar(edge[0]) || !isComparableScalar(edge[1])) {
      throw new SopError('execution_error', `Wire "${ctx.wire}" names an edge whose endpoint is not a comparable scalar`, {
        wire: ctx.wire,
        contract: 'edge_pairs'
      });
    }
    edges.push([edge[0], edge[1]]);
  }
  return edges;
}

function buildAdjacency(edges) {
  const adjacency = new Map();
  for (const [left, right] of edges) {
    if (!adjacency.has(left)) {
      adjacency.set(left, []);
    }
    if (!adjacency.has(right)) {
      adjacency.set(right, []);
    }
    adjacency.get(left).push(right);
    adjacency.get(right).push(left);
  }
  return adjacency;
}

function degreeOf(edges, from, ctx) {
  let degree = 0;
  for (const [left, right] of edges) {
    if (left === from || right === from) {
      degree += 1;
    }
  }
  if (degree === 0) {
    throw new SopError('execution_error', `Wire "${ctx.wire}" names a start node that appears in no edge`, {
      wire: ctx.wire,
      contract: 'start_present'
    });
  }
  return degree;
}

function reachabilityOf(edges, from, to, ctx) {
  if (from === to) {
    throw new SopError('execution_error', `Wire "${ctx.wire}" names the same node as start and target`, {
      wire: ctx.wire,
      contract: 'distinct_nodes'
    });
  }
  const adjacency = buildAdjacency(edges);
  if (!adjacency.has(from)) {
    throw new SopError('execution_error', `Wire "${ctx.wire}" names a start node that appears in no edge`, {
      wire: ctx.wire,
      contract: 'start_present'
    });
  }
  if (!adjacency.has(to)) {
    throw new SopError('execution_error', `Wire "${ctx.wire}" names a target node that appears in no edge`, {
      wire: ctx.wire,
      contract: 'target_present'
    });
  }
  const seen = new Set([from]);
  const queue = [from];
  let cursor = 0;
  while (cursor < queue.length) {
    const node = queue[cursor];
    cursor += 1;
    if (node === to) {
      return 'yes';
    }
    for (const next of adjacency.get(node)) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return 'no';
}

export const graphPathCommand = {
  name: 'graphPath',
  version: '1.0.0',
  effectClass: 'pure',
  determinism: 'deterministic',
  manifest: {
    name: 'graphPath',
    version: '1.0.0',
    summary: 'Answer a reachability or neighbour question over a stated undirected edge list without writing a traversal.',
    whenToUse: 'Use to ask whether a path joins two stated nodes, or to count the neighbours of a node, over a declared edge list.',
    whenNotToUse: 'Do not use for weighted, directed, or multi-hop distance questions, or for anything the edge list does not state.',
    bodyFormat: 'profile',
    syntax: '@path graphPath\nfrom: $largest\nto: $slots.target\nedges: $slots.edges',
    inputContract: {
      requiredDependencies: ['edge list', 'start node', 'target node or count flag'],
      notes: 'All referenced values appear as $wire dependencies; edges are [a, b] pairs of comparable scalars.'
    },
    outputSchema: { type: 'any' },
    effectClass: 'pure',
    determinism: 'deterministic',
    examples: [
      {
        source: '@degree graphPath\nfrom: $node\nedges: $slots.edges\ncount: true',
        explanation: 'Returns the number of edges that name the start node.'
      },
      {
        source: '@reachable graphPath\nfrom: $largest\nto: $slots.target\nedges: $slots.edges',
        explanation: 'Returns "yes" when a path joins the two nodes, and "no" otherwise.'
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
      if (profile.edges === undefined) {
        return { ok: false, message: `graphPath wire "${wire}" requires an edges field.` };
      }
      if (profile.from === undefined) {
        return { ok: false, message: `graphPath wire "${wire}" requires a from field.` };
      }
      const hasTo = profile.to !== undefined;
      const hasCount = profile.count === true;
      if (hasTo === hasCount) {
        return { ok: false, message: `graphPath wire "${wire}" must declare exactly one of "to" or "count: true".` };
      }
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  },
  async execute(ctx) {
    const profile = parseProfile(ctx.body);
    const edges = edgeListOf(resolveReference(profile.edges, ctx), ctx);
    const from = nodeOf(resolveReference(profile.from, ctx), ctx, 'start');
    if (profile.count === true) {
      return degreeOf(edges, from, ctx);
    }
    const to = nodeOf(resolveReference(profile.to, ctx), ctx, 'target');
    return reachabilityOf(edges, from, to, ctx);
  }
};
