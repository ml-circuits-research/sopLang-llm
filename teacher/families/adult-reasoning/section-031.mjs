/**
 * Section 31 of the adult-reasoning course: reading an energy bill line by line.
 *
 * Every variant is one bill: a consumption in kWh at a per-kWh rate, a standing
 * charge over a 30-day period, an environment levy, and the printed rule that
 * the total is energy plus standing plus levy, with 0.02 % per day of the total
 * after the 25th. The index readings confirm the consumption. The payer pays on
 * the 28th and believes the standing charge is a daily amount. The verdict
 * prints the on-time total to two decimals, the late penalty to four decimals,
 * and names the unit mistake. The variants change the person, the ward, the
 * consumption, the rate, and the standing charge; every figure is computed from
 * the parsed quantities in scaled integer arithmetic.
 */

import { slugify } from '../../naming.mjs';

const BILL_PATTERN =
  /Bill for ([A-Z][a-z]+), ([^:]+): use (\d+) kWh at ([\d.]+) per kWh\. Standing charge ([\d.]+) \/ (\d+) days \(not per day\)\. Environment levy ([\d.]+)\. Total = energy\+standing\+levy\. Old index (\d+), new (\d+)\. After the (\d+)(?:st|nd|rd|th): ([\d.]+)%\/day of the total\./;
const PAYMENT_PATTERN =
  /([A-Z][a-z]+) pays on the (\d+)(?:st|nd|rd|th) \((\d+) days? late\) and thinks the standing charge is ([\d.]+) per day\./;
const QUESTION_PATTERN = /Total on time, (\d+)-day penalty, unit mistake\?/;

function centsOf(amount) {
  return Math.round(Number(amount) * 100);
}

function parse(statement) {
  const bill = BILL_PATTERN.exec(statement);
  const payment = PAYMENT_PATTERN.exec(statement);
  const question = QUESTION_PATTERN.exec(statement);
  if (bill === null || payment === null || question === null) {
    throw new Error('the statement does not describe the bill and the payment');
  }
  return {
    person: bill[1],
    district: bill[2].trim(),
    useKwh: Number(bill[3]),
    rateCents: centsOf(bill[4]),
    standingCents: centsOf(bill[5]),
    standingDays: Number(bill[6]),
    levyCents: centsOf(bill[7]),
    oldIndex: Number(bill[8]),
    newIndex: Number(bill[9]),
    freeUntilDay: Number(bill[10]),
    dailyPenaltyPercentHundredths: centsOf(bill[11]),
    payer: payment[1],
    paidOnDay: Number(payment[2]),
    daysLate: Number(payment[3]),
    claimedStandingCents: centsOf(payment[4]),
    askedDaysLate: Number(question[1])
  };
}

function solve(slots) {
  if (slots.payer !== slots.person) {
    throw new Error('the payer in the episode is not the person the bill belongs to');
  }
  if (slots.newIndex - slots.oldIndex !== slots.useKwh) {
    throw new Error('the index readings do not confirm the billed consumption');
  }
  if (slots.standingDays !== 30) {
    throw new Error('the standing charge is not quoted over a 30-day period');
  }
  if (slots.daysLate !== slots.paidOnDay - slots.freeUntilDay) {
    throw new Error('the late days do not follow from the payment day and the free-until day');
  }
  const totalCents = slots.useKwh * slots.rateCents + slots.standingCents + slots.levyCents;
  const penaltyTenThousandths = Math.round(
    (totalCents * slots.daysLate * slots.dailyPenaltyPercentHundredths) / 100
  );
  return { totalCents, penaltyTenThousandths };
}

function money(cents) {
  return `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, '0')}`;
}

function penalty(tenthsOfTenThousandth) {
  return `${Math.floor(tenthsOfTenThousandth / 10000)}.${String(tenthsOfTenThousandth % 10000).padStart(4, '0')}`;
}

function render(solution) {
  return `Total ${money(solution.totalCents)}. Penalty ${penalty(solution.penaltyTenThousandths)}. The standing charge is monthly, not daily.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.person === "string" && slots.person.length > 0, "the statement must name the person the bill belongs to");',
  'probe(typeof slots.district === "string" && slots.district.length > 0, "the statement must name the ward or district");',
  'probe(Number.isInteger(slots.useKwh) && slots.useKwh > 0, "the billed consumption must be a positive whole number of kWh");',
  'probe(Number.isInteger(slots.rateCents) && slots.rateCents > 0, "the energy rate must be a positive amount");',
  'probe(Number.isInteger(slots.standingCents) && slots.standingCents > 0, "the standing charge must be a positive amount");',
  'probe(Number.isInteger(slots.levyCents) && slots.levyCents > 0, "the environment levy must be a positive amount");',
  'probe(slots.newIndex - slots.oldIndex === slots.useKwh, "the index readings must confirm the billed consumption");',
  'probe(slots.payer === slots.person, "the payer must be the person the bill belongs to");',
  'probe(slots.daysLate === slots.paidOnDay - slots.freeUntilDay, "the late days must follow from the payment day and the free-until day");',
  'probe(slots.askedDaysLate === slots.daysLate, "the question must ask about the late days the statement states");',
  'const totalCents = slots.useKwh * slots.rateCents + slots.standingCents + slots.levyCents;',
  'const penaltyTenThousandths = Math.round((totalCents * slots.daysLate * slots.dailyPenaltyPercentHundredths) / 100);',
  'const totalText = Math.floor(totalCents / 100) + "." + String(totalCents % 100).padStart(2, "0");',
  'const penaltyText = Math.floor(penaltyTenThousandths / 10000) + "." + String(penaltyTenThousandths % 10000).padStart(4, "0");',
  'return "Total " + totalText + ". Penalty " + penaltyText + ". The standing charge is monthly, not daily.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The bill for ${slots.person} in ${slots.district} charges ${slots.useKwh} kWh at ${money(slots.rateCents)} per kWh, which the index moving from ${slots.oldIndex} to ${slots.newIndex} confirms.`,
    `Energy ${money(slots.useKwh * slots.rateCents)} plus the standing charge ${money(slots.standingCents)} plus the levy ${money(slots.levyCents)} gives the on-time total ${money(solution.totalCents)}.`,
    `Paying on the ${slots.paidOnDay}th is ${slots.daysLate} days after the ${slots.freeUntilDay}th, so the penalty is ${slots.daysLate} days at ${slots.dailyPenaltyPercentHundredths / 100}% of the total, that is ${penalty(solution.penaltyTenThousandths)}.`,
    `The standing charge covers ${slots.standingDays} days, so it is a monthly amount and not the daily amount of ${money(slots.claimedStandingCents)} the payer assumes.`
  ];
}

export const unit = 31;

export const cases = [
  {
    template: 'Reading an energy bill line by line',
    type: slugify('Reading an energy bill line by line'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
