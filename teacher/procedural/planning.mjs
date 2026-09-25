/**
 * Planning families of the procedural arithmetic source.
 *
 * These four families add plan shapes that the shipped books do not exercise as
 * plans of their own: a parallel-join feasibility verdict, a depletion count
 * with a lead-time decision, a two-tier price, and a ceil-division crate count
 * with a partial last unit. Each family keeps the contract of the source —
 * self-contained statement, integer-exact oracle reached by a route independent
 * of the circuit body, reference parse of its own statements, difficulty vector
 * — and each one contributes a distinct plan fingerprint to the training set.
 *
 * They live in their own module because a generator family is a unit of code
 * with a size budget of its own (DS001), and because the ledger, rate, and
 * planning shapes are easier to review when they are not interleaved.
 */

const TEAMS = ['release', 'migration', 'integration', 'rollout', 'audit'];
const TRACKS = [['design', 'build'], ['draft', 'review'], ['survey', 'prototype'], ['import', 'validate']];
const DEPOTS = ['depot', 'warehouse', 'storeroom', 'yard'];
const GOODS = ['timber', 'cable', 'sheet metal', 'ballast', 'pipe'];
const PRINTERS = ['print shop', 'binder', 'copy house', 'press room'];
const PAPER = ['reams', 'quires', 'bundles', 'packs'];
const PLANTS = ['plant', 'workshop', 'kiln', 'mill'];
const MATERIALS = ['bricks', 'tiles', 'beams', 'crates', 'bearings'];

/** The latent plan: a parallel join plus a serial step, against a stated window. */
const deadlineFeasibility = {
  id: 'parallel-join-deadline',
  name: 'Parallel Join Deadline',
  type: 'parallel-join-deadline',
  category: 'no-knowledge',
  difficulty: { subproblems: 3, dependencyDepth: 2, branching: 1, irrelevantInformation: 0, symbolicShare: 0.9 },
  sample(random) {
    const first = 5 + Math.floor(random() * 60);
    const second = 5 + Math.floor(random() * 60);
    const serial = 5 + Math.floor(random() * 40);
    const limit = 20 + Math.floor(random() * 120);
    const tracks = TRACKS[Math.floor(random() * TRACKS.length)];
    return {
      workName: TEAMS[Math.floor(random() * TEAMS.length)],
      firstTrack: tracks[0],
      firstMinutes: first,
      secondTrack: tracks[1],
      secondMinutes: second,
      serialTrack: 'review',
      serialMinutes: serial,
      limitMinutes: limit
    };
  },
  statement(slots) {
    return `A ${slots.workName} plan runs the ${slots.firstTrack} and ${slots.secondTrack} tracks in parallel, needing ` +
      `${slots.firstMinutes} and ${slots.secondMinutes} minutes, and then the ${slots.serialTrack} step takes ${slots.serialMinutes} minutes ` +
      `after both finish. The window is ${slots.limitMinutes} minutes. What is the earliest elapsed time, and does the plan fit the window?`;
  },
  parse(statement) {
    const plan = /^A ([a-z][a-z ]*) plan runs the ([a-z][a-z ]*) and ([a-z][a-z ]*) tracks in parallel, needing (\d+) and (\d+) minutes/.exec(statement);
    const serial = /then the ([a-z][a-z ]*) step takes (\d+) minutes after both finish\./.exec(statement);
    const window = /The window is (\d+) minutes\./.exec(statement);
    if (plan === null || serial === null || window === null) {
      throw new Error('the statement does not state the two parallel tracks, the serial step, and the window');
    }
    return {
      workName: plan[1],
      firstTrack: plan[2],
      firstMinutes: Number(plan[4]),
      secondTrack: plan[3],
      secondMinutes: Number(plan[5]),
      serialTrack: serial[1],
      serialMinutes: Number(serial[2]),
      limitMinutes: Number(window[1])
    };
  },
  /** Independent oracle: the join time as a maximum of the two tracks. */
  solve(slots) {
    const joinMinutes = Math.max(slots.firstMinutes, slots.secondMinutes);
    const elapsed = joinMinutes + slots.serialMinutes;
    return { elapsed, fits: elapsed <= slots.limitMinutes };
  },
  render(solution) {
    return `The earliest elapsed time is ${solution.elapsed} minutes, so the plan ${solution.fits ? 'fits' : 'does not fit'} the window.`;
  },
  compute: [
    'const slots = $slots;',
    'const tracks = [slots.firstMinutes, slots.secondMinutes].sort((left, right) => right - left);',
    'const joinMinutes = tracks[0];',
    'probe(joinMinutes >= tracks[1], "the join must wait for the slower parallel track");',
    'const elapsed = joinMinutes + slots.serialMinutes;',
    'return "The earliest elapsed time is " + elapsed + " minutes, so the plan " + (elapsed <= slots.limitMinutes ? "fits" : "does not fit") + " the window.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The ${slots.firstTrack} and ${slots.secondTrack} tracks run in parallel, so the join waits for the slower one: ${slots.firstMinutes} against ${slots.secondMinutes} minutes.`,
      `The ${slots.serialTrack} step adds ${slots.serialMinutes} minutes after the join.`,
      `The elapsed time is compared with the ${slots.limitMinutes}-minute window: ${solution.elapsed} minutes, which ${solution.fits ? 'fits' : 'does not fit'}.`
    ];
  }
};

/** The latent plan: whole days of coverage, then a lead-time decision. */
const restockThreshold = {
  id: 'depletion-days-and-lead-time',
  name: 'Depletion Days and Lead Time',
  type: 'depletion-days-and-lead-time',
  category: 'no-knowledge',
  difficulty: { subproblems: 2, dependencyDepth: 2, branching: 1, irrelevantInformation: 0, symbolicShare: 0.9 },
  sample(random) {
    const dailyUse = 2 + Math.floor(random() * 18);
    const stockUnits = dailyUse * (3 + Math.floor(random() * 20)) + Math.floor(random() * dailyUse);
    return {
      depot: DEPOTS[Math.floor(random() * DEPOTS.length)],
      good: GOODS[Math.floor(random() * GOODS.length)],
      stockUnits,
      dailyUse,
      leadDays: 1 + Math.floor(random() * 9)
    };
  },
  statement(slots) {
    return `A ${slots.depot} holds ${slots.stockUnits} units of ${slots.good}. The workshop consumes ${slots.dailyUse} units every day, ` +
      `and a delivery takes ${slots.leadDays} days to arrive. How many whole days does the stock cover, and must the order be placed today?`;
  },
  parse(statement) {
    const stock = /^A ([a-z][a-z ]*) holds (\d+) units of ([a-z][a-z ]*)\./.exec(statement);
    const use = /The workshop consumes (\d+) units every day, and a delivery takes (\d+) days to arrive\./.exec(statement);
    if (stock === null || use === null) {
      throw new Error('the statement does not state the stock, the daily use, and the lead time');
    }
    return {
      depot: stock[1],
      good: stock[3],
      stockUnits: Number(stock[2]),
      dailyUse: Number(use[1]),
      leadDays: Number(use[2])
    };
  },
  /** Independent oracle: the covered days by division, then the lead-time test. */
  solve(slots) {
    const days = Math.floor(slots.stockUnits / slots.dailyUse);
    return { days, orderToday: slots.leadDays >= days };
  },
  render(solution) {
    return `The stock covers ${solution.days} whole days, so the order ${solution.orderToday ? 'must be placed today' : 'can wait'}.`;
  },
  compute: [
    'const slots = $slots;',
    'let remaining = slots.stockUnits;',
    'let days = 0;',
    'while (remaining >= slots.dailyUse) {',
    '  remaining -= slots.dailyUse;',
    '  days += 1;',
    '}',
    'probe(remaining >= 0 && remaining < slots.dailyUse, "the covered days must be the largest whole number that the stock supports");',
    'const orderToday = slots.leadDays >= days;',
    'return "The stock covers " + days + " whole days, so the order " + (orderToday ? "must be placed today" : "can wait") + ".";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The workshop consumes ${slots.dailyUse} units a day from ${slots.stockUnits} units of ${slots.good}.`,
      `The stock covers ${solution.days} whole days, and the remainder cannot pay for another day.`,
      `A delivery takes ${slots.leadDays} days, so ordering today is ${solution.orderToday ? 'required' : 'not required yet'}.`
    ];
  }
};

/** The latent plan: a two-tier price over a stated quantity. */
const tieredDiscount = {
  id: 'two-tier-price',
  name: 'Two Tier Price',
  type: 'two-tier-price',
  category: 'no-knowledge',
  difficulty: { subproblems: 2, dependencyDepth: 2, branching: 1, irrelevantInformation: 0, symbolicShare: 0.95 },
  sample(random) {
    const basePrice = 8 + Math.floor(random() * 30);
    const discountedPrice = 2 + Math.floor(random() * (basePrice - 3));
    const threshold = 5 + Math.floor(random() * 20);
    const quantity = 1 + Math.floor(random() * 40);
    return {
      printer: PRINTERS[Math.floor(random() * PRINTERS.length)],
      unitWord: PAPER[Math.floor(random() * PAPER.length)],
      basePrice,
      discountedPrice,
      threshold,
      quantity
    };
  },
  statement(slots) {
    return `A ${slots.printer} charges ${slots.basePrice} units for each of the first ${slots.threshold} ${slots.unitWord} and ` +
      `${slots.discountedPrice} units for each ${slots.unitWord} beyond that. A customer orders ${slots.quantity} ${slots.unitWord}. What is the total?`;
  },
  parse(statement) {
    const price = /^A ([a-z][a-z ]*) charges (\d+) units for each of the first (\d+) ([a-z]+) and (\d+) units for each ([a-z]+) beyond that\./.exec(statement);
    const order = /A customer orders (\d+) [a-z]+\./.exec(statement);
    if (price === null || order === null) {
      throw new Error('the statement does not state the two prices, the threshold, and the ordered quantity');
    }
    return {
      printer: price[1],
      unitWord: price[4],
      basePrice: Number(price[2]),
      threshold: Number(price[3]),
      discountedPrice: Number(price[5]),
      quantity: Number(order[1])
    };
  },
  /** Independent oracle: the two tiers summed as separate blocks. */
  solve(slots) {
    const atBase = Math.min(slots.quantity, slots.threshold);
    const atDiscount = Math.max(0, slots.quantity - slots.threshold);
    return { total: atBase * slots.basePrice + atDiscount * slots.discountedPrice, atBase, atDiscount };
  },
  render(solution) {
    return `The total is ${solution.total} units.`;
  },
  compute: [
    'const slots = $slots;',
    'let total = 0;',
    'for (let index = 0; index < slots.quantity; index += 1) {',
    '  total += index < slots.threshold ? slots.basePrice : slots.discountedPrice;',
    '}',
    'return "The total is " + total + " units.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `${solution.atBase} of the ${slots.quantity} ${slots.unitWord} are charged ${slots.basePrice} units each.`,
      `${solution.atDiscount} ${slots.unitWord} fall beyond the ${slots.threshold}-unit threshold and are charged ${slots.discountedPrice} units each.`,
      `The two blocks add up to ${solution.total} units.`
    ];
  }
};

/** The latent plan: crates needed for a total, with the partial last crate. */
const crateCount = {
  id: 'crate-count-with-partial-last',
  name: 'Crate Count with Partial Last',
  type: 'crate-count-with-partial-last',
  category: 'no-knowledge',
  difficulty: { subproblems: 2, dependencyDepth: 2, branching: 0, irrelevantInformation: 0, symbolicShare: 0.9 },
  sample(random) {
    const unitsPerCrate = 6 + Math.floor(random() * 24);
    const crates = 3 + Math.floor(random() * 30);
    const totalUnits = crates * unitsPerCrate - Math.floor(random() * unitsPerCrate);
    return {
      plant: PLANTS[Math.floor(random() * PLANTS.length)],
      material: MATERIALS[Math.floor(random() * MATERIALS.length)],
      totalUnits,
      unitsPerCrate
    };
  },
  statement(slots) {
    return `A ${slots.plant} produces ${slots.totalUnits} units of ${slots.material} in one shift. Each crate holds ${slots.unitsPerCrate} units. ` +
      'How many crates are needed, and how many units are in the last crate?';
  },
  parse(statement) {
    const plant = /^A ([a-z][a-z ]*) produces (\d+) units of ([a-z ]+) in one shift\./.exec(statement);
    const crate = /Each crate holds (\d+) units\./.exec(statement);
    if (plant === null || crate === null) {
      throw new Error('the statement does not state the produced units and the crate capacity');
    }
    return {
      plant: plant[1],
      material: plant[3].trim(),
      totalUnits: Number(plant[2]),
      unitsPerCrate: Number(crate[1])
    };
  },
  /** Independent oracle: the crate count by ceiling division. */
  solve(slots) {
    const crates = Math.ceil(slots.totalUnits / slots.unitsPerCrate);
    return { crates, lastCrate: slots.totalUnits - (crates - 1) * slots.unitsPerCrate };
  },
  render(solution) {
    return `${solution.crates} crates are needed, and the last crate holds ${solution.lastCrate} units.`;
  },
  compute: [
    'const slots = $slots;',
    'let crates = 0;',
    'let packed = 0;',
    'while (packed < slots.totalUnits) {',
    '  crates += 1;',
    '  packed += slots.unitsPerCrate;',
    '}',
    'const lastCrate = slots.totalUnits - (crates - 1) * slots.unitsPerCrate;',
    'probe(lastCrate > 0 && lastCrate <= slots.unitsPerCrate, "the last crate must hold between one unit and its capacity");',
    'probe((crates - 1) * slots.unitsPerCrate < slots.totalUnits, "one crate fewer must not hold the whole shift");',
    'return crates + " crates are needed, and the last crate holds " + lastCrate + " units.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The shift produces ${slots.totalUnits} units and a crate holds ${slots.unitsPerCrate}.`,
      `Filling whole crates leaves a partial one, so the count is the smallest number of crates that holds the shift: ${solution.crates}.`,
      `The last crate carries the remainder: ${solution.lastCrate} units.`
    ];
  }
};

export const planningFamilies = [deadlineFeasibility, restockThreshold, tieredDiscount, crateCount];
