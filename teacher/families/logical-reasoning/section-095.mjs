/**
 * Section 95 of the logical-reasoning book: policy under uncertainty.
 *
 * Every case posts a fete in a named place with a forecast card that counts the
 * listed days like this one which had afternoon rain, the cost of wet
 * instruments, the cheapness of covers, and their reversibility, then three
 * readings of the cover decision. The case data changes the place, the rain and
 * dry counts, and the three names; the reasoning is fixed: the counted evidence
 * is separated from the policy, so precaution is neither a deduction of rain
 * nor a deduction of safety. The family reads the card and renders the printed
 * verdict with the counted support.
 */

import { slugify } from '../../naming.mjs';

const FORECAST_PATTERN =
  /^Fete in ([A-Z][a-z]+(?: [A-Z][a-z]+)*)\. Forecast card: (\d+) of (\d+) listed days like this had afternoon rain\. Wet instruments cost much; covers cost little; covers can come down\. ([A-Z][a-z]+) treats precaution as a proof that rain is probable today\. ([A-Z][a-z]+) treats precaution as a policy under thin-to-moderate support and uneven cost\. ([A-Z][a-z]+) treats (\d+) dry days in (\d+) as a proof of safety\./;

function parse(statement) {
  const forecast = FORECAST_PATTERN.exec(statement);
  if (forecast === null) {
    throw new Error('the statement does not record the forecast card and its three readings');
  }
  return {
    place: forecast[1],
    rainDays: Number(forecast[2]),
    listedDays: Number(forecast[3]),
    proofReader: forecast[4],
    policyReader: forecast[5],
    safetyReader: forecast[6],
    dryDays: Number(forecast[7]),
    dryListedDays: Number(forecast[8])
  };
}

function solve(slots) {
  if (slots.listedDays !== slots.dryListedDays) {
    throw new Error('the rain and dry counts must describe the same listed days');
  }
  if (slots.rainDays + slots.dryDays !== slots.listedDays) {
    throw new Error('the rain and dry counts must fill the listed days');
  }
  if (!(slots.rainDays > 0 && slots.rainDays < slots.listedDays)) {
    throw new Error('the card must give thin-to-moderate support, not certainty either way');
  }
  const readers = [slots.proofReader, slots.policyReader, slots.safetyReader];
  if (new Set(readers).size !== readers.length) {
    throw new Error('the three readings must come from three different people');
  }
  return {
    place: slots.place,
    rainDays: slots.rainDays,
    listedDays: slots.listedDays,
    dryDays: slots.dryDays,
    policyReader: slots.policyReader
  };
}

function render(solution) {
  return `Practical reasoning under uncertainty, not a deduction of doom and not a deduction of safety. Precaution is a policy. ${solution.rainDays} of ${solution.listedDays} is a climb.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'return "Practical reasoning under uncertainty, not a deduction of doom and not a deduction of safety. Precaution is a policy. " + slots.rainDays + " of " + slots.listedDays + " is a climb.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card at the fete in ${solution.place} counts ${solution.rainDays} of ${solution.listedDays} listed days like this one as rainy, which is a climb and not a proof.`,
    `${solution.policyReader} separates the evidence from the policy: with wet instruments costly, covers cheap, and covers reversible, hanging them is practical reasoning under uncertainty.`,
    `The proof reading wants precaution to mean rain is certain today, and the safety reading turns the ${solution.dryDays} dry days into a proof that rain cannot come; both confuse the family of the decision.`
  ];
}

export const unit = 95;

export const cases = [
  {
    template: 'Policy under uncertainty',
    type: slugify('Policy under uncertainty'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
