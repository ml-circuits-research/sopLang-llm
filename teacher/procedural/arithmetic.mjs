/**
 * First procedural source: arithmetic plans over a small budget.
 *
 * The seven seed books are a closed set of problems, and the first training
 * series showed that the binding constraint is plan coverage rather than the
 * recipe (see `evaluation/registry/phase4-analysis.md`). A procedural source
 * generates its own statements, so its plan set is not limited by what a book
 * prints. This module is the first one: three generator families, each fixing a
 * latent plan shape, with an independent oracle, a reference parse over the
 * statements it renders, the circuit compute body, and the explanation steps.
 *
 * The families are deliberately small and self-contained, in the style of the
 * shipped training families: every statement carries its own premises, so an
 * instance needs no external fact, and the answer is a deterministic function
 * of the values the statement states.
 *
 * A family here plays the role a printed template plays in a book, and the
 * contract for a procedural source is specified in `docs/specs/DS008-training-data.md`
 * under "Procedural source families". Instances are sampled from a recorded
 * seed, the acceptance class is `constructed_verified`, and the family is the
 * split unit: a holdout family is never trained on.
 */

import { planningFamilies } from './planning.mjs';
import { textFamilies } from './text.mjs';
import { decompositionFamilies } from './decompose.mjs';
import { mixedFamilies } from './mixed.mjs';
import { groupingFamilies } from './grouping.mjs';
import { aggregationFamilies } from './aggregation.mjs';
import { textShapeFamilies } from './textshapes.mjs';
import { families as contrastiveFamilies } from './contrastive.mjs';

export const sourceId = 'procedural-arithmetic';
export const generatorVersion = '1.2.0';

const HOLDERS = ['Priya', 'Mara', 'Daria', 'Luca', 'Ines', 'Tomas', 'Nadia', 'Ravi'];
const WORKSHOPS = ['printing workshop', 'bicycle workshop', 'bakery', 'locksmith', 'upholstery workshop'];
const PRODUCTS = ['cable', 'rope', 'shelving rail', 'pipe', 'timber batten'];
const SUPPLIERS = ['Aldea', 'Brenner', 'Costache', 'Dragomir', 'Erlich', 'Farkas'];

/** The latent plan: a running balance over a stated ledger, with a fee per withdrawal. */
const netBalance = {
  id: 'net-balance-with-withdrawals',
  name: 'Net Balance with Withdrawals',
  type: 'net-balance-with-withdrawals',
  category: 'no-knowledge',
  difficulty: { subproblems: 2, dependencyDepth: 2, branching: 0, irrelevantInformation: 0, symbolicShare: 0.9 },
  sample(random) {
    const openingBalance = 40 + Math.floor(random() * 180);
    const deposits = [10 + Math.floor(random() * 90), 10 + Math.floor(random() * 90), 10 + Math.floor(random() * 60)];
    const withdrawals = [10 + Math.floor(random() * 40), 10 + Math.floor(random() * 40)];
    return {
      holder: HOLDERS[Math.floor(random() * HOLDERS.length)],
      openingBalance,
      deposits,
      withdrawals,
      withdrawalFee: 2 + Math.floor(random() * 5)
    };
  },
  statement(slots) {
    return `${slots.holder} opens a savings account with ${slots.openingBalance} units. ` +
      `${slots.holder} deposits ${slots.deposits[0]}, ${slots.deposits[1]} and ${slots.deposits[2]} units, and withdraws ` +
      `${slots.withdrawals[0]} and ${slots.withdrawals[1]} units. Every withdrawal is charged a fee of ${slots.withdrawalFee} units. ` +
      'What is the closing balance, and how many withdrawals were made?';
  },
  parse(statement) {
    const holder = /^([A-Z][a-z]+) opens a savings account with (\d+) units\./.exec(statement);
    const ledger = /deposits (\d+), (\d+) and (\d+) units, and withdraws (\d+) and (\d+) units\./.exec(statement);
    const fee = /charged a fee of (\d+) units\./.exec(statement);
    if (holder === null || ledger === null || fee === null) {
      throw new Error('the statement does not state the opening balance, the deposits, the withdrawals, and the fee');
    }
    return {
      holder: holder[1],
      openingBalance: Number(holder[2]),
      deposits: [Number(ledger[1]), Number(ledger[2]), Number(ledger[3])],
      withdrawals: [Number(ledger[4]), Number(ledger[5])],
      withdrawalFee: Number(fee[1])
    };
  },
  /** Independent oracle: the ledger summed as a whole, in one expression per side. */
  solve(slots) {
    const credited = slots.openingBalance + slots.deposits.reduce((total, amount) => total + amount, 0);
    const debited = slots.withdrawals.reduce((total, amount) => total + amount, 0) + slots.withdrawalFee * slots.withdrawals.length;
    return { closingBalance: credited - debited, withdrawals: slots.withdrawals.length };
  },
  render(solution) {
    return `The closing balance is ${solution.closingBalance} units after ${solution.withdrawals} withdrawals.`;
  },
  compute: [
    'const slots = $slots;',
    'probe(Number.isInteger(slots.openingBalance) && slots.openingBalance >= 0, "the opening balance must be a whole number of units");',
    'probe(Array.isArray(slots.deposits) && slots.deposits.length > 0, "the deposits must be a list of at least one amount");',
    'probe(Array.isArray(slots.withdrawals) && slots.withdrawals.length > 0, "the withdrawals must be a list of at least one amount");',
    'probe(Number.isInteger(slots.withdrawalFee) && slots.withdrawalFee > 0, "the withdrawal fee must be a positive whole number of units");',
    'const ledger = [{ kind: "opening", amount: slots.openingBalance }];',
    'for (const amount of slots.deposits) {',
    '  probe(Number.isInteger(amount) && amount > 0, "every deposit must be a positive whole number of units");',
    '  ledger.push({ kind: "deposit", amount });',
    '}',
    'for (const amount of slots.withdrawals) {',
    '  probe(Number.isInteger(amount) && amount > 0, "every withdrawal must be a positive whole number of units");',
    '  ledger.push({ kind: "withdrawal", amount });',
    '}',
    'let balance = 0;',
    'for (const entry of ledger) {',
    '  balance += entry.kind === "withdrawal" ? -entry.amount - slots.withdrawalFee : entry.amount;',
    '}',
    'probe(balance >= 0, "the account must not close below zero");',
    'const withdrawals = ledger.filter((entry) => entry.kind === "withdrawal").length;',
    'return "The closing balance is " + balance + " units after " + withdrawals + " withdrawals.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The account opens with ${slots.openingBalance} units.`,
      `Deposits add ${slots.deposits.join(' + ')} units and withdrawals remove ${slots.withdrawals.join(' + ')} units plus ${slots.withdrawalFee} units of fee each.`,
      `Summing the ledger gives a closing balance of ${solution.closingBalance} units after ${solution.withdrawals} withdrawals.`
    ];
  }
};

/** The latent plan: the largest whole number of units a fixed budget still covers. */
const wholeUnits = {
  id: 'whole-units-under-a-budget',
  name: 'Whole Units under a Budget',
  type: 'whole-units-under-a-budget',
  category: 'no-knowledge',
  difficulty: { subproblems: 2, dependencyDepth: 2, branching: 0, irrelevantInformation: 0, symbolicShare: 0.95 },
  sample(random) {
    const unitPrice = 20 + Math.floor(random() * 80);
    const budget = 200 + Math.floor(random() * 600);
    const setupFee = 5 + Math.floor(random() * 40);
    return {
      workshop: WORKSHOPS[Math.floor(random() * WORKSHOPS.length)],
      budget,
      unitPrice,
      setupFee
    };
  },
  statement(slots) {
    return `A ${slots.workshop} may spend at most ${slots.budget} units. Each crate costs ${slots.unitPrice} units, ` +
      `and the delivery fee is ${slots.setupFee} units, charged once. ` +
      'How many whole crates can the workshop order, and how much money is left?';
  },
  parse(statement) {
    const budget = /may spend at most (\d+) units\./.exec(statement);
    const price = /Each crate costs (\d+) units/.exec(statement);
    const fee = /delivery fee is (\d+) units, charged once\./.exec(statement);
    const workshop = /^A ([a-z][a-z ]*) may spend/.exec(statement);
    if (budget === null || price === null || fee === null || workshop === null) {
      throw new Error('the statement does not state the budget, the unit price, the delivery fee, and the workshop');
    }
    return {
      workshop: workshop[1],
      budget: Number(budget[1]),
      unitPrice: Number(price[1]),
      setupFee: Number(fee[1])
    };
  },
  /** Independent oracle: the affordable count from the money after the fee, by division. */
  solve(slots) {
    const afterFee = slots.budget - slots.setupFee;
    const count = Math.floor(afterFee / slots.unitPrice);
    return { count, leftover: afterFee - count * slots.unitPrice };
  },
  render(solution) {
    return `The workshop can order ${solution.count} whole crates and has ${solution.leftover} units left.`;
  },
  compute: [
    'const slots = $slots;',
    'probe(Number.isInteger(slots.budget) && slots.budget > 0, "the budget must be a positive whole number of units");',
    'probe(Number.isInteger(slots.unitPrice) && slots.unitPrice > 0, "the unit price must be a positive whole number of units");',
    'probe(Number.isInteger(slots.setupFee) && slots.setupFee >= 0, "the delivery fee must be a whole number of units");',
    'probe(slots.setupFee <= slots.budget, "the delivery fee must not exceed the budget");',
    'let count = Math.floor(slots.budget / slots.unitPrice);',
    'while (count > 0 && slots.setupFee + count * slots.unitPrice > slots.budget) {',
    '  count -= 1;',
    '}',
    'const spent = slots.setupFee + count * slots.unitPrice;',
    'probe(spent <= slots.budget, "the order must stay inside the budget");',
    'probe(count === 0 || spent + slots.unitPrice > slots.budget, "the order must use the largest affordable number of crates");',
    'return "The workshop can order " + count + " whole crates and has " + (slots.budget - spent) + " units left.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `The delivery fee of ${slots.setupFee} units is charged once, so ${slots.budget - slots.setupFee} units stay for the crates.`,
      `At ${slots.unitPrice} units per crate, the largest whole number of crates that fits is the answer to the stated limit.`,
      `The largest affordable order is ${solution.count} crates with ${solution.leftover} units left.`
    ];
  }
};

/** The latent plan: compare two rates exactly and report the cheaper one with its margin. */
const cheaperRate = {
  id: 'cheaper-rate-per-unit',
  name: 'Cheaper Rate per Unit',
  type: 'cheaper-rate-per-unit',
  category: 'no-knowledge',
  difficulty: { subproblems: 2, dependencyDepth: 1, branching: 1, irrelevantInformation: 0, symbolicShare: 0.9 },
  sample(random) {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const quantityA = 4 + Math.floor(random() * 16);
      const quantityB = 4 + Math.floor(random() * 16);
      const priceA = 20 + Math.floor(random() * 100);
      const priceB = 20 + Math.floor(random() * 100);
      const crossA = priceA * quantityB;
      const crossB = priceB * quantityA;
      if (crossA === crossB) {
        continue;
      }
      // The exact margin is |priceA/quantityA - priceB/quantityB|; a margin that is a
      // whole multiple of one thousandth would sit on a rounding boundary, so it is
      // resampled and the oracle's decimal formatting stays unambiguous.
      const numerator = Math.abs(crossA - crossB);
      const denominator = quantityA * quantityB;
      if ((numerator * 1000) % denominator === 0) {
        continue;
      }
      return {
        product: PRODUCTS[Math.floor(random() * PRODUCTS.length)],
        optionA: { label: SUPPLIERS[Math.floor(random() * SUPPLIERS.length)], price: priceA, quantity: quantityA },
        optionB: { label: SUPPLIERS[Math.floor(random() * SUPPLIERS.length)], price: priceB, quantity: quantityB }
      };
    }
    throw new Error('the sampler could not draw two comparable offers');
  },
  statement(slots) {
    return `Two suppliers sell the same ${slots.product}. ${slots.optionA.label} charges ${slots.optionA.price} units for ` +
      `${slots.optionA.quantity} metres; ${slots.optionB.label} charges ${slots.optionB.price} units for ${slots.optionB.quantity} metres. ` +
      'Which supplier is cheaper per metre, and by how much per metre?';
  },
  parse(statement) {
    const offers = /([A-Z][a-z]+) charges (\d+) units for (\d+) metres; ([A-Z][a-z]+) charges (\d+) units for (\d+) metres\./.exec(statement);
    const product = /Two suppliers sell the same ([a-z][a-z ]*)\./.exec(statement);
    if (offers === null || product === null) {
      throw new Error('the statement does not state the product and the two offers with their prices and quantities');
    }
    return {
      product: product[1],
      optionA: { label: offers[1], price: Number(offers[2]), quantity: Number(offers[3]) },
      optionB: { label: offers[4], price: Number(offers[5]), quantity: Number(offers[6]) }
    };
  },
  /** Independent oracle: the two rates as numbers, compared directly. */
  solve(slots) {
    const rateA = slots.optionA.price / slots.optionA.quantity;
    const rateB = slots.optionB.price / slots.optionB.quantity;
    const cheaper = rateA < rateB ? slots.optionA : slots.optionB;
    return { label: cheaper.label, margin: Math.abs(rateA - rateB).toFixed(2) };
  },
  render(solution) {
    return `${solution.label} is cheaper per metre by ${solution.margin} units per metre.`;
  },
  compute: [
    'const slots = $slots;',
    'probe(typeof slots.optionA === "object" && slots.optionA !== null, "the first offer must carry a label, a price and a quantity");',
    'probe(typeof slots.optionB === "object" && slots.optionB !== null, "the second offer must carry a label, a price and a quantity");',
    'const optionA = slots.optionA;',
    'const optionB = slots.optionB;',
    'probe(Number.isInteger(optionA.price) && optionA.price > 0, "the first price must be a positive whole number of units");',
    'probe(Number.isInteger(optionB.price) && optionB.price > 0, "the second price must be a positive whole number of units");',
    'probe(Number.isInteger(optionA.quantity) && optionA.quantity > 0, "the first quantity must be a positive whole number of metres");',
    'probe(Number.isInteger(optionB.quantity) && optionB.quantity > 0, "the second quantity must be a positive whole number of metres");',
    'const crossedA = optionA.price * optionB.quantity;',
    'const crossedB = optionB.price * optionA.quantity;',
    'probe(crossedA !== crossedB, "the two offers must not have the same price per metre");',
    'const cheaper = crossedA < crossedB ? optionA : optionB;',
    'const margin = Math.abs(crossedA - crossedB) / (optionA.quantity * optionB.quantity);',
    'return cheaper.label + " is cheaper per metre by " + margin.toFixed(2) + " units per metre.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `${slots.optionA.label} charges ${slots.optionA.price} units for ${slots.optionA.quantity} metres, and ${slots.optionB.label} charges ${slots.optionB.price} units for ${slots.optionB.quantity} metres.`,
      'The comparison crosses the quantities instead of rounding the two rates, so the verdict never depends on a rounded middle value.',
      `${solution.label} is the cheaper offer, by ${solution.margin} units per metre.`
    ];
  }
};

export const families = [
  netBalance,
  wholeUnits,
  cheaperRate,
  ...planningFamilies,
  ...textFamilies,
  ...decompositionFamilies,
  ...mixedFamilies,
  ...groupingFamilies,
  ...aggregationFamilies,
  ...textShapeFamilies,
  ...contrastiveFamilies
];
