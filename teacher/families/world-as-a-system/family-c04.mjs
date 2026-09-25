/**
 * Family C4 of the world seed book: representation and seats.
 *
 * Every problem states the populations of three districts (usually named A, B,
 * and C), a number of seats to share, and the apportionment method: compute each
 * exact quota `population / total x seats`, give each district the whole-number
 * part (the floor), and hand the leftover seats to the districts with the
 * largest fractional remainders. The family implements exactly that method and
 * prints the final allocation per district.
 *
 * The tie rule the source uses, visible when two fractions are equal, is the one
 * that reproduces its printed allocations: a larger remainder wins, and an equal
 * remainder goes to the district printed later. The remainder comparison is done
 * on exact whole numbers (`population x seats` modulo `total`) instead of on
 * rounded decimals, so an exact tie is recognized as a tie.
 *
 * The four grades share one computation; the variants differ only in the stated
 * populations and seat total, so their cases share the same parse, solve,
 * compute, and explain functions and declare only their own printed template.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const POPULATIONS_PATTERN = /populations ([^.]+)\./;
const DISTRICT_PATTERN = /([A-Z])=(\d+)/g;
const SEATS_PATTERN = /share (\d+) seats/;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const listed = POPULATIONS_PATTERN.exec(facts);
  const seats = SEATS_PATTERN.exec(facts);
  if (listed === null || seats === null) {
    throw new Error('the statement does not state the district populations and the seat total');
  }
  const districts = [];
  for (const match of listed[1].matchAll(DISTRICT_PATTERN)) {
    districts.push({ name: match[1], population: Number(match[2]) });
  }
  if (districts.length === 0) {
    throw new Error('the statement names no district population');
  }
  return {
    districts,
    seats: Number(seats[1]),
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function solve(slots) {
  const total = slots.districts.reduce((sum, district) => sum + district.population, 0);
  if (total <= 0) {
    throw new Error('the stated populations do not add up to a positive total');
  }
  const quotas = slots.districts.map((district) => {
    const scaled = district.population * slots.seats;
    return { name: district.name, seats: Math.floor(scaled / total), remainder: scaled % total };
  });
  const baseSum = quotas.reduce((sum, quota) => sum + quota.seats, 0);
  const remaining = slots.seats - baseSum;
  if (remaining < 0 || remaining >= quotas.length) {
    throw new Error('the whole-number parts do not leave fewer seats than there are districts');
  }
  const order = quotas
    .map((quota, index) => ({ index, remainder: quota.remainder }))
    .sort((left, right) => right.remainder - left.remainder || right.index - left.index);
  for (let assigned = 0; assigned < remaining; assigned += 1) {
    quotas[order[assigned].index].seats += 1;
  }
  const allocated = quotas.map((quota) => ({ name: quota.name, seats: quota.seats }));
  const summed = allocated.reduce((sum, quota) => sum + quota.seats, 0);
  if (summed !== slots.seats) {
    throw new Error('the final allocation does not sum to the available seats');
  }
  return { allocated, total, remaining, crossDomain: slots.crossDomain };
}

function render(solution) {
  const main = `${solution.allocated.map((quota) => `${quota.name}=${quota.seats}`).join(', ')} seats.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'const total = slots.districts.reduce((sum, district) => sum + district.population, 0);',
  'probe(total > 0, "the stated populations must add up to a positive total");',
  'const quotas = slots.districts.map((district) => { const scaled = district.population * slots.seats; return { name: district.name, seats: Math.floor(scaled / total), remainder: scaled % total }; });',
  'const remaining = slots.seats - quotas.reduce((sum, quota) => sum + quota.seats, 0);',
  'probe(remaining >= 0 && remaining < quotas.length, "the whole-number parts must leave fewer seats than there are districts");',
  'const order = quotas.map((quota, index) => ({ index, remainder: quota.remainder })).sort((left, right) => right.remainder - left.remainder || right.index - left.index);',
  'for (let assigned = 0; assigned < remaining; assigned += 1) { quotas[order[assigned].index].seats += 1; }',
  'probe(quotas.reduce((sum, quota) => sum + quota.seats, 0) === slots.seats, "the final allocation must sum to the available seats");',
  'const main = quotas.map((quota) => quota.name + "=" + quota.seats).join(", ") + " seats.";',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  const quotaText = slots.districts
    .map((district) => `${district.name}=${((district.population * slots.seats) / solution.total).toFixed(2)}`)
    .join(', ');
  return [
    `The stated populations add up to ${solution.total}, so each exact quota is the district population divided by that total and multiplied by ${slots.seats}: ${quotaText}.`,
    `Giving every district the whole-number part of its quota distributes all but ${solution.remaining} of the seats.`,
    'The leftover seats go to the largest fractional remainders; equal remainders go to the district printed later, which is the tie rule the printed allocations follow.',
    `The final allocation is ${solution.allocated.map((quota) => `${quota.name}=${quota.seats}`).join(', ')}, which sums to the ${slots.seats} available seats.`
  ];
}

function caseFor(grade) {
  const template = `Representation and seats (grade ${grade})`;
  return {
    template,
    type: slugify(template),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'C4';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
