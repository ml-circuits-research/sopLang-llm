import { hashDefinition, normalizeBody } from './hashing.mjs';
import { SopError } from './errors.mjs';

/**
 * Dependency graph construction and deterministic scheduling.
 *
 * The graph is built from wire definitions, the command registry, and the set
 * of input bindings the wrapper supplies. A wire declared with the `input`
 * command is an input placeholder whose value comes from the wrapper binding of
 * the same name. A binding whose name has no declared wire becomes an implicit
 * input node, so a circuit may read a wrapper value directly from JavaScript
 * without declaring it.
 *
 * Every command analyzes its body into four dependency lists:
 *
 * - values            `$name` references outside strings and comments
 * - structural        wire names the definition depends on structurally
 * - containerReads    container names whose current revision the wire reads
 * - containerWrites   container names the wire stages patches into
 *
 * A wire that writes to a container does not depend on that container's
 * revision, because its own patch is what advances the revision. A wire that
 * reads a container depends on the revision and is invalidated after every
 * commit that targets it. A read is recognized in both forms: a declared
 * container read such as the `source` of a `containerFilter`, and an ordinary
 * value read of a wire that declares a container, which the graph links into
 * `readsContainers`. Structural reads recorded through the transaction API are
 * invalidated the same way when a definition changes or a listed prefix gains
 * or loses a matching name.
 *
 * Scheduling runs over the active dependency closure of the requested output
 * wires and configured control roots. A dependency that does not exist yet is
 * recorded as pending rather than raised immediately, because a
 * metaprogramming wire may create it later in the same run. Only after the run
 * makes no further progress does a missing dependency become an unresolved
 * outcome.
 *
 * Ready nodes are emitted by creation order and then by lexical name, so
 * independent wires always produce the same schedule. A cycle among nodes whose
 * dependencies are all present reports the remaining nodes and fails before any
 * output is published.
 */

export function emptyDependencies() {
  return { values: [], structural: [], containerReads: [], containerWrites: [], target: null };
}

export function normalizeDependencies(analysis) {
  const values = Array.isArray(analysis?.values) ? analysis.values : [];
  const structural = Array.isArray(analysis?.structural) ? analysis.structural : [];
  const containerReads = Array.isArray(analysis?.containerReads) ? analysis.containerReads : [];
  const containerWrites = Array.isArray(analysis?.containerWrites) ? analysis.containerWrites : [];
  return {
    values: [...new Set(values)],
    structural: [...new Set(structural)],
    containerReads: [...new Set(containerReads)],
    containerWrites: [...new Set(containerWrites)],
    target: analysis?.target ?? null
  };
}

export function schedulableDependencies(node) {
  return [...node.dependencies.values, ...node.dependencies.structural, ...node.dependencies.containerReads];
}

export function createNode({ name, command, body, line = 0, sourceName = 'inline', createdAt = 0, isInput = false }) {
  const normalized = normalizeBody(body);
  const definitionHash = hashDefinition({
    command: command === null ? 'input' : command.name,
    commandVersion: command === null ? '' : command.version,
    body: normalized
  });
  return {
    name,
    command,
    body: normalized,
    line,
    sourceName,
    createdAt,
    definitionHash,
    isInput,
    declaresContainer: false,
    dependencies: emptyDependencies(),
    readsContainers: new Set(),
    structuralReads: { names: new Set(), prefixes: new Set() }
  };
}

export function analyzeNode(node) {
  if (node.isInput || node.command === null) {
    node.dependencies = emptyDependencies();
    return node.dependencies;
  }
  const dependencies = normalizeDependencies(node.command.analyze({ body: node.body, wire: node.name }));
  // A container declaration reads the container it declares so its value
  // reflects the current revision. The self-reference is not a graph edge; the
  // epoch barrier refreshes the declaration value after a commit.
  node.declaresContainer = dependencies.containerReads.includes(node.name);
  dependencies.containerReads = dependencies.containerReads.filter((name) => name !== node.name);
  if (dependencies.values.includes(node.name)) {
    throw new SopError('cycle_detected', `Wire "${node.name}" depends on itself.`, { wire: node.name });
  }
  node.dependencies = dependencies;
  return node.dependencies;
}

export function buildGraph({ wires, inputBindings = new Set(), registry }) {
  const nodes = new Map();
  let createdAt = 0;

  for (const wire of wires) {
    const isInput = wire.command === 'input';
    const command = isInput ? null : registry.require(wire.command);
    const node = createNode({ ...wire, command, createdAt, isInput });
    createdAt += 1;
    analyzeNode(node);
    nodes.set(node.name, node);
  }

  for (const name of inputBindings) {
    if (nodes.has(name)) {
      continue;
    }
    const node = createNode({ name, command: null, createdAt, isInput: true, sourceName: 'input binding' });
    createdAt += 1;
    nodes.set(name, node);
  }

  const graph = {
    nodes,
    createdAt,
    has(name) {
      return nodes.has(name);
    },
    get(name) {
      return nodes.get(name) ?? null;
    }
  };
  linkContainerReads(graph);
  return graph;
}

/**
 * A container is read both by a command that declares a container read, such as
 * `containerFilter`, and by an ordinary value read of a wire that declares a
 * container, such as `jsEval` reading `$claims`. Both forms activate the same
 * scheduling and invalidation behavior, so the graph records the union on every
 * node as `readsContainers`.
 */
export function linkContainerReads(graph) {
  const containerNames = new Set();
  for (const node of graph.nodes.values()) {
    if (isContainerDeclaration(node)) {
      containerNames.add(node.name);
    }
  }
  for (const node of graph.nodes.values()) {
    if (node.isInput || node.command === null) {
      node.readsContainers = new Set();
      continue;
    }
    const reads = new Set(node.dependencies.containerReads);
    for (const value of node.dependencies.values) {
      if (containerNames.has(value)) {
        reads.add(value);
      }
    }
    node.readsContainers = reads;
  }
  return graph;
}

export function isContainerDeclaration(node) {
  return node !== null && node.command !== null && node.command.name === 'container';
}

/**
 * Every wire whose invalidation is triggered when `name` changes: value
 * consumers, structural consumers, container readers, definition readers, and
 * prefix listers whose prefix matches the name.
 */
export function downstreamConsumers(graph, name, visited = new Set()) {
  const affected = new Set();
  const queue = [name];
  while (queue.length > 0) {
    const currentName = queue.shift();
    if (visited.has(currentName)) {
      continue;
    }
    visited.add(currentName);
    for (const node of graph.nodes.values()) {
      if (node.isInput || node.name === currentName || affected.has(node.name)) {
        continue;
      }
      if (invalidatesOn(node, currentName)) {
        affected.add(node.name);
        queue.push(node.name);
      }
    }
  }
  return affected;
}

export function invalidatesOn(node, name) {
  if (node.dependencies.values.includes(name) || node.dependencies.structural.includes(name)) {
    return true;
  }
  if (node.readsContainers.has(name)) {
    return true;
  }
  if (node.structuralReads.names.has(name)) {
    return true;
  }
  for (const prefix of node.structuralReads.prefixes) {
    if (name.startsWith(prefix)) {
      return true;
    }
  }
  return false;
}

/**
 * Collect the active closure of the requested roots. Nodes whose dependencies
 * do not exist yet are included as pending so a later revision can schedule
 * them; the missing dependency names are returned for diagnostics.
 */
export function collectClosure(graph, roots) {
  const active = new Map();
  const pending = new Map();
  const stack = [...roots];
  const visited = new Set();

  while (stack.length > 0) {
    const name = stack.pop();
    if (visited.has(name)) {
      continue;
    }
    visited.add(name);
    const node = graph.get(name);
    if (node === null) {
      throw new SopError('unknown_output', `Requested wire "${name}" does not exist.`, { wire: name });
    }
    active.set(name, node);
    for (const dependency of schedulableDependencies(node)) {
      if (graph.get(dependency) === null) {
        const missing = pending.get(name) ?? [];
        missing.push(dependency);
        pending.set(name, missing);
        continue;
      }
      stack.push(dependency);
    }
  }

  return { active, pending };
}

/**
 * Expand the active set with the wires that write to any container the active
 * set reads. A reader observes the revision that exists at the start of the
 * epoch, so the writers that contribute to that revision belong to the same
 * ingestion epoch and commit together. The expansion repeats until it reaches a
 * fixed point, so a container read indirectly through another derived view also
 * pulls in the writers of its source.
 */
export function expandContainerWriters(graph, { active, pending, roots = [] }) {
  const readContainers = new Set();
  const includeWithDependencies = (name) => {
    if (active.has(name)) {
      return;
    }
    const node = graph.get(name);
    if (node === null) {
      return;
    }
    active.set(name, node);
    for (const dependency of schedulableDependencies(node)) {
      if (graph.get(dependency) === null) {
        const missing = pending.get(name) ?? [];
        missing.push(dependency);
        pending.set(name, missing);
        continue;
      }
      includeWithDependencies(dependency);
    }
    for (const containerName of node.readsContainers) {
      readContainers.add(containerName);
    }
    // A patch targets a declared container, so the declaration belongs to the
    // epoch that stages the patch even when nothing reads the container.
    for (const containerName of node.dependencies.containerWrites) {
      includeWithDependencies(containerName);
    }
  };

  // Requesting a container by name asks for its current state, so the writers
  // that contribute to that state belong to the same epoch.
  const declaresContainer = new Set();
  for (const node of graph.nodes.values()) {
    if (isContainerDeclaration(node)) {
      declaresContainer.add(node.name);
    }
  }
  for (const root of roots) {
    if (declaresContainer.has(root)) {
      readContainers.add(root);
    }
  }

  for (const node of active.values()) {
    for (const name of node.readsContainers) {
      readContainers.add(name);
    }
  }

  const processed = new Set();
  while (readContainers.size > 0) {
    const containerName = readContainers.values().next().value;
    readContainers.delete(containerName);
    if (processed.has(containerName)) {
      continue;
    }
    processed.add(containerName);
    includeWithDependencies(containerName);
    for (const node of graph.nodes.values()) {
      if (node.dependencies.containerWrites.includes(containerName)) {
        includeWithDependencies(node.name);
      }
    }
  }

  // A dependency that nothing declares yet may be created by a wire that uses
  // the circuit mutation API, so include those producers as candidates.
  const missingNames = new Set();
  for (const names of pending.values()) {
    for (const name of names) {
      missingNames.add(name);
    }
  }
  if (missingNames.size > 0) {
    for (const node of graph.nodes.values()) {
      if (active.has(node.name) || node.isInput || node.command === null) {
        continue;
      }
      if (node.command.effectClass !== 'metaprogramming' && !(node.command.mayStage ?? []).includes('structural_transaction')) {
        continue;
      }
      includeWithDependencies(node.name);
    }
  }

  return { active, pending };
}

export function topologicalOrder(graph, active, { pending = new Map() } = {}) {
  const nodes = [...active.values()];
  const indegree = new Map();
  const successors = new Map();

  for (const node of nodes) {
    indegree.set(node.name, 0);
    successors.set(node.name, new Set());
  }

  for (const node of nodes) {
    for (const dependency of schedulableDependencies(node)) {
      if (!active.has(dependency)) {
        continue;
      }
      successors.get(dependency).add(node.name);
      indegree.set(node.name, indegree.get(node.name) + 1);
    }
  }

  const ready = nodes
    .filter((node) => indegree.get(node.name) === 0 && !(pending.get(node.name)?.length > 0))
    .sort(compareCreation);
  const order = [];

  while (ready.length > 0) {
    const node = ready.shift();
    order.push(node.name);
    for (const successorName of [...successors.get(node.name)].sort()) {
      const remaining = indegree.get(successorName) - 1;
      indegree.set(successorName, remaining);
      if (remaining === 0 && !(pending.get(successorName)?.length > 0)) {
        ready.push(graph.get(successorName));
        ready.sort(compareCreation);
      }
    }
  }

  const blocked = nodes.filter((node) => !order.includes(node.name));
  const hasMissingDependencies = blocked.some((node) => (pending.get(node.name)?.length ?? 0) > 0);
  if (blocked.length > 0 && !hasMissingDependencies) {
    const remaining = blocked.map((node) => node.name).sort();
    throw new SopError(
      'cycle_detected',
      `The active dependency graph contains a cycle involving: ${remaining.join(', ')}.`,
      { wires: remaining }
    );
  }

  return order;
}

export function compareCreation(left, right) {
  if (left.createdAt !== right.createdAt) {
    return left.createdAt - right.createdAt;
  }
  return left.name < right.name ? -1 : left.name > right.name ? 1 : 0;
}
