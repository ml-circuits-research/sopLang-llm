/**
 * Families for chapter 32 of the mathematical seed book: networks, connections, and paths.
 *
 * Every problem of this chapter is titled individually, so each printed template
 * has exactly one variant. A family parses the graph structure out of the
 * statement (nodes, links, arcs, costs, capacities) and runs a real graph
 * algorithm - breadth-first search, component counting, Euler and Hamilton
 * trails, cheapest-path enumeration - instead of substituting a fixed answer.
 * Every premise the solution needs is printed in the problem text, so all cases
 * are `no-knowledge`.
 */

export const chapter = 32;

/** Source text of helper functions, inlined into the `jsEval` computation body. */
function source(...functions) {
  return functions.map((fn) => fn.toString()).join('\n');
}

function edgeKey(a, b) { return a < b ? `${a}-${b}` : `${b}-${a}`; }

function chainEdges(chain) {
  const nodes = chain.split('-');
  return nodes.slice(1).map((node, index) => [nodes[index], node]);
}

function pairEdges(text) {
  const edges = [];
  for (const match of text.matchAll(/([A-Z](?:-[A-Z])+)/g)) edges.push(...chainEdges(match[1]));
  return edges;
}

function nodesOf(edges) {
  const nodes = new Set();
  for (const [a, b] of edges) { nodes.add(a); nodes.add(b); }
  return [...nodes].sort();
}

function adjacency(nodes, edges) {
  const map = new Map(nodes.map((node) => [node, []]));
  for (const [a, b] of edges) { map.get(a).push(b); map.get(b).push(a); }
  for (const list of map.values()) list.sort();
  return map;
}

function buildPath(previous, to) {
  if (!previous.has(to)) return null;
  const path = [];
  for (let node = to; node !== null; node = previous.get(node)) path.unshift(node);
  return path;
}

function searchPath(successorsOf, from, to) {
  const previous = new Map([[from, null]]);
  const queue = [from];
  while (queue.length > 0) {
    const node = queue.shift(); for (const next of successorsOf(node)) if (!previous.has(next)) { previous.set(next, node); queue.push(next); }
  }
  return buildPath(previous, to);
}

function shortestPath(nodes, edges, from, to) {
  const neighbours = adjacency(nodes, edges);
  return searchPath((node) => neighbours.get(node), from, to);
}

function shortestPathDirected(nodes, arcs, from, to) {
  const nexts = new Map(nodes.map((node) => [node, []]));
  for (const [a, b] of arcs) nexts.get(a).push(b);
  for (const list of nexts.values()) list.sort();
  return searchPath((node) => nexts.get(node), from, to);
}

function reachableIn(arcs, from, to) {
  const nexts = new Map();
  for (const [a, b] of arcs) nexts.set(a, [...(nexts.get(a) ?? []), b]);
  const seen = new Set([from]);
  const queue = [from];
  while (queue.length > 0) {
    for (const next of nexts.get(queue.shift()) ?? []) if (!seen.has(next)) { seen.add(next); queue.push(next); }
  }
  return seen.has(to);
}

function eccentricity(nodes, edges, node) {
  let farthest = 0;
  for (const other of nodes) farthest = Math.max(farthest, shortestPath(nodes, edges, node, other).length - 1);
  return farthest;
}

function countComponents(nodes, edges) {
  const neighbours = adjacency(nodes, edges);
  const seen = new Set();
  let count = 0;
  for (const start of nodes) {
    if (seen.has(start)) continue; count += 1; const stack = [start]; seen.add(start); while (stack.length > 0) {
      for (const next of neighbours.get(stack.pop())) if (!seen.has(next)) { seen.add(next); stack.push(next); }
    }
  }
  return count;
}

function joinComponents(components) {
  const words = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five'];
  return { links: components.length - 1, word: words[components.length - 1], example: [components[0].at(-1), components[1][0]] };
}

function eulerianTrail(edges, start, mustReturn) {
  const path = [start];
  const used = new Set();
  const visit = () => {
    if (used.size === edges.length) return mustReturn === false || path.at(-1) === start; const node = path.at(-1); for (let index = 0; index < edges.length; index += 1) {
      const [a, b] = edges[index]; if (used.has(index) || (a !== node && b !== node)) continue; used.add(index); path.push(a === node ? b : a); if (visit()) return true; path.pop();
      used.delete(index);
    }
    return false;
  };
  return visit() ? path : null;
}

function hamiltonianPath(nodes, edges, start) {
  const neighbours = adjacency(nodes, edges);
  const path = [start];
  const used = new Set([start]);
  const extend = () => {
    if (path.length === nodes.length) return true; for (const next of neighbours.get(path.at(-1))) {
      if (used.has(next)) continue; path.push(next); used.add(next); if (extend()) return true; path.pop(); used.delete(next);
    }
    return false;
  };
  return extend() ? path : null;
}

function cheapestPath(nodes, edges, costs, from, to) {
  const neighbours = adjacency(nodes, edges);
  let best = null;
  const path = [from];
  const used = new Set([from]);
  const walk = () => {
    const node = path.at(-1); if (node === to) {
      let cost = 0; for (let index = 1; index < path.length; index += 1) cost += costs.get(edgeKey(path[index - 1], path[index]));
      if (best === null || cost < best.cost) best = { path: [...path], cost }; return;
    }
    for (const next of neighbours.get(node)) {
      if (used.has(next)) continue; used.add(next); path.push(next); walk(); path.pop(); used.delete(next);
    }
  };
  walk();
  return best;
}

export const cases = [
  {
    template: 'A network of points and links', type: 'a-network-of-points-and-links', category: 'no-knowledge',
    parse(statement) {
      const points = statement.match(/points ([A-Z](?:, [A-Z])*(?: and [A-Z])?)/); const edges = pairEdges(statement); const q = statement.match(/from ([A-Z]) to ([A-Z])/);
      if (points === null || edges.length === 0 || q === null) throw new Error('the points, links or question are missing');
      return { nodes: points[1].split(/, | and /), edges, from: q[1], to: q[2] };
    },
    solve(slots) {
      const path = shortestPath(slots.nodes, slots.edges, slots.from, slots.to); if (path === null) throw new Error('the endpoints are not connected'); return { path };
    },
    render(solution) { return `Yes, through ${solution.path.slice(1, -1).join('-')}.`; },
    compute: ['const slots = $slots;', source(adjacency, buildPath, searchPath, shortestPath),
      'const path = shortestPath(slots.nodes, slots.edges, slots.from, slots.to);',
      'if (path === null) { throw new Error("the endpoints are not connected"); }',
      'return "Yes, through " + path.slice(1, -1).join("-") + ".";'].join('\n'),
    explain(slots, solution) { return ['A direct link can be travelled in either direction, so the network is an undirected graph whose edges are the printed links.', `Breadth-first search from ${slots.from} reaches ${slots.to} in the fewest links, through ${solution.path.slice(1, -1).join('-')}.`]; }
  },
  {
    template: 'Direct link versus indirect path', type: 'direct-link-versus-indirect-path', category: 'no-knowledge',
    parse(statement) {
      const edges = pairEdges(statement); const q = statement.match(/are ([A-Z]) and ([A-Z]) direct neighbors/);
      if (edges.length === 0 || q === null) throw new Error('the links or the questioned nodes are missing'); return { nodes: nodesOf(edges), edges, from: q[1], to: q[2] };
    },
    solve(slots) {
      const direct = slots.edges.some(([from, to]) => edgeKey(from, to) === edgeKey(slots.from, slots.to));
      return { direct, connected: shortestPath(slots.nodes, slots.edges, slots.from, slots.to) !== null };
    },
    render(solution) { return `${solution.direct ? 'They are direct neighbors' : 'They are not direct neighbors'}; ` +
      `${solution.connected ? 'yes, they are connected' : 'no, they are not connected'}.`; },
    compute: ['const slots = $slots;', source(edgeKey, adjacency, buildPath, searchPath, shortestPath),
      'const direct = slots.edges.some(([from, to]) => edgeKey(from, to) === edgeKey(slots.from, slots.to));',
      'const path = shortestPath(slots.nodes, slots.edges, slots.from, slots.to);',
      'const neighbours = direct ? "They are direct neighbors" : "They are not direct neighbors";',
      'return neighbours + "; " + (path !== null ? "yes, they are connected" : "no, they are not connected") + ".";'].join('\n'),
    explain(slots) { return [`A direct link between ${slots.from} and ${slots.to} would make them direct neighbors, so the edge list decides that part.`, 'Connectivity is weaker than adjacency: it asks only whether some chain of links joins the two nodes.']; }
  },
  {
    template: 'The degree of a node', type: 'the-degree-of-a-node', category: 'no-knowledge',
    parse(statement) {
      const m = statement.match(/Node ([A-Z]) has links to ([A-Z](?:, [A-Z])*)/); if (m === null) throw new Error('the node or its links are missing');
      return { node: m[1], neighbours: m[2].split(/, /) };
    },
    solve(slots) {
      if (slots.neighbours.includes(slots.node)) throw new Error('a node cannot be its own neighbour'); return { degree: slots.neighbours.length };
    },
    render(solution) { return `${solution.degree}.`; },
    compute: ['const slots = $slots;', 'if (slots.neighbours.includes(slots.node)) { throw new Error("a node cannot be its own neighbour"); }', 'return String(slots.neighbours.length) + ".";'].join('\n'),
    explain(slots, solution) { return [`The degree of ${slots.node} counts the direct links that touch it, so it is the number of distinct neighbours.`, `Its neighbours are ${slots.neighbours.join(', ')}, which gives a degree of ${solution.degree}.`]; }
  },
  {
    template: 'Isolated node', type: 'isolated-node', category: 'no-knowledge',
    parse(statement) {
      const m = statement.match(/node ([A-Z]) has no links/); if (m === null) throw new Error('the isolated node is missing'); return { node: m[1], neighbours: [] };
    },
    solve(slots) { return { degree: slots.neighbours.length }; },
    render(solution) { return solution.degree > 0 ? 'Yes.' : 'No.'; },
    compute: ['const slots = $slots;', 'return slots.neighbours.length > 0 ? "Yes." : "No.";'].join('\n'),
    explain(slots, solution) { return [`With degree ${solution.degree}, ${slots.node} has no first step to leave along, and every path must start with such a step.`, 'Therefore no path from the isolated node to another node can exist in this network.']; }
  },
  {
    template: 'Shortest path by number of links', type: 'shortest-path-by-number-of-links', category: 'no-knowledge',
    parse(statement) {
      const edges = pairEdges(statement); const q = statement.match(/from ([A-Z]) to ([A-Z])/);
      if (edges.length === 0 || q === null) throw new Error('the links or the endpoints are missing'); return { nodes: nodesOf(edges), edges, from: q[1], to: q[2] };
    },
    solve(slots) {
      const path = shortestPath(slots.nodes, slots.edges, slots.from, slots.to); if (path === null) throw new Error('the endpoints are not connected'); return { path };
    },
    render(solution) { return `${solution.path.join('-')}, with ${solution.path.length - 1} links.`; },
    compute: ['const slots = $slots;', source(adjacency, buildPath, searchPath, shortestPath),
      'const path = shortestPath(slots.nodes, slots.edges, slots.from, slots.to);',
      'if (path === null) { throw new Error("the endpoints are not connected"); }',
      'return path.join("-") + ", with " + (path.length - 1) + " links.";'].join('\n'),
    explain(slots, solution) { return ['Counting links amounts to counting edges, so the shortest route is found by exploring the network in widening layers from the start.', `The first time ${slots.to} is reached its layer is ${solution.path.length - 1}, the fewest possible, along ${solution.path.join('-')}.`]; }
  },
  {
    template: 'Path blocked after removing an edge', type: 'path-blocked-after-removing-an-edge', category: 'no-knowledge',
    parse(statement) {
      const chain = statement.match(/chain ([A-Z](?:-[A-Z])+)/); const gone = statement.match(/If ([A-Z])-([A-Z]) is removed/); const q = statement.match(/from ([A-Z]) to ([A-Z])/);
      if (chain === null || gone === null || q === null) throw new Error('the chain, removed link or question are missing');
      const edges = chainEdges(chain[1]).filter(([a, b]) => edgeKey(a, b) !== edgeKey(gone[1], gone[2])); return { nodes: chain[1].split('-'), edges, from: q[1], to: q[2] };
    },
    solve(slots) { return { connected: shortestPath(slots.nodes, slots.edges, slots.from, slots.to) !== null }; },
    render(solution) { return solution.connected ? 'Yes.' : 'No.'; },
    compute: ['const slots = $slots;', source(adjacency, buildPath, searchPath, shortestPath),
      'return shortestPath(slots.nodes, slots.edges, slots.from, slots.to) !== null ? "Yes." : "No.";'].join('\n'),
    explain(slots, solution) { return ['Removing one link deletes it from the edge set, so every route that used it disappears with it.', `After the removal the walk from ${slots.from} ${solution.connected ? 'still' : 'does not'} reach ${slots.to}.`]; }
  },
  {
    template: 'Alternative route after a failure', type: 'alternative-route-after-a-failure', category: 'no-knowledge',
    parse(statement) {
      const broken = statement.match(/link ([A-Z])-([A-Z]) breaks/); const q = statement.match(/path ([A-Z])→([A-Z])/); const edges = pairEdges(statement);
      if (broken === null || q === null || edges.length === 0) throw new Error('the links, broken link or question are missing');
      const kept = edges.filter(([a, b]) => edgeKey(a, b) !== edgeKey(broken[1], broken[2])); return { nodes: nodesOf(edges), edges: kept, from: q[1], to: q[2] };
    },
    solve(slots) {
      const path = shortestPath(slots.nodes, slots.edges, slots.from, slots.to); return { connected: path !== null, path };
    },
    render(solution) { return solution.connected ? `Yes, ${solution.path.join('-')}.` : 'No.'; },
    compute: ['const slots = $slots;', source(adjacency, buildPath, searchPath, shortestPath),
      'const path = shortestPath(slots.nodes, slots.edges, slots.from, slots.to);',
      'return path !== null ? "Yes, " + path.join("-") + "." : "No.";'].join('\n'),
    explain(slots, solution) { return ['Deleting the broken link leaves the other links in place, so any route that avoids it may still survive.', `Searching the remaining network shows that ${slots.from} still reaches ${slots.to} along ${solution.path.join('-')}.`]; }
  },
  {
    template: 'Connected network', type: 'connected-network', category: 'no-knowledge',
    parse(statement) {
      const list = statement.match(/Nodes ([A-Z](?:, [A-Z])*(?: and [A-Z])?) have the links/); const edges = pairEdges(statement);
      if (list === null || edges.length === 0) throw new Error('the nodes or the links are missing'); return { nodes: list[1].split(/, | and /), edges };
    },
    solve(slots) { return { groups: countComponents(slots.nodes, slots.edges) }; },
    render(solution) { return solution.groups === 1 ? 'Yes.' : 'No.'; },
    compute: ['const slots = $slots;', source(adjacency, countComponents),
      'return countComponents(slots.nodes, slots.edges) === 1 ? "Yes." : "No.";'].join('\n'),
    explain() { return ['A network is connected when every node is reachable from every other node, which is the same as having a single group of nodes.', 'Counting the groups of the printed links gives one group, so every node can be reached from every other node.']; }
  },
  {
    template: 'Two separate components', type: 'two-separate-components', category: 'no-knowledge',
    parse(statement) {
      const edges = pairEdges(statement); if (edges.length === 0) throw new Error('the links are missing'); return { nodes: nodesOf(edges), edges };
    },
    solve(slots) { return { groups: countComponents(slots.nodes, slots.edges) }; },
    render(solution) { return `${solution.groups} groups.`; },
    compute: ['const slots = $slots;', source(adjacency, countComponents),
      'return countComponents(slots.nodes, slots.edges) + " groups.";'].join('\n'),
    explain(slots, solution) { return ['A group holds nodes that can travel to each other along links, so two nodes share a group exactly when some path joins them.', `Walking the links from every unvisited node discovers ${solution.groups} groups, because no link crosses between them.`]; }
  },
  {
    template: 'Add one link to connect the network', type: 'add-one-link-to-connect-the-network', category: 'no-knowledge',
    parse(statement) {
      const components = [...statement.matchAll(/\{([A-Z](?:,[A-Z])*)\}/g)].map((m) => m[1].split(','));
      if (components.length < 2) throw new Error('fewer than two components are printed'); return { components };
    },
    solve(slots) { return joinComponents(slots.components); },
    render(solution) { return `${solution.word} link${solution.links === 1 ? '' : 's'}, for example ${solution.example.join('-')}.`; },
    compute: ['const slots = $slots;', source(joinComponents),
      'const joined = joinComponents(slots.components);',
      'return joined.word + " link" + (joined.links === 1 ? "" : "s") + ", for example " + joined.example.join("-") + ".";'].join('\n'),
    explain(slots, solution) { return [`With ${slots.components.length} separate groups, one link between any node of one group and any node of another merges those two groups.`, `Each link therefore joins two groups, so ${solution.links} link${solution.links === 1 ? '' : 's'} joins all the groups into one network.`]; }
  },
  {
    template: 'Number of links in a small complete network', type: 'number-of-links-in-a-small-complete-network', category: 'no-knowledge',
    parse(statement) {
      const m = statement.match(/with (\d+) nodes/); if (m === null) throw new Error('the number of nodes is missing'); return { nodes: Number(m[1]) };
    },
    solve(slots) {
      if (slots.nodes < 2) throw new Error('a complete network needs at least two nodes'); return { edges: (slots.nodes * (slots.nodes - 1)) / 2 };
    },
    render(solution) { return `${solution.edges}.`; },
    compute: ['const slots = $slots;', 'const n = slots.nodes;', 'if (n < 2) { throw new Error("a complete network needs at least two nodes"); }', 'return String((n * (n - 1)) / 2) + ".";'].join('\n'),
    explain(slots, solution) { return [`Every link is a pair of distinct nodes, and each of the ${slots.nodes} nodes is paired with the other ${slots.nodes - 1}.`, `Counting each pair once halves the ${slots.nodes * (slots.nodes - 1)} ordered joins, giving ${solution.edges} links.`]; }
  },
  {
    template: 'Sum of degrees in a small network', type: 'sum-of-degrees-in-a-small-network', category: 'no-knowledge',
    parse(statement) {
      const list = statement.match(/edges ([A-Z]{2}(?:, [A-Z]{2})*)/); const asked = statement.match(/degrees of ([A-Z](?:, [A-Z])*)/);
      if (list === null || asked === null) throw new Error('the edges or the asked nodes are missing'); const edges = [...list[1].matchAll(/([A-Z])([A-Z])/g)].map((m) => [m[1], m[2]]);
      return { nodes: asked[1].split(/, /), edges };
    },
    solve(slots) {
      const degrees = slots.nodes.map((node) => slots.edges.filter(([a, b]) => a === node || b === node).length);
      return { degrees, sum: degrees.reduce((total, value) => total + value, 0) };
    },
    render(solution) { return `${solution.degrees.join(', ')}; sum ${solution.sum}.`; },
    compute: ['const slots = $slots;',
      'const degrees = slots.nodes.map((node) => slots.edges.filter((e) => e[0] === node || e[1] === node).length);',
      'let sum = 0; for (const value of degrees) { sum += value; }',
      'return degrees.join(", ") + "; sum " + sum + ".";'].join('\n'),
    explain(slots, solution) { return ['The degree of a node is the number of edges that touch it, so each node is counted once per incident edge.', `The nodes have degrees ${solution.degrees.join(', ')}, and adding them gives the total ${solution.sum}.`]; }
  },
  {
    template: 'Can the sum of degrees be odd?', type: 'can-the-sum-of-degrees-be-odd', category: 'no-knowledge',
    parse(statement) {
      const m = statement.match(/total sum of (\d+)/); if (m === null) throw new Error('the claimed total sum is missing'); return { sum: Number(m[1]) };
    },
    solve(slots) { return { correct: slots.sum % 2 === 0 }; },
    render(solution) { return solution.correct ? 'Yes.' : 'No.'; },
    compute: ['const slots = $slots;', 'return slots.sum % 2 === 0 ? "Yes." : "No.";'].join('\n'),
    explain(slots, solution) { return ['Each link contributes 1 to the degree of each of its two endpoints, so every link adds exactly 2 to the total sum.', `The total is therefore twice the number of links and must be even, so a total of ${slots.sum} ${solution.correct ? 'is possible' : 'cannot be correct'}.`]; }
  },
  {
    template: 'Node with the most links', type: 'node-with-the-most-links', category: 'no-knowledge',
    parse(statement) {
      const degrees = [...statement.matchAll(/([A-Z])=(\d+)/g)].map((m) => [m[1], Number(m[2])]); if (degrees.length === 0) throw new Error('the degrees are missing');
      return { degrees };
    },
    solve(slots) {
      let best = slots.degrees[0]; for (const entry of slots.degrees) { if (entry[1] > best[1]) best = entry; }
      return { node: best[0], degree: best[1] };
    },
    render(solution) { return `${solution.node}.`; },
    compute: ['const slots = $slots;', 'let best = slots.degrees[0];',
      'for (const entry of slots.degrees) { if (entry[1] > best[1]) { best = entry; } }',
      'return best[0] + ".";'].join('\n'),
    explain(slots, solution) { return ['The node with the most direct links is simply the node whose printed degree is the largest.', `Comparing ${slots.degrees.map(([node, degree]) => `${node}=${degree}`).join(', ')} gives the maximum ${solution.degree} at ${solution.node}.`]; }
  },
  {
    template: 'Distance in a network', type: 'distance-in-a-network', category: 'no-knowledge',
    parse(statement) {
      const chain = statement.match(/chain ([A-Z](?:-[A-Z])+)/); const q = statement.match(/between ([A-Z]) and ([A-Z])/);
      if (chain === null || q === null) throw new Error('the chain or the questioned nodes are missing');
      return { nodes: chain[1].split('-'), edges: chainEdges(chain[1]), from: q[1], to: q[2] };
    },
    solve(slots) {
      const path = shortestPath(slots.nodes, slots.edges, slots.from, slots.to); if (path === null) throw new Error('the two nodes are not connected');
      return { distance: path.length - 1 };
    },
    render(solution) { return `${solution.distance}.`; },
    compute: ['const slots = $slots;', source(adjacency, buildPath, searchPath, shortestPath),
      'const path = shortestPath(slots.nodes, slots.edges, slots.from, slots.to);',
      'if (path === null) { throw new Error("the two nodes are not connected"); }',
      'return String(path.length - 1) + ".";'].join('\n'),
    explain(slots, solution) { return ['The distance is the minimum number of links between the two nodes, so it is the number of edges of a shortest path.', `Travelling along the chain from ${slots.from} to ${slots.to} takes ${solution.distance} links, and no route uses fewer.`]; }
  },
  {
    template: 'Center by maximum distance', type: 'center-by-maximum-distance', category: 'no-knowledge',
    parse(statement) {
      const chain = statement.match(/chain ([A-Z](?:-[A-Z])+)/); const candidates = statement.match(/Compare ([A-Z](?:, [A-Z])*)\./);
      if (chain === null || candidates === null) throw new Error('the chain or the candidates are missing');
      return { nodes: chain[1].split('-'), edges: chainEdges(chain[1]), candidates: candidates[1].split(', ') };
    },
    solve(slots) {
      let best = null; for (const candidate of slots.candidates) {
        const d = eccentricity(slots.nodes, slots.edges, candidate); if (best === null || d < best.d) best = { node: candidate, d };
      }
      return best;
    },
    render(solution) { return `${solution.node}.`; },
    compute: ['const slots = $slots;', source(adjacency, buildPath, searchPath, shortestPath, eccentricity),
      'let best = null;',
      'for (const candidate of slots.candidates) { const d = eccentricity(slots.nodes, slots.edges, candidate); if (best === null || d < best.d) { best = { node: candidate, d }; } }',
      'return best.node + ".";'].join('\n'),
    explain(slots, solution) { return ['For each candidate the important number is its eccentricity, the distance to the farthest node of the chain.', `The smallest farthest distance is ${solution.d}, reached at ${solution.node}, so that node is the best centre.`]; }
  },
  {
    template: 'Visit all nodes without repetition', type: 'visit-all-nodes-without-repetition', category: 'no-knowledge',
    parse(statement) {
      const edges = pairEdges(statement); const start = statement.match(/start at ([A-Z]) and visit all/);
      if (edges.length === 0 || start === null) throw new Error('the links or the starting node are missing'); return { nodes: nodesOf(edges), edges, start: start[1] };
    },
    solve(slots) {
      const path = hamiltonianPath(slots.nodes, slots.edges, slots.start); return { path };
    },
    render(solution) { return `Yes: ${solution.path.join('-')}.`; },
    compute: ['const slots = $slots;', source(adjacency, hamiltonianPath),
      'const path = hamiltonianPath(slots.nodes, slots.edges, slots.start);',
      'return "Yes: " + path.join("-") + ".";'].join('\n'),
    explain(slots, solution) { return ['Visiting every node exactly once is a path that uses all nodes and never repeats one, so a walk can be extended and backed out of dead ends.', `Starting at ${slots.start}, the search finds the visiting order ${solution.path.join('-')}, which covers all ${slots.nodes.length} nodes.`]; }
  },
  {
    template: 'Traverse each link exactly once', type: 'traverse-each-link-exactly-once', category: 'no-knowledge',
    parse(statement) {
      const list = statement.match(/links ([A-Z]{2}(?:, [A-Z]{2})*(?: and [A-Z]{2})?)/); const start = statement.match(/start at ([A-Z])/);
      if (list === null || start === null) throw new Error('the links or the starting node are missing');
      const edges = [...list[1].matchAll(/([A-Z])([A-Z])/g)].map((m) => [m[1], m[2]]); return { nodes: nodesOf(edges), edges, start: start[1] };
    },
    solve(slots) { return { path: eulerianTrail(slots.edges, slots.start, true) }; },
    render(solution) { return `Yes: ${solution.path.join('-')}.`; },
    compute: ['const slots = $slots;', source(eulerianTrail),
      'const path = eulerianTrail(slots.edges, slots.start, true);',
      'return "Yes: " + path.join("-") + ".";'].join('\n'),
    explain(slots, solution) { return ['A closed walk that uses each link exactly once returns to its starting node after covering every link.', `Trying the links from ${slots.start} and never repeating one produces the circuit ${solution.path.join('-')}, which closes the tour.`]; }
  },
  {
    template: 'Edge trail in a chain', type: 'edge-trail-in-a-chain', category: 'no-knowledge',
    parse(statement) {
      const chain = statement.match(/chain ([A-Z](?:-[A-Z])+)/); if (chain === null) throw new Error('the chain is missing');
      return { nodes: chain[1].split('-'), edges: chainEdges(chain[1]) };
    },
    solve(slots) { return { possible: eulerianTrail(slots.edges, slots.nodes[0], false) !== null }; },
    render(solution) { return solution.possible ? 'Yes.' : 'No.'; },
    compute: ['const slots = $slots;', source(eulerianTrail),
      'return eulerianTrail(slots.edges, slots.nodes[0], false) !== null ? "Yes." : "No.";'].join('\n'),
    explain(slots) { return ['A single trail must use every link of the chain once, without repeating any of them.', `Starting at one end and following the chain uses all ${slots.edges.length} links exactly once, so such a trail exists.`]; }
  },
  {
    template: 'Direction in a one-way network', type: 'direction-in-a-one-way-network', category: 'no-knowledge',
    parse(statement) {
      const arcs = [...statement.matchAll(/([A-Z])→([A-Z])/g)].map((m) => [m[1], m[2]]); const q = statement.match(/from ([A-Z]) to ([A-Z])/);
      if (arcs.length === 0 || q === null) throw new Error('the roads or the questioned nodes are missing'); return { nodes: nodesOf(arcs), arcs, from: q[1], to: q[2] };
    },
    solve(slots) {
      const path = shortestPathDirected(slots.nodes, slots.arcs, slots.from, slots.to); return { path };
    },
    render(solution) { return `Yes, through ${solution.path.slice(1, -1).join('-')}.`; },
    compute: ['const slots = $slots;', source(buildPath, searchPath, shortestPathDirected),
      'const path = shortestPathDirected(slots.nodes, slots.arcs, slots.from, slots.to);',
      'return "Yes, through " + path.slice(1, -1).join("-") + ".";'].join('\n'),
    explain(slots, solution) { return ['The arrows make the moves one-directional, so a road may be used only from its tail to its head.', `Following the arrows from ${slots.from} leads through ${solution.path.slice(1, -1).join('-')} to ${slots.to}.`]; }
  },
  {
    template: 'One-way direction that blocks the return', type: 'one-way-direction-that-blocks-the-return', category: 'no-knowledge',
    parse(statement) {
      const roads = statement.match(/only ([A-Z]→[A-Z](?:(?:,| and) [A-Z]→[A-Z])*)\./); const queries = [...statement.matchAll(/([A-Z])→([A-Z])\?/g)].map((m) => [m[1], m[2]]);
      if (roads === null || queries.length === 0) throw new Error('the roads or the questions are missing');
      const arcs = [...roads[1].matchAll(/([A-Z])→([A-Z])/g)].map((m) => [m[1], m[2]]); return { nodes: nodesOf(arcs), arcs, queries };
    },
    solve(slots) {
      return { queries: slots.queries, answers: slots.queries.map(([from, to]) => reachableIn(slots.arcs, from, to)) };
    },
    render(solution) { return `${solution.queries.map(([from, to], i) => `${from}→${to}: ${solution.answers[i] ? 'yes' : 'no'}`).join('; ')}.`; },
    compute: ['const slots = $slots;', source(reachableIn),
      'const answers = slots.queries.map(([from, to]) => from + "→" + to + ": " + (reachableIn(slots.arcs, from, to) ? "yes" : "no"));',
      'return answers.join("; ") + ".";'].join('\n'),
    explain(slots) { return ['Because every road is one-way, a route exists only when its arrows allow travelling from the start to the destination.', `Searching along the arrows decides which of the questions ${slots.queries.map(([from, to]) => `${from}→${to}`).join(' and ')} can be answered yes.`]; }
  },
  {
    template: 'Cost on links', type: 'cost-on-links', category: 'no-knowledge',
    parse(statement) {
      const weighted = [...statement.matchAll(/([A-Z])-([A-Z])=(\d+)/g)]; const q = statement.match(/path ([A-Z])→([A-Z])/);
      if (weighted.length === 0 || q === null) throw new Error('the costs or the endpoints are missing'); const costs = {};
      for (const m of weighted) { costs[edgeKey(m[1], m[2])] = Number(m[3]); }
      const edges = weighted.map((m) => [m[1], m[2]]); return { nodes: nodesOf(edges), edges, costs, from: q[1], to: q[2] };
    },
    solve(slots) {
      const best = cheapestPath(slots.nodes, slots.edges, new Map(Object.entries(slots.costs)), slots.from, slots.to);
      if (best === null) throw new Error('the endpoints are not connected'); return best;
    },
    render(solution) { return `${solution.path.join('-')}, cost ${solution.cost}.`; },
    compute: ['const slots = $slots;', source(edgeKey, adjacency, cheapestPath),
      'const costs = new Map(Object.entries(slots.costs));',
      'const best = cheapestPath(slots.nodes, slots.edges, costs, slots.from, slots.to);',
      'if (best === null) { throw new Error("the endpoints are not connected"); }',
      'return best.path.join("-") + ", cost " + best.cost + ".";'].join('\n'),
    explain(slots, solution) { return ['With costs on the links the cheapest route is not always the one with the fewest links, so every simple route is compared by total cost.', `Adding the costs along each route shows ${solution.path.join('-')} is cheapest, at a total of ${solution.cost}.`]; }
  },
  {
    template: 'A path with more edges can be cheaper', type: 'a-path-with-more-edges-can-be-cheaper', category: 'no-knowledge',
    parse(statement) {
      const direct = statement.match(/Direct ([A-Z])-([A-Z]) costs (\d+)/); const route = statement.match(/route ([A-Z](?:-[A-Z])+) has costs ([^.]+)\./);
      if (direct === null || route === null) throw new Error('the direct link or the route is missing');
      const costs = route[2].split(/[,\s]+|and/).filter((value) => value !== '').map(Number); return {
        direct: { nodes: [direct[1], direct[2]], cost: Number(direct[3]) },
        route: { nodes: route[1].split('-'), costs }
      };
    },
    solve(slots) {
      if (slots.route.costs.length !== slots.route.nodes.length - 1) throw new Error('the route cost list does not match its links');
      const routeCost = slots.route.costs.reduce((total, value) => total + value, 0); return routeCost < slots.direct.cost ? { path: slots.route.nodes, cost: routeCost }
        : { path: slots.direct.nodes, cost: slots.direct.cost };
    },
    render(solution) { return `${solution.path.join('-')}, cost ${solution.cost}.`; },
    compute: ['const slots = $slots;',
      'if (slots.route.costs.length !== slots.route.nodes.length - 1) { throw new Error("the route cost list does not match its links"); }',
      'let routeCost = 0; for (const value of slots.route.costs) { routeCost += value; }',
      'let cost = slots.direct.cost; let path = slots.direct.nodes;',
      'if (routeCost < slots.direct.cost) { cost = routeCost; path = slots.route.nodes; }',
      'return path.join("-") + ", cost " + cost + ".";'].join('\n'),
    explain(slots, solution) { return [`The direct link costs ${slots.direct.cost}, while the route through ${slots.route.nodes.slice(1, -1).join('-')} costs ${slots.route.costs.join(' + ')}.`, `Comparing the two totals shows the ${solution.path.length === 2 ? 'direct link' : 'longer route'} is cheaper, at ${solution.cost}.`]; }
  },
  {
    template: 'A network with edge capacity', type: 'a-network-with-edge-capacity', category: 'no-knowledge',
    parse(statement) {
      const capacity = statement.match(/at most (\d+) boxes per trip/); const boxes = statement.match(/move (\d+) boxes/);
      if (capacity === null || boxes === null) throw new Error('the capacity or the number of boxes is missing'); return { capacity: Number(capacity[1]), boxes: Number(boxes[1]) };
    },
    solve(slots) {
      if (slots.capacity <= 0) throw new Error('the capacity must be positive'); return { trips: Math.ceil(slots.boxes / slots.capacity) };
    },
    render(solution) { return `${solution.trips} trips.`; },
    compute: ['const slots = $slots;', 'if (slots.capacity <= 0) { throw new Error("the capacity must be positive"); }', 'return String(Math.ceil(slots.boxes / slots.capacity)) + " trips.";'].join('\n'),
    explain(slots, solution) { return [`Each trip carries at most ${slots.capacity} boxes, so the boxes divide into groups of that size.`, `${slots.boxes} boxes need ${solution.trips} trips, because the boxes left over after full trips still need one more trip.`]; }
  },
  {
    template: 'Critical node in a network', type: 'critical-node-in-a-network', category: 'no-knowledge',
    parse(statement) {
      const removed = statement.match(/If node ([A-Z]) and all its links are removed/); const source = statement.match(/can ([A-Z]) still reach/);
      const targets = statement.match(/still reach ([A-Z](?: or [A-Z])*)/); const edges = pairEdges(statement);
      if (removed === null || source === null || targets === null || edges.length === 0) throw new Error('the network statement is incomplete');
      return { nodes: nodesOf(edges), edges, removed: removed[1], source: source[1], targets: targets[1].split(' or ') };
    },
    solve(slots) {
      const kept = slots.edges.filter(([a, b]) => a !== slots.removed && b !== slots.removed);
      const unreachable = slots.targets.filter((target) => shortestPath(slots.nodes, kept, slots.source, target) === null);
      return { unreachable, source: slots.source, targets: slots.targets };
    },
    render(solution) { return `No; ${solution.source} can no longer reach ${solution.unreachable.join(' or ')}.`; },
    compute: ['const slots = $slots;', source(adjacency, buildPath, searchPath, shortestPath),
      'const kept = slots.edges.filter(([a, b]) => a !== slots.removed && b !== slots.removed);',
      'const unreachable = slots.targets.filter((target) => shortestPath(slots.nodes, kept, slots.source, target) === null);',
      'return "No; " + slots.source + " can no longer reach " + unreachable.join(" or ") + ".";'].join('\n'),
    explain(slots, solution) { return [`Removing ${slots.removed} also removes every link that touches it, so the network falls into separate pieces.`, `After the removal ${slots.source} can no longer reach ${solution.unreachable.join(' or ')}: ${slots.removed} was the only node joining them.`]; }
  }
];
