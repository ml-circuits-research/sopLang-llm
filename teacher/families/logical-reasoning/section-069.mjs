/**
 * Section 69 of the logical-reasoning book: counting an overlap twice.
 *
 * Every case posts a hall list with two group counts, the number listed in
 * both groups, and the number listed in neither but in the building, and then
 * has three speakers: one adds the two groups and the outside people without
 * touching the overlap, one subtracts the overlap once, and one calls the
 * overlap a moral idea rather than a number. The case data changes the place,
 * the group names and the four counts; the reasoning is fixed: the union is
 * first plus second minus the overlap, plus the people outside both, and the
 * naive sum contains the overlap twice.
 */

import { slugify } from '../../naming.mjs';

const LIST_PATTERN =
  /Hall list in ([A-Z][a-z]+(?: [A-Z][a-z]+)*): (\d+) people from ([a-z]+), (\d+) from ([a-z]+), (\d+) listed in both groups, (\d+) listed in neither but in the building\./;
const NAIVE_PATTERN = /([A-Z][a-z]+) says attendance is (\d+)\+(\d+)\+(\d+) = (\d+)\./;
const OVERLAP_PATTERN =
  /([A-Z][a-z]+) says the (\d+) in both were counted twice in that sum and must be subtracted once: (\d+)\+(\d+)[−-](\d+)\+(\d+) = (\d+)\./;
const MORAL_PATTERN = /([A-Z][a-z]+) says overlap is a moral idea, not a number\./;

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function parse(statement) {
  const list = LIST_PATTERN.exec(statement);
  if (list === null) {
    throw new Error('the statement does not post the hall list with its two groups, its overlap, and its people outside both');
  }
  const naive = NAIVE_PATTERN.exec(statement);
  if (naive === null) {
    throw new Error('the statement does not record the speaker who adds the groups without the overlap');
  }
  const overlap = OVERLAP_PATTERN.exec(statement);
  if (overlap === null) {
    throw new Error('the statement does not record the speaker who subtracts the overlap once');
  }
  const moral = MORAL_PATTERN.exec(statement);
  if (moral === null) {
    throw new Error('the statement does not record the speaker who calls the overlap a moral idea');
  }
  return {
    place: list[1],
    firstGroup: list[3],
    firstCount: Number(list[2]),
    secondGroup: list[5],
    secondCount: Number(list[4]),
    bothCount: Number(list[6]),
    neitherCount: Number(list[7]),
    naiveClaimant: naive[1],
    naiveSum: Number(naive[5]),
    overlapClaimant: overlap[1],
    correction: {
      bothCount: Number(overlap[2]),
      firstCount: Number(overlap[3]),
      secondCount: Number(overlap[4]),
      subtracted: Number(overlap[5]),
      neitherCount: Number(overlap[6]),
      total: Number(overlap[7])
    },
    moralClaimant: moral[1]
  };
}

function solve(slots) {
  const { firstCount, secondCount, bothCount, neitherCount, correction } = slots;
  if (firstCount <= 0 || secondCount <= 0) {
    throw new Error('the two group counts must be positive');
  }
  if (neitherCount < 0 || bothCount < 0) {
    throw new Error('an overlap and a count outside both cannot be negative');
  }
  if (bothCount > Math.min(firstCount, secondCount)) {
    throw new Error('the people in both groups cannot exceed either group');
  }
  if (
    correction.firstCount !== firstCount ||
    correction.secondCount !== secondCount ||
    correction.subtracted !== bothCount ||
    correction.neitherCount !== neitherCount
  ) {
    throw new Error('the correction sentence must subtract the listed overlap from the listed group counts');
  }
  const union = firstCount + secondCount - bothCount + neitherCount;
  if (correction.total !== union) {
    throw new Error('the correction sentence states a total that the listed counts do not produce');
  }
  if (slots.naiveSum !== firstCount + secondCount + neitherCount) {
    throw new Error('the naive sum must add the two group counts and the people outside both');
  }
  if (slots.naiveSum - union !== bothCount) {
    throw new Error('the naive sum must exceed the union by exactly the double-counted overlap');
  }
  const speakers = new Set([slots.naiveClaimant, slots.overlapClaimant, slots.moralClaimant]);
  if (speakers.size !== 3) {
    throw new Error('the three readings of the list must come from three different speakers');
  }
  return {
    place: slots.place,
    firstGroup: slots.firstGroup,
    secondGroup: slots.secondGroup,
    union,
    naiveSum: slots.naiveSum,
    bothCount,
    neitherCount,
    overlapClaimant: slots.overlapClaimant,
    moralClaimant: slots.moralClaimant
  };
}

function render(solution) {
  return `${solution.union}. ${capitalize(solution.firstGroup)} plus ${solution.secondGroup} counts the overlap twice unless you subtract it once.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);',
  'const union = slots.firstCount + slots.secondCount - slots.bothCount + slots.neitherCount;',
  'return union + ". " + capitalize(slots.firstGroup) + " plus " + slots.secondGroup + " counts the overlap twice unless you subtract it once.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The list in ${slots.place} names ${slots.firstCount} people in ${slots.firstGroup}, ${slots.secondCount} in ${slots.secondGroup}, ${slots.bothCount} in both, and ${slots.neitherCount} in neither but in the building.`,
    `Adding the two groups already counts the ${slots.bothCount} people in both twice, so the union is ${slots.firstCount} + ${slots.secondCount} − ${slots.bothCount} + ${slots.neitherCount} = ${solution.union}.`,
    `${solution.overlapClaimant} states that correction, while the speaker who reaches ${slots.naiveSum} leaves the overlap counted twice.`,
    `${solution.moralClaimant} preaches about the overlap; the overlap is a number to subtract once.`
  ];
}

export const unit = 69;

export const cases = [
  {
    template: 'Counting twice',
    type: slugify('Counting twice'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
