/**
 * Section 20 of the logical-reasoning book: a nested conditional.
 *
 * Every case posts one archive slip with a nest — "if a researcher holds a
 * yellow pass, then if the clock is after 17:00, the rare-map drawer may be
 * opened" — and records three researchers: one holds the pass before the hour,
 * one holds the pass after the hour, and one holds no pass after the hour and
 * expects the late clock alone to open the drawer. The case data changes the
 * place, the pass colour, the three names, and the two clock readings; the
 * reasoning is fixed: the nest unpacks to pass AND after the hour, so only the
 * researcher who satisfies both conjuncts may open the drawer. The family
 * converts both clock readings and the stated threshold to minutes of the day
 * and decides each researcher from the comparison.
 */

import { slugify } from '../../naming.mjs';

const CARD_PATTERN =
  /If a researcher holds a ([a-z]+) pass, then if the clock is after (\d{1,2}):(\d{2}), the rare-map drawer may be opened\./;
const HOLDER_PATTERN = /([A-Z][a-z]+) holds a ([a-z]+) pass at (\d{1,2}):(\d{2})/g;
const NO_PASS_PATTERN = /([A-Z][a-z]+) holds no pass at (\d{1,2}):(\d{2})/g;

/** Minutes of the day, so "after 17:00" is an integer comparison. */
function minutesOf(hours, minutes) {
  return Number(hours) * 60 + Number(minutes);
}

function parse(statement) {
  const card = CARD_PATTERN.exec(statement);
  if (card === null) {
    throw new Error('the statement does not post the archive slip with its nested condition');
  }
  const holders = [...statement.matchAll(HOLDER_PATTERN)].map((match) => ({
    name: match[1],
    pass: match[2],
    minutes: minutesOf(match[3], match[4]),
    holds: true
  }));
  const guests = [...statement.matchAll(NO_PASS_PATTERN)].map((match) => ({
    name: match[1],
    pass: null,
    minutes: minutesOf(match[2], match[3]),
    holds: false
  }));
  const researchers = [...holders, ...guests];
  if (researchers.length !== 3) {
    throw new Error('the statement must record three researchers');
  }
  for (const researcher of holders) {
    if (researcher.pass !== card[1]) {
      throw new Error('every pass holder must hold the pass colour the slip names');
    }
  }
  return {
    passColour: card[1],
    threshold: minutesOf(card[2], card[3]),
    researchers
  };
}

/**
 * The nest unpacks to a conjunction: the pass releases the inner conditional,
 * and the inner conditional then asks for the late hour. Each researcher is
 * judged by both conjuncts, which sorts them into the one who may open, the one
 * with the pass but not the hour, and the one with the hour but no pass.
 */
function solve(slots) {
  const names = slots.researchers.map((researcher) => researcher.name);
  if (new Set(names).size !== names.length) {
    throw new Error('the statement must record three different researchers');
  }
  const allowed = slots.researchers.filter((researcher) => researcher.holds && researcher.minutes > slots.threshold);
  const passWithoutHour = slots.researchers.filter((researcher) => researcher.holds && researcher.minutes <= slots.threshold);
  const hourWithoutPass = slots.researchers.filter((researcher) => !researcher.holds && researcher.minutes > slots.threshold);
  if (allowed.length !== 1 || passWithoutHour.length !== 1 || hourWithoutPass.length !== 1) {
    throw new Error('the case must be the pass-and-hour nest of this section');
  }
  return {
    allowed: allowed[0].name,
    passWithoutHour: passWithoutHour[0].name,
    hourWithoutPass: hourWithoutPass[0].name
  };
}

function render(solution) {
  return `Only ${solution.allowed}. ${solution.passWithoutHour} has the pass but not the hour. ${solution.hourWithoutPass} has the hour without the pass. A nest is not a menu from which you pick one trigger.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.passColour === "string" && slots.passColour.length > 0, "the slip must name the pass colour");',
  'probe(Number.isInteger(slots.threshold) && slots.threshold > 0 && slots.threshold < 1440, "the slip must state a clock threshold within the day");',
  'probe(Array.isArray(slots.researchers) && slots.researchers.length === 3, "the case must record three researchers");',
  'probe(slots.researchers.every((r) => typeof r.name === "string" && r.name.length > 0), "every researcher must have a name");',
  'probe(slots.researchers.every((r) => Number.isInteger(r.minutes) && r.minutes >= 0 && r.minutes < 1440), "every clock reading must be a time of the day");',
  'probe(slots.researchers.every((r) => (r.holds ? r.pass === slots.passColour : r.pass === null)), "every pass holder must hold the pass the slip names");',
  'probe(new Set(slots.researchers.map((r) => r.name)).size === slots.researchers.length, "the three researchers must be different people");',
  'const allowed = slots.researchers.filter((r) => r.holds && r.minutes > slots.threshold);',
  'const passWithoutHour = slots.researchers.filter((r) => r.holds && r.minutes <= slots.threshold);',
  'const hourWithoutPass = slots.researchers.filter((r) => !r.holds && r.minutes > slots.threshold);',
  'probe(allowed.length === 1 && passWithoutHour.length === 1 && hourWithoutPass.length === 1, "the case must be the pass-and-hour nest of this section");',
  'return "Only " + allowed[0].name + ". " + passWithoutHour[0].name + " has the pass but not the hour. " + hourWithoutPass[0].name + " has the hour without the pass. A nest is not a menu from which you pick one trigger.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The slip nests two conditions: holding the pass releases the inner conditional, and the inner conditional asks for a clock after the stated hour.`,
    `${solution.allowed} holds the pass and arrives after the hour, so both conjuncts hold and the drawer may be opened.`,
    `${solution.passWithoutHour} holds the pass but arrives before the hour, so the inner door stays shut.`,
    `${solution.hourWithoutPass} arrives after the hour without a pass, and the late clock is not a substitute for the pass.`
  ];
}

export const unit = 20;

export const cases = [
  {
    template: 'Nested conditionals',
    type: slugify('Nested conditionals'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
