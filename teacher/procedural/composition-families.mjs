/**
 * Composition families: one family per declared composition in the inventory.
 *
 * The inventory of `compositions.mjs` is the authority; this module turns each
 * entry into a procedural family the pilot can sample, verify, and split. Nothing
 * here decides what a composition is: the chain is read from the entry, the
 * sentence is built from the chain's own operator descriptions, and the circuit is
 * derived from the same chain, so a composition cannot drift between the statement,
 * the oracle, and the plan.
 *
 * Every family drawn from here shares one shape:
 *
 * - `sample` draws a ledger of whole numbers and the parameters the chain reads;
 * - `statement` renders the ledger and then each operator's own sentence, so the
 *   wording of a stage is the wording of the operator that performs it;
 * - `parse` reads the ledger, the parameters, and the composition back, and refuses
 *   a statement whose sentence sequence does not match its own chain;
 * - `solve` walks the chain to produce the answer, and `compute` walks it again as
 *   the circuit body, so the oracle and the plan are two transcriptions of the chain
 *   rather than one being copied from the other.
 *
 * The `parse` refusal is what makes the inventory a measurement rather than a
 * labelling exercise: a family accepts only statements that ask for its own
 * composition, so a model that answers a sibling's composition under this family's
 * name is not rewarded by a coincidence of wording.
 */

import { COMPOSITIONS, OPERATORS, HELD_OUT, parseEdges } from './compositions.mjs';

const DEPOTS = ['north depot', 'river depot', 'hill depot', 'market depot', 'harbour depot'];
const UNITS = ['crates', 'parts', 'tickets', 'litres', 'sheets'];

/** The composition entries a family may be built from, split as the inventory declares. */
export const TRAINED_COMPOSITIONS = Object.freeze(COMPOSITIONS.filter((entry) => !HELD_OUT.includes(entry.id)));
export const HELD_OUT_COMPOSITIONS = Object.freeze(COMPOSITIONS.filter((entry) => HELD_OUT.includes(entry.id)));

/**
 * The answer report of a numeric terminal operator: the statement asks for the
 * result in the ledger's unit, the answer is printed with the generic "units"
 * word, and the circuit asserts a whole, non-negative number. The generic word
 * is deliberate: a statement that prints "N crates" would carry its own answer
 * whenever N is one of the recorded values, while "N units" can never collide
 * with the ledger. Operators whose answer is a different unit or a word carry
 * their own `report` object instead.
 */
const DEFAULT_REPORT = Object.freeze({
  instruction: (slots) => `Report the result in ${slots.unit}.`,
  parseInstruction: (instruction, slots) => {
    const match = /^Report the result in ([a-z]+)\.$/.exec(instruction);
    if (match === null) {
      throw new Error('the statement does not report the result in a unit');
    }
    if (match[1] !== slots.unit) {
      throw new Error('the reported unit does not match the recorded unit');
    }
  },
  render: (answer) => `${answer} units.`,
  phrase: (answer, slots) => `${answer} ${slots.unit}`,
  ret: 'return current + " units.";',
  probe: 'probe(Number.isInteger(current) && current >= 0, "the answer must be a whole number that is not negative");'
});

/** The report of the composition's terminal operator, or the numeric default. */
function reportFor(composition) {
  return OPERATORS[composition.chain.at(-1)].report ?? DEFAULT_REPORT;
}

function renderLedger(values, unit) {
  const printed = values.map((value) => `${value}`);
  return `${printed.slice(0, -1).join(', ')} and ${printed.at(-1)} ${unit}`;
}

function readLedger(text) {
  const numbers = [];
  for (const part of text.split(',')) {
    for (const piece of part.split(' and ')) {
      const match = /^\s*(\d+)/.exec(piece);
      if (match !== null) {
        numbers.push(Number(match[1]));
      }
    }
  }
  return numbers;
}

/**
 * Draw an edge list over the distinct ledger values, in ascending order. Each
 * adjacent pair is kept with a fixed probability, so the list is a set of path
 * segments: a node's degree is one or two, and whether two nodes are joined is
 * the kind of adjacency question the operator asks. The retry loop of `drawSlots`
 * guarantees the chain's own node appears in at least one edge.
 */
function drawEdges(values, random) {
  const nodes = [...new Set(values)].sort((left, right) => left - right);
  const edges = [];
  for (let index = 0; index < nodes.length - 1; index += 1) {
    if (random() < 0.6) {
      edges.push([nodes[index], nodes[index + 1]]);
    }
  }
  if (edges.length === 0) {
    edges.push([nodes[0], nodes[1]]);
  }
  return edges;
}

/** One distinct ledger value, drawn as the target node a path question names. */
function pickDistinctNode(values, random) {
  const nodes = [...new Set(values)];
  return nodes[Math.floor(random() * nodes.length)];
}

/**
 * Draw a ledger and the parameters a chain reads, retrying until the chain's own
 * clauses hold, so a family never has to reject an instance it sampled itself.
 *
 * The clauses are the operators' business: `keepAbove` needs a threshold that keeps
 * some records and drops some, `subtractRate` needs a value above the deduction,
 * and a chain that ends on a list would not produce a number. Retrying here rather
 * than filtering later keeps the sampler total for every composition in the
 * inventory, including the deepest.
 */
function drawSlots(composition, random) {
  // Only the parameters this chain's own operators read are drawn. The pilot requires
  // the reference parse to recover exactly what the sampler produced
  // (`teacher/procedural/index.mjs`), and a draw carrying a parameter no stage names
  // cannot be recovered from the statement, so it would make every instance of that
  // family fail the round-trip check.
  const names = new Set(composition.chain);
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const count = 5 + Math.floor(random() * 4);
    const slots = {
      depot: DEPOTS[Math.floor(random() * DEPOTS.length)],
      unit: UNITS[Math.floor(random() * UNITS.length)],
      values: Array.from({ length: count }, () => 3 + Math.floor(random() * 40))
    };
    if (names.has('keepAbove') || names.has('keepBelow')) {
      slots.threshold = 8 + Math.floor(random() * 20);
    }
    if (names.has('addRate') || names.has('subtractRate')) {
      slots.rate = 2 + Math.floor(random() * 9);
    }
    if (names.has('perUnit')) {
      slots.perUnit = 2 + Math.floor(random() * 4);
    }
    if (names.has('double')) {
      slots.multiplier = 2 + Math.floor(random() * 2);
    }
    if (names.has('keepDivisibleBy') || names.has('modulo') || names.has('ratioPer') || names.has('probability')) {
      slots.divisor = 3 + Math.floor(random() * 6);
    }
    if (names.has('percentOf') || names.has('discount')) {
      slots.pct = 10 * (1 + Math.floor(random() * 9));
    }
    if (names.has('nthLargest')) {
      slots.nth = composition.rank ?? 2;
    }
    // The elapsed operator converts the ledger unit into a larger one: the ledger
    // records the input unit (minutes for hours, hours for days), and the answer is
    // reported in the label. Retrying below waits for the total to divide evenly.
    if (names.has('elapsed')) {
      const toDays = random() < 0.5;
      slots.per = toDays ? 24 : 60;
      slots.label = toDays ? 'days' : 'hours';
      slots.unit = toDays ? 'hours' : 'minutes';
    }
    if (names.has('rectangleArea')) {
      slots.width = 2 + Math.floor(random() * 9);
    }
    if (names.has('neighbourCount') || names.has('pathExists')) {
      slots.edges = drawEdges(slots.values, random);
    }
    if (names.has('pathExists')) {
      slots.target = pickDistinctNode(slots.values, random);
    }
    if (walkChain(composition, slots) !== null) {
      return slots;
    }
  }
  throw new Error(`${composition.id}: the sampler could not draw an instance that satisfies its own chain`);
}

/**
 * Walk a chain over one draw, returning the answer or `null` when the draw does not
 * satisfy an operator's clause. The same walk produces the oracle and, in the
 * circuit, the computation: one function, so the two cannot disagree about the
 * order of the stages.
 */
function walkChain(composition, slots) {
  let current = slots.values;
  for (const name of composition.chain) {
    const operator = OPERATORS[name];
    if (operator.takes === 'list' && !Array.isArray(current)) {
      return null;
    }
    if (operator.takes === 'scalar' && Array.isArray(current)) {
      return null;
    }
    if (name === 'keepAbove' || name === 'keepBelow') {
      const kept = operator.apply(current, slots);
      if (kept.length === 0 || kept.length === current.length) {
        return null;
      }
      current = kept;
      continue;
    }
    if (name === 'subtractRate' && current - slots.rate <= 0) {
      return null;
    }
    if (name === 'keepDivisibleBy') {
      const kept = operator.apply(current, slots);
      if (kept.length === 0 || kept.length === current.length) {
        return null;
      }
      current = kept;
      continue;
    }
    if (name === 'nthLargest') {
      if (slots.nth > current.length) {
        return null;
      }
      const ranked = [...current].sort((left, right) => right - left);
      if (ranked[slots.nth - 1] === ranked[slots.nth]) {
        return null; // the rank must be unambiguous
      }
    }
    if (name === 'ratioPer') {
      if (current % slots.divisor !== 0) {
        return null;
      }
    }
    if (name === 'percentOf' || name === 'discount') {
      if ((current * slots.pct) % 100 !== 0) {
        return null;
      }
    }
    if (name === 'discount' && current - (current * slots.pct) / 100 <= 0) {
      return null;
    }
    if (name === 'modulo' && current % slots.divisor === 0) {
      return null;
    }
    if (name === 'uniqueCount') {
      const kept = [...new Set(current)];
      if (kept.length === current.length) {
        return null; // the distinct count must differ from the count
      }
    }
    if (name === 'elapsed' && current % slots.per !== 0) {
      return null; // the total must divide evenly into whole hours or days
    }
    if (name === 'neighbourCount') {
      const degree = slots.edges.reduce((count, edge) => count + (edge[0] === current || edge[1] === current ? 1 : 0), 0);
      if (degree === 0) {
        return null; // the chain's node must appear in at least one edge
      }
    }
    if (name === 'pathExists') {
      const present = new Set(slots.edges.flat());
      if (current === slots.target || !present.has(current) || !present.has(slots.target)) {
        return null; // the two nodes must be distinct and both appear in the edges
      }
    }
    if (name === 'probability') {
      const favourable = current.filter((value) => value % slots.divisor === 0).length;
      if (favourable === 0 || favourable === current.length) {
        return null; // some but not all outcomes must be favourable
      }
    }
    current = operator.apply(current, slots);
  }
  if (OPERATORS[composition.chain.at(-1)].returns === 'answer') {
    if (typeof current !== 'string' || current.trim() === '') {
      return null;
    }
  } else if (!Number.isInteger(current) || current < 0) {
    return null;
  }
  return current;
}

/** The sentence of one operator over the parameters the draw carries. */
function operatorSentence(name, slots) {
  if (name === 'perUnit') {
    return OPERATORS.perUnit.sentence({ perUnit: slots.perUnit });
  }
  return OPERATORS[name].sentence(slots);
}

/** The circuit lines of one operator: the plan transcription, one or more lines per stage. */
function operatorLines(name, index) {
  if (name === 'keepAbove') {
    return [`const kept${index} = values.filter((value) => value > slots.threshold);`];
  }
  if (name === 'keepBelow') {
    return [`const kept${index} = values.filter((value) => value < slots.threshold);`];
  }
  if (name === 'total') {
    return [`const total${index} = current.reduce((sum, value) => sum + value, 0);`];
  }
  if (name === 'count') {
    return [`const count${index} = current.length;`];
  }
  if (name === 'largest') {
    return [`const extreme${index} = Math.max(...current);`];
  }
  if (name === 'smallest') {
    return [`const extreme${index} = Math.min(...current);`];
  }
  if (name === 'double') {
    return [`const scaled${index} = current * slots.multiplier;`];
  }
  if (name === 'perUnit') {
    return [`const scaled${index} = current * slots.perUnit;`];
  }
  if (name === 'addRate') {
    return [`const adjusted${index} = current + slots.rate;`];
  }
  if (name === 'subtractRate') {
    return [`const adjusted${index} = current - slots.rate;`];
  }
  if (name === 'keepDivisibleBy') {
    return [`const kept${index} = values.filter((value) => value % slots.divisor === 0);`];
  }
  if (name === 'modulo') {
    return [`const adjusted${index} = current % slots.divisor;`];
  }
  if (name === 'ratioPer') {
    return [`const adjusted${index} = current / slots.divisor;`];
  }
  if (name === 'percentOf') {
    return [`const adjusted${index} = (current * slots.pct) / 100;`];
  }
  if (name === 'discount') {
    return [`const adjusted${index} = current - (current * slots.pct) / 100;`];
  }
  if (name === 'nthLargest') {
    return [`const extreme${index} = [...current].sort((left, right) => right - left)[slots.nth - 1];`];
  }
  if (name === 'uniqueCount') {
    return [`const count${index} = new Set(current).size;`];
  }
  if (name === 'squareArea') {
    return [`const adjusted${index} = current * current;`];
  }
  if (name === 'elapsed') {
    return [`const adjusted${index} = current / slots.per;`];
  }
  if (name === 'rectangleArea') {
    return [`const adjusted${index} = current * slots.width;`];
  }
  if (name === 'neighbourCount') {
    return [`const neighbours${index} = slots.edges.reduce((count, edge) => count + (edge[0] === current || edge[1] === current ? 1 : 0), 0);`];
  }
  if (name === 'probability') {
    return [
      `const favourable${index} = current.filter((value) => value % slots.divisor === 0).length;`,
      `const total${index} = current.length;`,
      `let divisorA${index} = favourable${index};`,
      `let divisorB${index} = total${index};`,
      `while (divisorB${index} !== 0) { const remainder${index} = divisorB${index}; divisorB${index} = divisorA${index} % divisorB${index}; divisorA${index} = remainder${index}; }`,
      `const numerator${index} = favourable${index} / divisorA${index};`,
      `const denominator${index} = total${index} / divisorA${index};`,
      `const answer${index} = denominator${index} === 1 ? String(numerator${index}) : numerator${index} + "/" + denominator${index};`
    ];
  }
  if (name === 'pathExists') {
    return [
      `const adjacency${index} = new Map();`,
      `for (const edge${index} of slots.edges) {`,
      `  for (const member${index} of edge${index}) { if (!adjacency${index}.has(member${index})) adjacency${index}.set(member${index}, []); }`,
      `  adjacency${index}.get(edge${index}[0]).push(edge${index}[1]);`,
      `  adjacency${index}.get(edge${index}[1]).push(edge${index}[0]);`,
      `}`,
      `const seen${index} = new Set([current]);`,
      `const queue${index} = [current];`,
      `while (queue${index}.length > 0) {`,
      `  const node${index} = queue${index}.shift();`,
      `  if (node${index} === slots.target) break;`,
      `  for (const next${index} of adjacency${index}.get(node${index})) {`,
      `    if (!seen${index}.has(next${index})) { seen${index}.add(next${index}); queue${index}.push(next${index}); }`,
      `  }`,
      `}`,
      `const answer${index} = seen${index}.has(slots.target) ? "yes" : "no";`
    ];
  }
  throw new Error(`no circuit line for the operator ${name}`);
}

/** The variable a stage publishes, which the next stage reads as `current`. */
function resultVariable(name, index) {
  if (name === 'total') return `total${index}`;
  if (name === 'count' || name === 'uniqueCount') return `count${index}`;
  if (name === 'largest' || name === 'smallest' || name === 'nthLargest') return `extreme${index}`;
  if (name === 'double' || name === 'perUnit') return `scaled${index}`;
  if (name === 'neighbourCount') return `neighbours${index}`;
  if (name === 'probability' || name === 'pathExists') return `answer${index}`;
  return `adjusted${index}`;
}

/**
 * The circuit body of a chain: one line per stage, each reading the value the
 * previous line published, with the plan's own domain assertions. The chain is
 * walked in the same order as `walkChain`, so the plan and the oracle are the same
 * computation written twice, which is what the acceptance class records.
 */
function chainBody(composition, slots) {
  const lines = [
    'const slots = $slots;',
    'const values = slots.values;',
    'probe(Array.isArray(values) && values.length > 0, "the records must be a non-empty list");',
    'let current = values;'
  ];
  for (const [index, name] of composition.chain.entries()) {
    lines.push(`// stage ${index + 1}: ${name}`);
    lines.push(operatorLine(name, index));
    if (name === 'keepAbove' || name === 'keepBelow' || name === 'keepDivisibleBy') {
      // The sampling clause still refuses unobservable draws, but the emitted circuit
      // must not: an empty or full filter is a valid, honest answer.
      lines.push(`current = kept${index};`);
    } else {
      lines.push(`current = ${['total', 'count', 'uniqueCount', 'largest', 'smallest', 'nthLargest'].includes(name) ? lineName(name, index) : scaledName(name, index)};`);
    }
  }
  lines.push('probe(Number.isInteger(current) && current >= 0, "the answer must be a whole number that is not negative");');
  lines.push(`return current + " ${slots.unit}.";`);
  return lines.join('\n');
}

function lineName(name, index) {
  if (name === 'total') return `total${index}`;
  if (name === 'count' || name === 'uniqueCount') return `count${index}`;
  return `extreme${index}`;
}

function scaledName(name, index) {
  if (name === 'double' || name === 'perUnit') return `scaled${index}`;
  return `adjusted${index}`;
}

/**
 * The family of one composition. The id, the name, and the type are the composition's,
 * so a family in the dataset names the chain it teaches, and the plan fingerprint of
 * every instance is that chain.
 */
export function compositionFamily(composition) {
  return {
    id: composition.id,
    // The name must slugify to the id, which the family loader checks and would fail
    // the build over. The id is a hyphenated phrase ("above-total-add-rate"), so the
    // name is the same phrase with its words capitalised and its hyphens turned into
    // spaces, which slugs straight back to the id: one string, two spellings.
    name: composition.id.split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' '),
    type: composition.id,
    category: 'no-knowledge',
    difficulty: {
      subproblems: composition.chain.length,
      dependencyDepth: composition.chain.length,
      branching: composition.chain.some((name) => name === 'largest' || name === 'smallest') ? 1 : 0,
      irrelevantInformation: 0,
      symbolicShare: 1
    },
    sample(random) {
      return drawSlots(composition, random);
    },
    statement(slots) {
      const operations = composition.chain
        .map((name) => operatorSentence(name, slots))
        .join(', then ');
      return `The ${slots.depot} recorded ${renderLedger(slots.values, slots.unit)}. ` +
        `Please ${operations}. Report the result in ${slots.unit}.`;
    },
    parse(statement) {
      const ledger = /recorded (.+)\. Please /.exec(statement);
      const operationText = /\. Please (.+)\. Report the result in ([a-z]+)\.$/.exec(statement);
      const depot = /^The ([a-z ]+depot) recorded/.exec(statement);
      if (ledger === null || operationText === null || depot === null) {
        throw new Error('the statement does not state the records, the operations, and the depot');
      }
      const names = new Set(composition.chain);
      const slots = {
        depot: depot[1],
        unit: operationText[2],
        values: readLedger(ledger[1])
      };
      // The parameters are added in the order the sampler adds them, so the parsed
      // record and the drawn record are equal as objects, which is what the pilot's
      // round-trip check compares.
      if (names.has('keepAbove') || names.has('keepBelow')) slots.threshold = 0;
      if (names.has('addRate') || names.has('subtractRate')) slots.rate = 0;
      if (names.has('perUnit')) slots.perUnit = 0;
      if (names.has('double')) slots.multiplier = 0;
      if (names.has('keepDivisibleBy') || names.has('modulo') || names.has('ratioPer')) slots.divisor = 0;
      if (names.has('percentOf') || names.has('discount')) slots.pct = 0;
      if (names.has('nthLargest')) slots.nth = 0;
      // Read each operator's parameter back from its own sentence, in the order the
      // chain declares, and refuse a statement whose sentences are not this chain's.
      const sentences = operationText[1].split(', then ');
      if (sentences.length !== composition.chain.length) {
        throw new Error(`the statement asks for ${sentences.length} operations but this family declares ${composition.chain.length}`);
      }
      for (const [index, name] of composition.chain.entries()) {
        const sentence = sentences[index];
        if (name === 'keepAbove' || name === 'keepBelow') {
          const threshold = /keep only the records (?:above|below) (\d+)$/.exec(sentence);
          if (threshold === null) {
            throw new Error(`operation ${index + 1} is not a filter of this family`);
          }
          slots.threshold = Number(threshold[1]);
          continue;
        }
        if (name === 'addRate' || name === 'subtractRate') {
          const charge = /(?:fixed charge|fixed deduction) of (\d+)$/.exec(sentence);
          if (charge === null) {
            throw new Error(`operation ${index + 1} is not a fixed adjustment of this family`);
          }
          slots.rate = Number(charge[1]);
          continue;
        }
        if (name === 'perUnit') {
          const perUnit = /multiply it by the (\d+) labels per record$/.exec(sentence);
          if (perUnit === null) {
            throw new Error(`operation ${index + 1} is not the per-unit step of this family`);
          }
          slots.perUnit = Number(perUnit[1]);
          continue;
        }
        if (name === 'double') {
          const multiplier = /double it by the factor of (\d+)$/.exec(sentence);
          if (multiplier === null) {
            throw new Error(`operation ${index + 1} is not the doubling step of this family`);
          }
          slots.multiplier = Number(multiplier[1]);
          continue;
        }
        if (name === 'keepDivisibleBy') {
          const divisor = /keep only the records divisible by (\d+)$/.exec(sentence);
          if (divisor === null) {
            throw new Error(`operation ${index + 1} is not the divisibility step of this family`);
          }
          slots.divisor = Number(divisor[1]);
          continue;
        }
        if (name === 'modulo' || name === 'ratioPer') {
          const divisor = /(?:remainder of it divided by|split it into) (\d+)(?: equal parts)?$/.exec(sentence);
          if (divisor === null) {
            throw new Error(`operation ${index + 1} is not the division step of this family`);
          }
          slots.divisor = Number(divisor[1]);
          continue;
        }
        if (name === 'percentOf' || name === 'discount') {
          const pct = /(?:take|the discount of) (\d+) percent/.exec(sentence);
          if (pct === null) {
            throw new Error(`operation ${index + 1} is not the percentage step of this family`);
          }
          slots.pct = Number(pct[1]);
          continue;
        }
        if (name === 'nthLargest') {
          const nth = /take the (first|second|third|fourth|fifth|\d+th) largest/.exec(sentence);
          if (nth === null) {
            throw new Error(`operation ${index + 1} is not the rank step of this family`);
          }
          const ordinal = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5 };
          slots.nth = ordinal[nth[1]] ?? Number(nth[1].replace('th', ''));
          continue;
        }
        const expected = OPERATORS[name].sentence(slots);
        if (sentence !== expected) {
          throw new Error(`operation ${index + 1} does not match this family's chain`);
        }
      }
      return slots;
    },
    /** Independent oracle: the chain walked once over the parsed values. */
    solve(slots) {
      return { answer: walkChain(composition, slots) };
    },
    render(solution) {
      return `${solution.answer} units.`;
    },
    compute: chainBody(composition, { unit: 'units' }),
    explain(slots, solution) {
      return [
        `The ${slots.depot} recorded ${slots.values.length} records in ${slots.unit}.`,
        `The plan is ${composition.chain.join(' then ')}, in that order.`,
        `Walking the stages gives ${solution.answer} ${slots.unit}.`
      ];
    }
  };
}

/** One family per composition in the inventory, in the order the inventory declares. */
export const compositionFamilies = Object.freeze(COMPOSITIONS.map((composition) => compositionFamily(composition)));
