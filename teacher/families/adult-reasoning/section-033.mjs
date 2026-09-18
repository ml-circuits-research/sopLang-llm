/**
 * Section 33 of the adult-reasoning course: recycling, sorting, and exceptions.
 *
 * Every variant prints one ward's bin legend (yellow = clean plastic/metal,
 * blue = dry paper, brown = fruit/veg, black = the rest, with foil with sauce
 * and greasy pizza boxes excluded, and unseparable materials going to black)
 * and one person's five objects. The verdict sorts each object by the printed
 * legend: the greasy box is excluded from paper, the yoghurt foil is not
 * clean, the banana skin is fruit, the rinsed aluminium is clean metal, and
 * the jam jar separates in the hand, so its glass body goes to glass and its
 * plastic lid to yellow. The variants change the ward and the person's name,
 * so the family reads the legend and the object list from the statement.
 */

import { slugify } from '../../naming.mjs';

const PLACE_PATTERN = /Bins in ([^:\n]+):/;
const BIN_PATTERNS = {
  yellow: /yellow = ([^;.\n]+)/i,
  blue: /blue = ([^;.\n]+)/i,
  brown: /brown = ([^;.\n]+)/i,
  black: /black = ([^;.\n]+)/i
};
const HOLDER_PATTERN = /([A-Z][a-z]+) has: ([^.\n]+)\./;

const ITEM_RULES = [
  { test: /greasy pizza box/, clause: 'Pizza box black' },
  { test: /jar with a plastic lid/, clause: 'jar green + lid yellow' },
  { test: /foil with/, clause: 'dirty foil black' },
  { test: /banana skin/, clause: 'skin brown' },
  { test: /aluminium/, clause: 'aluminium yellow' }
];

function parse(statement) {
  const place = PLACE_PATTERN.exec(statement);
  const holder = HOLDER_PATTERN.exec(statement);
  const bins = {};
  for (const [name, pattern] of Object.entries(BIN_PATTERNS)) {
    const match = pattern.exec(statement);
    if (match === null) {
      throw new Error(`the statement does not carry the ${name} bin`);
    }
    bins[name] = match[1].trim();
  }
  if (place === null || holder === null) {
    throw new Error('the statement does not carry the bin legend and the person’s objects');
  }
  if (!/no foil with sauce/.test(statement) || !/no greasy pizza box/.test(statement)) {
    throw new Error('the legend does not carry the two stated exceptions');
  }
  if (!/cannot be separated by hand/.test(statement) || !/glass green/.test(statement)) {
    throw new Error('the legend does not carry the separation rules');
  }
  return {
    place: place[1].trim(),
    bins,
    unseparableToBlack: true,
    separatesLidFromGlass: true,
    holder: holder[1],
    objects: holder[2].split(';').map((item) => item.trim()).filter((item) => item.length > 0)
  };
}

/**
 * The legend settles every object. Each object must match exactly one printed
 * rule, because an object the legend does not classify cannot be sorted from
 * the statement alone.
 */
function classify(object) {
  const matches = ITEM_RULES.filter((rule) => rule.test.test(object));
  if (matches.length !== 1) {
    throw new Error(`the legend does not place the object "${object}"`);
  }
  return matches[0];
}

function solve(slots) {
  if (slots.objects.length !== 5) {
    throw new Error('the case must list five objects to sort');
  }
  const clauses = slots.objects.map((object) => classify(object).clause);
  return { clauses };
}

function render(solution) {
  return `${solution.clauses.join('; ')}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place whose bins are used");',
  'probe(typeof slots.holder === "string" && slots.holder.length > 0, "the case must name the person sorting the objects");',
  'probe(Array.isArray(slots.objects) && slots.objects.length === 5, "the case must list five objects");',
  'probe(slots.objects.every((object) => typeof object === "string" && object.length > 0), "every object must be a non-empty description");',
  'probe(new Set(slots.objects).size === slots.objects.length, "the five objects must be different");',
  'probe(slots.bins.yellow.length > 0 && slots.bins.blue.length > 0 && slots.bins.brown.length > 0, "the legend must define the yellow, blue, and brown bins");',
  'probe(slots.bins.black === "the rest", "the black bin must take what no other bin takes");',
  'probe(slots.unseparableToBlack === true, "two materials that cannot be separated by hand must go to black");',
  'probe(slots.separatesLidFromGlass === true, "the plastic lid and the glass jar must separate");',
  'const rules = [',
  '  { test: /greasy pizza box/, clause: "Pizza box black" },',
  '  { test: /jar with a plastic lid/, clause: "jar green + lid yellow" },',
  '  { test: /foil with/, clause: "dirty foil black" },',
  '  { test: /banana skin/, clause: "skin brown" },',
  '  { test: /aluminium/, clause: "aluminium yellow" }',
  '];',
  'const clauses = slots.objects.map((object) => {',
  '  const matches = rules.filter((rule) => rule.test.test(object));',
  '  probe(matches.length === 1, "the legend must place each object in exactly one bin");',
  '  return matches[0].clause;',
  '});',
  'return clauses.join("; ") + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The legend for ${slots.place} is the whole rulebook, so each of the five objects is placed by its printed line and not by any general idea of recycling.`,
    'The greasy pizza box is refused by the dry-paper bin and the yoghurt foil is not clean plastic/metal, so both fall to black; the banana skin is fruit/veg and the rinsed aluminium is clean, so they go to brown and yellow.',
    'The jam jar is the exception that has to be split by hand: its plastic lid goes to yellow and its glass body to glass, which the last legend line states.'
  ];
}

export const unit = 33;

export const cases = [
  {
    template: 'Recycling, sorting, and exceptions',
    type: slugify('Recycling, sorting, and exceptions'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
