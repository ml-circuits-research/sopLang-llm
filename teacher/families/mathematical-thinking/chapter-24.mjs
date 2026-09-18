/**
 * Families for chapter 24 of the mathematical seed book: measurement, bounds,
 * and uncertainty.
 *
 * Every problem of this chapter is titled individually, so each family covers
 * exactly one printed template. The chapter reasons about units, balance
 * scales, capacity, intervals, tolerance, and bounds. Most premises are stated
 * in the problem text, so those families are `no-knowledge`. The families that
 * need a fact the statement neither states nor defines — the reading of a level
 * balance scale, the geometry of a rectangle — declare `category: 'knowledge'`
 * and carry that fact in a `@facts` literal wire that the computation reads.
 */

export const unit = 24;

const NUMBER_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
const FRACTIONS = { half: 0.5, quarter: 0.25, third: 1 / 3 };
const BALANCE_FACTS = '{ "balanceScale": { "levelImplies": "equal total mass", "additive": true } }';
const PARSED = 'const slots = $slots;';

function fail(message) { throw new Error(message); }

function numberWord(text) {
  const value = NUMBER_WORDS[String(text).toLowerCase()];
  if (value === undefined) { fail(`unknown number word "${text}"`); }
  return value;
}

const INTERVAL_COMPUTE = [
  PARSED,
  'if (slots.a.upper < slots.b.lower) { return "B is certainly longer."; }',
  'if (slots.b.upper < slots.a.lower) { return "A is certainly longer."; }',
  'return "It cannot be determined with certainty.";'
].join('\n');

function parseIntervalPair(statement, pattern) {
  const match = statement.match(pattern) ?? fail('the two uncertain lengths are missing');
  return { a: { lower: Number(match[1]), upper: Number(match[2]) }, b: { lower: Number(match[3]), upper: Number(match[4]) } };
}

function intervalVerdict(a, b) {
  if (a.upper < b.lower) { return 'B is certainly longer.'; }
  if (b.upper < a.lower) { return 'A is certainly longer.'; }
  return 'It cannot be determined with certainty.';
}

export const cases = [
  {
    template: 'Measuring with equal sticks', type: 'measuring-with-equal-sticks', category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/covered exactly by (\d+) identical sticks[\s\S]*?covered by (\d+) such sticks/) ?? fail('the two stick counts are missing');
      return { first: Number(match[1]), second: Number(match[2]) };
    },
    solve(slots) { return { longer: slots.first > slots.second ? 'first' : 'second', difference: Math.abs(slots.first - slots.second) }; },
    render(solution) { return `The ${solution.longer} pencil, by ${solution.difference} units.`; },
    compute: [PARSED, 'const longer = slots.first > slots.second ? "first" : "second";', 'return "The " + longer + " pencil, by " + Math.abs(slots.first - slots.second) + " units.";'].join('\n'),
    explain(slots) { return [`Both pencils are measured with the same stick, so the stick is the common unit u and the lengths are ${slots.first}u and ${slots.second}u.`, `Because the unit is the same, comparing the counts ${slots.first} and ${slots.second} compares the lengths, and their difference is the difference in units.`]; }
  },
  {
    template: 'Why different units cannot be compared directly', type: 'why-different-units-cannot-be-compared-directly', category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/One table is (\d+) “([^”]+)” long, while another is (\d+) “([^”]+)” long/);
      if (match === null || !/but not by how much/.test(statement)) { fail('the two handspan measurements or the unknown ratio are missing'); }
      return { first: { count: Number(match[1]), unit: match[2] }, second: { count: Number(match[3]), unit: match[4] } };
    },
    solve(slots) {
      if (slots.first.unit !== slots.second.unit) { return { determinable: false }; }
      return { determinable: true, longer: slots.first.count > slots.second.count ? 'first' : 'second' };
    },
    render(solution) { return solution.determinable ? `The ${solution.longer} table is longer.` : 'It cannot be determined.'; },
    compute: [PARSED, 'if (slots.first.unit !== slots.second.unit) { return "It cannot be determined."; }', 'return slots.first.count > slots.second.count ? "The first table is longer." : "The second table is longer.";'].join('\n'),
    explain(slots) { return [`The counts ${slots.first.count} and ${slots.second.count} count different units (${slots.first.unit} and ${slots.second.unit}), so they are not expressed in a common measure.`, 'The statement says an adult handspan is longer than a child handspan but gives no ratio between the units, so the measurements cannot be converted and the comparison of the counts decides nothing.']; }
  },
  {
    template: 'Indirect comparison using a string', type: 'indirect-comparison-using-a-string', category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/string is shorter than shelf (\w+) but longer than shelf (\w+)/) ?? fail('the two shelf comparisons are missing');
      return { longer: match[1], shorter: match[2] };
    },
    solve(slots) { return { longer: slots.longer, shorter: slots.shorter }; },
    render(solution) { return `Shelf ${solution.longer} is longer than ${solution.shorter}.`; },
    compute: [PARSED, 'return "Shelf " + slots.longer + " is longer than " + slots.shorter + ".";'].join('\n'),
    explain(slots) { return [`The string sits between the two shelves: shelf ${slots.longer} is longer than the string, and the string is longer than shelf ${slots.shorter}.`, `Chaining the comparisons gives shelf ${slots.longer} > string > shelf ${slots.shorter}, and transitivity transfers the comparison to the shelves, so no numbers are needed.`]; }
  },
  {
    template: 'A balance scale in equilibrium', type: 'a-balance-scale-in-equilibrium', category: 'knowledge',
    parse(statement) {
      const match = statement.match(/One pan holds (\d+) identical cubes; the other holds a (\d+)-unit weight/);
      if (match === null || !/balance is level/.test(statement)) { fail('the pan contents or the level balance are missing'); }
      return { cubes: Number(match[1]), weight: Number(match[2]) };
    },
    solve(slots) {
      if (slots.cubes === 0) { fail('the pan holds no cubes'); }
      return { mass: slots.weight / slots.cubes };
    },
    render(solution) { return `${solution.mass} units.`; },
    facts: BALANCE_FACTS,
    compute: [
      'const slots = $slots;',
      'const facts = $facts.balanceScale;',
      'if (facts.levelImplies !== "equal total mass") { throw new Error("the balance semantics are unknown"); }',
      'if (slots.cubes === 0) { throw new Error("the pan holds no cubes"); }',
      'return String(slots.weight / slots.cubes) + " units.";'
    ].join('\n'),
    explain(slots) { return ['The statement says the balance is level but never defines what a level balance means, so the circuit states the fact that level means equal total mass on the two pans.', `With that fact the ${slots.cubes} identical cubes together weigh the ${slots.weight}-unit weight, and splitting the total into equal parts gives ${slots.weight / slots.cubes} units for one cube.`]; }
  },
  {
    template: 'A balance with one known and one unknown object', type: 'a-balance-with-one-known-and-one-unknown-object', category: 'knowledge',
    parse(statement) {
      const match = statement.match(/unknown ball and a (\d+)-unit weight; on the right is an (\d+)-unit weight/);
      if (match === null || !/balance is level/.test(statement)) { fail('the pan contents or the level balance are missing'); }
      return { left: Number(match[1]), right: Number(match[2]) };
    },
    solve(slots) {
      const mass = slots.right - slots.left;
      if (mass <= 0) { fail('the ball would have a non-positive mass'); }
      return { mass };
    },
    render(solution) { return `${solution.mass} units.`; },
    facts: BALANCE_FACTS,
    compute: [
      'const slots = $slots;',
      'const facts = $facts.balanceScale;',
      'if (facts.levelImplies !== "equal total mass") { throw new Error("the balance semantics are unknown"); }',
      'if (slots.right - slots.left <= 0) { throw new Error("the ball would have a non-positive mass"); }',
      'return String(slots.right - slots.left) + " units.";'
    ].join('\n'),
    explain(slots) { return ['The statement says the balance is level but never defines what a level balance means, so the circuit states the fact that level means equal total mass on the two pans.', `The ball plus the ${slots.left}-unit weight then equals the ${slots.right}-unit weight, so removing the known weight from both sides leaves ${slots.right} - ${slots.left} = ${slots.right - slots.left} units for the ball.`]; }
  },
  {
    template: 'A graduated container', type: 'a-graduated-container', category: 'no-knowledge',
    parse(statement) {
      const marksMatch = statement.match(/marks at ([\d, and]+) ml/);
      const levelMatch = statement.match(/level is exactly halfway between (\d+) and (\d+)/);
      if (marksMatch === null || levelMatch === null || !/halfway between two equally spaced values is their average/.test(statement)) { fail('the scale marks, the water level, or the stated rule are missing'); }
      const marks = marksMatch[1].match(/\d+/g).map(Number);
      const lower = Number(levelMatch[1]);
      const upper = Number(levelMatch[2]);
      if (!marks.includes(lower) || !marks.includes(upper)) { fail('the water level lies between marks that are not on the scale'); }
      return { marks, lower, upper };
    },
    solve(slots) { return { volume: (slots.lower + slots.upper) / 2 }; },
    render(solution) { return `${solution.volume} ml.`; },
    compute: [PARSED, 'return String((slots.lower + slots.upper) / 2) + " ml.";'].join('\n'),
    explain(slots) { return [`The level lies exactly halfway between the ${slots.lower} ml and ${slots.upper} ml marks, and the problem states that halfway between equally spaced values is their average.`, `The gap is ${slots.upper - slots.lower} ml and half of it is ${(slots.upper - slots.lower) / 2} ml, so the level reads ${(slots.lower + slots.upper) / 2} ml.`]; }
  },
  {
    template: 'Two differently shaped containers with the same capacity', type: 'two-differently-shaped-containers-with-the-same-capacity', category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/both labeled “(\d+) ml”/);
      if (match === null || !/label states maximum capacity/.test(statement)) { fail('the shared capacity label or the capacity statement is missing'); }
      return { capacity: Number(match[1]) };
    },
    solve(slots) { return { capacity: slots.capacity }; },
    render(solution) { return `They contain the same amount: ${solution.capacity} ml.`; },
    compute: [PARSED, 'return "They contain the same amount: " + slots.capacity + " ml.";'].join('\n'),
    explain(slots) { return ['The containers differ in shape, but shape does not change the maximum amount a container holds.', `Both labels state the same maximum capacity, ${slots.capacity} ml, so filling each completely puts ${slots.capacity} ml in both and the amounts are equal.`]; }
  },
  {
    template: 'Estimating by bounding', type: 'estimating-by-bounding', category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/longer than (\d+) cm but shorter than (\d+) cm/) ?? fail('the two length bounds are missing');
      return { lower: Number(match[1]), upper: Number(match[2]) };
    },
    solve(slots) {
      if (slots.lower >= slots.upper) { fail('the bounds do not describe an interval'); }
      return { lower: slots.lower, upper: slots.upper };
    },
    render(solution) { return `The length is between ${solution.lower} cm and ${solution.upper} cm.`; },
    compute: [PARSED, 'if (slots.lower >= slots.upper) { throw new Error("the bounds do not describe an interval"); }', 'return "The length is between " + slots.lower + " cm and " + slots.upper + " cm.";'].join('\n'),
    explain(slots) { return [`The ruler gives only two facts: the stick is longer than ${slots.lower} cm and shorter than ${slots.upper} cm, and both hold at the same time.`, `The most accurate description the data supports is the interval between ${slots.lower} cm and ${slots.upper} cm; no single value is guaranteed.`]; }
  },
  {
    template: 'Rounding as an interval of possibilities', type: 'rounding-as-an-interval-of-possibilities', category: 'no-knowledge',
    parse(statement) {
      const displayedMatch = statement.match(/displays (\d+) cm/);
      const intervalMatch = statement.match(/from (\d+(?:\.\d+)?) cm inclusive up to (\d+(?:\.\d+)?) cm exclusive/);
      const candidateMatch = statement.match(/be (\d+(?:\.\d+)?) cm\? What about (\d+(?:\.\d+)?) cm\?/);
      if (displayedMatch === null || intervalMatch === null || candidateMatch === null) { fail('the displayed value, the rounding interval, or the candidates are missing'); }
      return { displayed: Number(displayedMatch[1]), lower: Number(intervalMatch[1]), upper: Number(intervalMatch[2]), first: Number(candidateMatch[1]), second: Number(candidateMatch[2]) };
    },
    solve(slots) {
      const compatible = (value) => value >= slots.lower && value < slots.upper;
      return { first: slots.first, second: slots.second, firstOk: compatible(slots.first), secondOk: compatible(slots.second) };
    },
    render(solution) { return `${solution.first} cm: ${solution.firstOk ? 'yes' : 'no'}; ${solution.second} cm: ${solution.secondOk ? 'yes' : 'no'}.`; },
    compute: [PARSED, 'const compatible = (value) => value >= slots.lower && value < slots.upper;', 'return slots.first + " cm: " + (compatible(slots.first) ? "yes" : "no") + "; " + slots.second + " cm: " + (compatible(slots.second) ? "yes" : "no") + ".";'].join('\n'),
    explain(slots) { return [`A displayed value of ${slots.displayed} cm stands for every exact length from ${slots.lower} cm inclusive up to ${slots.upper} cm exclusive, as the problem states.`, `${slots.first} cm falls inside that interval and is compatible, while ${slots.second} cm is above the upper end and would round to a different whole centimetre.`]; }
  },
  {
    template: 'A stated maximum error', type: 'a-stated-maximum-error', category: 'no-knowledge',
    parse(statement) {
      const readingMatch = statement.match(/reads (-?\d+)°C/);
      const errorMatch = statement.match(/error can be at most (\d+)°C above or below/);
      if (readingMatch === null || errorMatch === null) { fail('the reading or the maximum error is missing'); }
      return { reading: Number(readingMatch[1]), error: Number(errorMatch[1]) };
    },
    solve(slots) { return { lower: slots.reading - slots.error, upper: slots.reading + slots.error }; },
    render(solution) { return `Between ${solution.lower}°C and ${solution.upper}°C.`; },
    compute: [PARSED, 'return "Between " + (slots.reading - slots.error) + "°C and " + (slots.reading + slots.error) + "°C.";'].join('\n'),
    explain(slots) { return [`"At most ${slots.error} below" allows a real temperature as low as ${slots.reading - slots.error}°C and "at most ${slots.error} above" allows one as high as ${slots.reading + slots.error}°C.`, `Every value between the two limits is compatible with the reading, so the real temperature lies in the interval ${slots.reading - slots.error}–${slots.reading + slots.error}°C.`]; }
  },
  {
    template: 'Two intervals that do not overlap', type: 'two-intervals-that-do-not-overlap', category: 'no-knowledge',
    parse(statement) { return parseIntervalPair(statement, /Length A is between (\d+) and (\d+) cm\. Length B is between (\d+) and (\d+) cm\./); },
    solve(slots) { return { verdict: intervalVerdict(slots.a, slots.b) }; },
    render(solution) { return solution.verdict; },
    compute: INTERVAL_COMPUTE,
    explain(slots) { return [`Even the largest possible value of A, ${slots.a.upper} cm, is below the smallest possible value of B, ${slots.b.lower} cm, so the two intervals are separated.`, 'No allowed value of A can reach any allowed value of B, so every length compatible with the data makes B longer.']; }
  },
  {
    template: 'Two intervals that overlap', type: 'two-intervals-that-overlap', category: 'no-knowledge',
    parse(statement) { return parseIntervalPair(statement, /Length A is between (\d+) and (\d+) cm, while B is between (\d+) and (\d+) cm\./); },
    solve(slots) { return { verdict: intervalVerdict(slots.a, slots.b) }; },
    render(solution) { return solution.verdict; },
    compute: INTERVAL_COMPUTE,
    explain(slots) { return [`The intervals share the values between ${slots.b.lower} cm and ${slots.a.upper} cm, so with values in the shared part A is the longer one.`, `Choosing A near ${slots.a.lower} cm and B near ${slots.b.upper} cm reverses the ordering, and both choices satisfy the data, so the comparison is not determined.`]; }
  },
  {
    template: 'Measuring by counting tiles', type: 'measuring-by-counting-tiles', category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/covered end to end by (\d+) identical tiles, each (\d+) cm long/) ?? fail('the tile count or the tile length is missing');
      return { tiles: Number(match[1]), tileLength: Number(match[2]) };
    },
    solve(slots) { return { length: slots.tiles * slots.tileLength }; },
    render(solution) { return `${solution.length} cm.`; },
    compute: [PARSED, 'return String(slots.tiles * slots.tileLength) + " cm.";'].join('\n'),
    explain(slots) { return [`Each tile contributes the same ${slots.tileLength} cm and the tiles cover the path end to end with no gaps or overlaps.`, `The path is ${slots.tiles} repetitions of ${slots.tileLength} cm, and repeated addition gives ${slots.tiles * slots.tileLength} cm.`]; }
  },
  {
    template: 'Unknown length from a total', type: 'unknown-length-from-a-total', category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/measure (\d+) cm in total\. The first is (\d+) cm long/) ?? fail('the total length or the first board is missing');
      return { total: Number(match[1]), first: Number(match[2]) };
    },
    solve(slots) {
      const second = slots.total - slots.first;
      if (second <= 0) { fail('the second board would have a non-positive length'); }
      return { second };
    },
    render(solution) { return `${solution.second} cm.`; },
    compute: [PARSED, 'if (slots.total - slots.first <= 0) { throw new Error("the second board would have a non-positive length"); }', 'return String(slots.total - slots.first) + " cm.";'].join('\n'),
    explain(slots) { return [`The two boards placed end to end add up to ${slots.total} cm, and the first board accounts for ${slots.first} cm of that total.`, `The second board is the part the first does not cover, ${slots.total} - ${slots.first} = ${slots.total - slots.first} cm, and adding it back returns the total.`]; }
  },
  {
    template: 'Perimeter measured with a strip', type: 'perimeter-measured-with-a-strip', category: 'knowledge',
    parse(statement) {
      const match = statement.match(/rectangular frame has sides (\d+) cm and (\d+) cm/);
      if (match === null || !/follow all four sides exactly once/.test(statement)) { fail('the frame sides or the full boundary are missing'); }
      return { a: Number(match[1]), b: Number(match[2]) };
    },
    solve(slots) { return { perimeter: 2 * (slots.a + slots.b) }; },
    render(solution) { return `${solution.perimeter} cm.`; },
    facts: '{ "rectangle": { "sides": 4, "equalPairs": 2, "perimeterRule": "sum of all sides" } }',
    compute: [
      'const slots = $slots;',
      'const facts = $facts.rectangle;',
      'if (facts.equalPairs !== 2 || facts.perimeterRule !== "sum of all sides") { throw new Error("the rectangle geometry is unknown"); }',
      'return String(facts.equalPairs * (slots.a + slots.b)) + " cm.";'
    ].join('\n'),
    explain(slots) { return ['The statement names the two side lengths but never states the geometry of a rectangle, so the circuit carries the fact that a rectangle has four sides in two pairs of equal length.', `Following all four sides once walks ${slots.a} cm and ${slots.b} cm twice each: 2 × ${slots.a + slots.b} = ${2 * (slots.a + slots.b)} cm, and the interior needs no strip.`]; }
  },
  {
    template: 'Remaining capacity', type: 'remaining-capacity', category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/hold at most (\d+) ml\. It already contains (\d+) ml/) ?? fail('the capacity or the current content is missing');
      return { capacity: Number(match[1]), current: Number(match[2]) };
    },
    solve(slots) {
      const free = slots.capacity - slots.current;
      if (free < 0) { fail('the bottle already exceeds its capacity'); }
      return { free };
    },
    render(solution) { return `${solution.free} ml.`; },
    compute: [PARSED, 'if (slots.capacity - slots.current < 0) { throw new Error("the bottle already exceeds its capacity"); }', 'return String(slots.capacity - slots.current) + " ml.";'].join('\n'),
    explain(slots) { return [`The capacity is a limit: the bottle holds at most ${slots.capacity} ml in total, and the liquid already inside fills ${slots.current} ml of it.`, `The free space is the difference ${slots.capacity} - ${slots.current} = ${slots.capacity - slots.current} ml, exactly what can be added without exceeding the limit.`]; }
  },
  {
    template: 'Pouring with no loss', type: 'pouring-with-no-loss', category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/holds (\d+) ml of water\. We pour (\d+) ml into a second container/);
      if (match === null || !/nothing is spilled/.test(statement)) { fail('the starting amount, the poured amount, or the no-loss statement is missing'); }
      return { total: Number(match[1]), poured: Number(match[2]) };
    },
    solve(slots) {
      const remaining = slots.total - slots.poured;
      if (remaining < 0) { fail('more liquid is poured out than the container holds'); }
      return { remaining, transferred: slots.poured };
    },
    render(solution) { return `${solution.remaining} ml in the first; ${solution.transferred} ml transferred.`; },
    compute: [PARSED, 'if (slots.total - slots.poured < 0) { throw new Error("more liquid is poured out than the container holds"); }', 'return (slots.total - slots.poured) + " ml in the first; " + slots.poured + " ml transferred.";'].join('\n'),
    explain(slots) { return [`The first container starts with ${slots.total} ml and loses the ${slots.poured} ml that is poured out, leaving ${slots.total} - ${slots.poured} = ${slots.total - slots.poured} ml.`, `Because nothing is spilled the volume is conserved, so the ${slots.poured} ml that left the first container is exactly the ${slots.poured} ml that arrives in the second.`]; }
  },
  {
    template: 'Comparing masses with balance scales', type: 'comparing-masses-with-balance-scales', category: 'no-knowledge',
    parse(statement) {
      const comparisons = [...statement.matchAll(/([A-Z]) goes down relative to ([A-Z])/g)].map((match) => [match[1], match[2]]);
      const namesMatch = statement.match(/Which is heaviest among ([A-Z]), ([A-Z]), (?:and )?([A-Z])/);
      if (comparisons.length < 2 || namesMatch === null) { fail('the balance comparisons or the asked objects are missing'); }
      return { comparisons, names: [namesMatch[1], namesMatch[2], namesMatch[3]] };
    },
    solve(slots) {
      const heavier = new Set(slots.comparisons.map((pair) => pair[0]));
      const lighter = new Set(slots.comparisons.map((pair) => pair[1]));
      const heaviest = slots.names.filter((name) => heavier.has(name) && !lighter.has(name));
      if (heaviest.length !== 1) { fail('the comparisons do not name a single heaviest object'); }
      return { heaviest: heaviest[0] };
    },
    render(solution) { return `${solution.heaviest}.`; },
    compute: [PARSED, 'const heavier = new Set(slots.comparisons.map((pair) => pair[0]));', 'const lighter = new Set(slots.comparisons.map((pair) => pair[1]));', 'const heaviest = slots.names.filter((name) => heavier.has(name) && !lighter.has(name));', 'if (heaviest.length !== 1) { throw new Error("the comparisons do not name a single heaviest object"); }', 'return String(heaviest[0]) + ".";'].join('\n'),
    explain(slots) { return [`Each balance gives one comparison: ${slots.comparisons.map((pair) => `${pair[0]} > ${pair[1]}`).join(' and ')}, which chain into a single mass ordering without any numerical value.`, 'The object that appears as the heavier one and never as the lighter one is the heaviest.']; }
  },
  {
    template: 'Balance with equality and comparison', type: 'balance-with-equality-and-comparison', category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/([A-Z]) and ([A-Z]) balance perfectly, so they have the same mass\. ([A-Z]) is heavier than ([A-Z])/) ?? fail('the equality or the comparison is missing');
      return { equalA: match[1], equalB: match[2], heavier: match[3], lighter: match[4] };
    },
    solve(slots) {
      if (slots.heavier !== slots.equalA && slots.heavier !== slots.equalB) { fail('the heavier object is not one of the balanced pair'); }
      const other = slots.heavier === slots.equalA ? slots.equalB : slots.equalA;
      return { heavierSide: other, lighterSide: slots.lighter };
    },
    render(solution) { return `${solution.heavierSide} is heavier than ${solution.lighterSide}.`; },
    compute: [PARSED, 'if (slots.heavier !== slots.equalA && slots.heavier !== slots.equalB) { throw new Error("the heavier object is not one of the balanced pair"); }', 'const equal = slots.equalA === slots.heavier ? slots.equalB : slots.equalA;', 'return equal + " is heavier than " + slots.lighter + ".";'].join('\n'),
    explain(slots) { return [`${slots.equalA} and ${slots.equalB} balance perfectly, so they have the same mass and either can replace the other in a comparison.`, `The statement gives ${slots.heavier} > ${slots.lighter}, and replacing ${slots.heavier} by its equally heavy partner transfers the comparison to that partner.`]; }
  },
  {
    template: 'Measurement by whole units and a remainder', type: 'measurement-by-whole-units-and-a-remainder', category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/covers (\d+) complete unit-rulers and another (\w+) of one such unit\. If one unit is (\d+) cm/) ?? fail('the complete units, the remainder, or the unit length is missing');
      const fraction = FRACTIONS[match[2].toLowerCase()];
      if (fraction === undefined) { fail(`unknown fraction "${match[2]}"`); }
      return { whole: Number(match[1]), fraction, unit: Number(match[3]) };
    },
    solve(slots) { return { length: (slots.whole + slots.fraction) * slots.unit }; },
    render(solution) { return `${solution.length} cm.`; },
    compute: [PARSED, 'return String((slots.whole + slots.fraction) * slots.unit) + " cm.";'].join('\n'),
    explain(slots) { return [`The ribbon covers ${slots.whole} complete units of ${slots.unit} cm plus ${slots.fraction} of one more unit.`, `The whole part is ${slots.whole * slots.unit} cm and the remainder is ${slots.fraction * slots.unit} cm; both are in the same unit, so they add to ${(slots.whole + slots.fraction) * slots.unit} cm.`]; }
  },
  {
    template: 'A lower bound from whole objects', type: 'a-lower-bound-from-whole-objects', category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/(\w+) cubes, each (\d+) cm long, fit lengthwise/);
      if (match === null || !/cannot be shorter than the row of cubes/.test(statement)) { fail('the cube count, the cube length, or the minimum statement is missing'); }
      return { count: numberWord(match[1]), cubeLength: Number(match[2]) };
    },
    solve(slots) { return { minimum: slots.count * slots.cubeLength }; },
    render(solution) { return `At least ${solution.minimum} cm.`; },
    compute: [PARSED, 'return "At least " + (slots.count * slots.cubeLength) + " cm.";'].join('\n'),
    explain(slots) { return [`The ${slots.count} cubes sit in a row with no gaps, so the row alone occupies ${slots.count} × ${slots.cubeLength} = ${slots.count * slots.cubeLength} cm of the interior.`, `A shorter interior could not contain the row, and the statement allows extra free space, so only the lower bound of ${slots.count * slots.cubeLength} cm is certain.`]; }
  },
  {
    template: 'An upper bound from an object that does not fit', type: 'an-upper-bound-from-an-object-that-does-not-fit', category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/A (\d+) cm stick does not fit straight lengthwise inside a box, while an (\d+) cm stick does/) ?? fail('the fitting or non-fitting stick is missing');
      return { notFit: Number(match[1]), fit: Number(match[2]) };
    },
    solve(slots) {
      if (slots.fit >= slots.notFit) { fail('the two sticks do not give a consistent pair of bounds'); }
      return { lower: slots.fit, upper: slots.notFit };
    },
    render(solution) { return `${solution.lower} cm ≤ L < ${solution.upper} cm.`; },
    compute: [PARSED, 'if (slots.fit >= slots.notFit) { throw new Error("the two sticks do not give a consistent pair of bounds"); }', 'return slots.fit + " cm ≤ L < " + slots.notFit + " cm.";'].join('\n'),
    explain(slots) { return [`The ${slots.fit} cm stick fits, so the interior length L is at least ${slots.fit} cm, and the ${slots.notFit} cm stick does not fit, so L is strictly less than ${slots.notFit} cm.`, `Both conditions hold at once, which gives ${slots.fit} cm ≤ L < ${slots.notFit} cm as everything the two tests prove.`]; }
  },
  {
    template: 'The best estimate among choices', type: 'the-best-estimate-among-choices', category: 'no-knowledge',
    parse(statement) {
      const boundsMatch = statement.match(/longer than (\d+) cm but clearly shorter than (\d+) cm/);
      const listMatch = statement.match(/Of the estimates (.*?), which is compatible/);
      if (boundsMatch === null || listMatch === null) { fail('the observed limits or the candidate list are missing'); }
      return { lower: Number(boundsMatch[1]), upper: Number(boundsMatch[2]), candidates: listMatch[1].match(/\d+/g).map(Number) };
    },
    solve(slots) {
      const compatible = slots.candidates.filter((value) => value > slots.lower && value < slots.upper);
      if (compatible.length !== 1) { fail(`${compatible.length} candidates are compatible with the observation instead of one`); }
      return { value: compatible[0] };
    },
    render(solution) { return `${solution.value} cm.`; },
    compute: [PARSED, 'const compatible = slots.candidates.filter((value) => value > slots.lower && value < slots.upper);', 'if (compatible.length !== 1) { throw new Error(compatible.length + " candidates are compatible with the observation instead of one"); }', 'return compatible[0] + " cm.";'].join('\n'),
    explain(slots) { return [`The object is longer than ${slots.lower} cm but still shorter than ${slots.upper} cm, so a compatible estimate must satisfy both comparisons.`, `Testing ${slots.candidates.join(', ')} cm discards every value at or below ${slots.lower} and at or above ${slots.upper}, and exactly one candidate survives.`]; }
  },
  {
    template: 'Adding errors in the worst case', type: 'adding-errors-in-the-worst-case', category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/measured as (\d+) cm and (\d+) cm, each with an error of at most (\d+) cm/) ?? fail('the two measured lengths or the maximum error are missing');
      return { first: Number(match[1]), second: Number(match[2]), error: Number(match[3]) };
    },
    solve(slots) {
      const total = slots.first + slots.second;
      return { lower: total - 2 * slots.error, upper: total + 2 * slots.error };
    },
    render(solution) { return `Between ${solution.lower} cm and ${solution.upper} cm.`; },
    compute: [PARSED, 'const total = slots.first + slots.second;', 'return "Between " + (total - 2 * slots.error) + " cm and " + (total + 2 * slots.error) + " cm.";'].join('\n'),
    explain(slots) { return [`Each length may lie ${slots.error} cm below or above its measured value, so the first is in ${slots.first - slots.error}–${slots.first + slots.error} cm and the second in ${slots.second - slots.error}–${slots.second + slots.error} cm.`, `The errors add in the worst case: the smallest total is ${slots.first - slots.error} + ${slots.second - slots.error} = ${slots.first + slots.second - 2 * slots.error} cm and the largest is ${slots.first + slots.error} + ${slots.second + slots.error} = ${slots.first + slots.second + 2 * slots.error} cm.`]; }
  },
  {
    template: 'Repeated measurement and a suspicious value', type: 'repeated-measurement-and-a-suspicious-value', category: 'no-knowledge',
    parse(statement) {
      const valuesMatch = statement.match(/giving (\d+) cm, (\d+) cm, and (\d+) cm/);
      const toleranceMatch = statement.match(/error is at most (\d+) cm/);
      if (valuesMatch === null || toleranceMatch === null) { fail('the three measurements or the maximum error are missing'); }
      return { measurements: [Number(valuesMatch[1]), Number(valuesMatch[2]), Number(valuesMatch[3])], tolerance: Number(toleranceMatch[1]) };
    },
    solve(slots) {
      const [first, second] = slots.measurements;
      if (Math.abs(first - second) > slots.tolerance) { fail('the first two measurements do not agree within the stated error'); }
      const incompatible = slots.measurements.filter((value) => Math.abs(value - first) > slots.tolerance);
      if (incompatible.length !== 1) { fail(`${incompatible.length} measurements are incompatible with the first two`); }
      return { value: incompatible[0] };
    },
    render(solution) { return `${solution.value} cm.`; },
    compute: [PARSED, 'const base = slots.measurements[0];', 'if (Math.abs(slots.measurements[1] - base) > slots.tolerance) { throw new Error("the first two measurements do not agree within the stated error"); }', 'const incompatible = slots.measurements.filter((value) => Math.abs(value - base) > slots.tolerance);', 'if (incompatible.length !== 1) { throw new Error(incompatible.length + " measurements are incompatible with the first two"); }', 'return String(incompatible[0]) + " cm.";'].join('\n'),
    explain(slots) { return [`The first two measurements agree at ${slots.measurements[0]} cm, and a repeated measurement of the same pencil may differ from the real value by at most ${slots.tolerance} cm.`, `The third result differs by ${Math.abs(slots.measurements[2] - slots.measurements[0])} cm, far beyond the allowed error, so it is incompatible with the first two.`]; }
  }
];
