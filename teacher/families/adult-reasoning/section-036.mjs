/**
 * Section 36 of the adult-reasoning course: houseplants and the garden.
 *
 * Every variant quotes the plant card, which orders watering by the top-2-cm
 * test rather than the calendar, tolerates a 10–14-day winter interval as
 * typical only, asks for east or west light instead of midday sun, and forbids
 * leaving water in the saucer for more than 30 minutes. The person's practice
 * then states a calendar day, the soil depth that is wet, the water standing
 * in the saucer, and the light, and the verdict lists what goes against the
 * card. The variants change the person's name, so the family reads the card
 * and the practice from the statement.
 */

import { slugify } from '../../naming.mjs';

const CARD_PATTERN = /Water when the top (\d+) cm are dry, not by calendar\./;
const TYPICAL_PATTERN = /In winter (\d+)–(\d+) days is typical, but the test decides\./;
const LIGHT_PATTERN = /Light ([a-z/]+), not midday sun\./;
const SAUCER_PATTERN = /Saucer without water over (\d+) min\./;
const PRACTICE_PATTERN =
  /([A-Z][a-z]+) waters “([^”]+)”, soil (wet|dry) at (\d+) cm, saucer with ([^,]+), ([^.]+)\./;

function parse(statement) {
  const card = CARD_PATTERN.exec(statement);
  const typical = TYPICAL_PATTERN.exec(statement);
  const light = LIGHT_PATTERN.exec(statement);
  const saucer = SAUCER_PATTERN.exec(statement);
  const practice = PRACTICE_PATTERN.exec(statement);
  if (card === null || typical === null || light === null || saucer === null || practice === null) {
    throw new Error('the statement does not carry the plant card and the watering practice');
  }
  return {
    name: practice[1],
    schedule: practice[2],
    soilWet: practice[3] === 'wet',
    soilDepth: Number(practice[4]),
    saucerContents: practice[5].trim(),
    lightNow: practice[6].trim(),
    depthRule: Number(card[1]),
    typicalDays: { low: Number(typical[1]), high: Number(typical[2]) },
    allowedLight: light[1],
    saucerLimitMinutes: Number(saucer[1])
  };
}

/**
 * The card settles what is wrong: watering by a calendar when the top layer is
 * still wet ignores the test, water left standing in the saucer breaks the
 * half-hour limit, and midday sun is the light the card excludes.
 */
function solve(slots) {
  const calendarClause = slots.soilWet
    ? `Waters by calendar although ${slots.soilDepth} cm are wet`
    : `Waters by calendar, and the top ${slots.soilDepth} cm are dry`;
  const saucerClause = /water/i.test(slots.saucerContents)
    ? 'water hours in the saucer'
    : 'the saucer is already empty';
  const lightClause = /midday sun/i.test(slots.lightNow)
    ? 'midday sun'
    : `the light is ${slots.allowedLight}`;
  return { calendarClause, saucerClause, lightClause };
}

function render(solution) {
  return `${solution.calendarClause}; ${solution.saucerClause}; ${solution.lightClause}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.name === "string" && slots.name.length > 0, "the case must name the person who waters the plant");',
  'probe(typeof slots.schedule === "string" && slots.schedule.length > 0, "the case must state the watering calendar");',
  'probe(Number.isInteger(slots.depthRule) && slots.depthRule > 0, "the card must test a positive whole number of centimetres");',
  'probe(Number.isInteger(slots.soilDepth) && slots.soilDepth > 0, "the practice must report a positive whole number of centimetres");',
  'probe(slots.typicalDays.low > 0 && slots.typicalDays.high > slots.typicalDays.low, "the card must give an increasing typical winter interval");',
  'probe(typeof slots.allowedLight === "string" && slots.allowedLight.length > 0, "the card must state the allowed light");',
  'probe(Number.isInteger(slots.saucerLimitMinutes) && slots.saucerLimitMinutes > 0, "the card must limit the water in the saucer to a positive number of minutes");',
  'probe(slots.soilWet === true, "the printed practice must leave the top layer wet");',
  'const calendarClause = slots.soilWet',
  '  ? "Waters by calendar although " + slots.soilDepth + " cm are wet"',
  '  : "Waters by calendar, and the top " + slots.soilDepth + " cm are dry";',
  'const saucerClause = /water/i.test(slots.saucerContents)',
  '  ? "water hours in the saucer"',
  '  : "the saucer is already empty";',
  'probe(typeof slots.saucerContents === "string" && slots.saucerContents.length > 0, "the case must describe what stands in the saucer");',
  'const lightClause = /midday sun/i.test(slots.lightNow)',
  '  ? "midday sun"',
  '  : "the light is " + slots.allowedLight;',
  'probe(slots.lightNow.length > 0, "the case must describe the light the plant receives");',
  'return calendarClause + "; " + saucerClause + "; " + lightClause + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card makes the top ${slots.depthRule} cm the test, so a fixed “${slots.schedule}” is wrong when the soil is still wet at ${slots.soilDepth} cm; the 10–14-day winter interval is only typical.`,
    `Water standing in the saucer, here “${slots.saucerContents}”, breaks the card's ${slots.saucerLimitMinutes}-minute limit, and ${slots.lightNow} is the light the card excludes in favour of ${slots.allowedLight}.`,
    'The calendar is the habit, the test is the rule, and the card writes that hierarchy, so all three listed acts go against it.'
  ];
}

export const unit = 36;

export const cases = [
  {
    template: 'Houseplants and the garden',
    type: slugify('Houseplants and the garden'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
