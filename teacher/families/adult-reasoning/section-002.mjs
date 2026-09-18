/**
 * Section 2 of the adult-reasoning course: contracts and plain clauses.
 *
 * Every variant prints the same hire contract for an electric bicycle: nine
 * articles covering the object, the term, the price, the deposit, the late
 * return, the cancellation, the battery charge, the helmet, and the written
 * form of changes. The episode is the same as well: the renter brings the
 * bicycle back after the term, with an impact mark on the frame and a battery
 * below the charge the contract requires, demands the whole deposit in cash the
 * same day, and a staff member offers to overlook the scratch for a fee. The
 * verdict reads the contract literally: the late fee accrues for each calendar
 * day begun, the low battery keeps a fixed sum from the deposit, the impact
 * mark removes the duty to return the deposit in full, and a spoken offer
 * cannot amend the article that requires changes in writing. The cases change
 * the desk, the renter, the staff member, the term, the return day, and the
 * amounts, so the family derives every clause from the parsed articles.
 */

import { slugify } from '../../naming.mjs';

const HEADER_PATTERN =
  /Hire contract for an electric bicycle, a desk in ([^,]+), signed by ([A-Z][a-z]+):/;
const TERM_PATTERN = /Term: (\d+) calendar days from 10:00 on the day of signing\./;
const DEPOSIT_PATTERN =
  /Art\. (\d+)\. Deposit: (\d+), returned within (\d+) working days if handover is without missing parts and without impact marks on the frame\./;
const LATE_PATTERN = /Art\. (\d+)\. Late return: (\d+) for each calendar day begun\./;
const BATTERY_PATTERN =
  /Art\. (\d+)\. Battery must be handed back above (\d+)%; below (\d+)%, (\d+) is kept from the deposit\./;
const CHANGE_PATTERN = /Art\. (\d+)\. Changes only in writing, signed by both parties\./;
const RETURN_PATTERN =
  /Returns after (\d+) days with an (\d+) cm scratch on the frame and the battery at (\d+)%\./;
const STAFF_PATTERN = /([A-Z][a-z]+), a staff member, offers verbally to ignore the scratch/;

function parse(statement) {
  const header = HEADER_PATTERN.exec(statement);
  const term = TERM_PATTERN.exec(statement);
  const deposit = DEPOSIT_PATTERN.exec(statement);
  const late = LATE_PATTERN.exec(statement);
  const battery = BATTERY_PATTERN.exec(statement);
  const change = CHANGE_PATTERN.exec(statement);
  const returned = RETURN_PATTERN.exec(statement);
  const staff = STAFF_PATTERN.exec(statement);
  if (
    header === null ||
    term === null ||
    deposit === null ||
    late === null ||
    battery === null ||
    change === null ||
    returned === null ||
    staff === null
  ) {
    throw new Error('the statement does not print the bicycle contract and the return episode');
  }
  const termDays = Number(term[1]);
  const returnDays = Number(returned[1]);
  return {
    place: header[1].trim(),
    renter: header[2],
    staff: staff[1],
    termDays,
    returnDays,
    lateDays: returnDays - termDays,
    deposit: Number(deposit[2]),
    depositArticle: Number(deposit[1]),
    latePerDay: Number(late[2]),
    batteryLimit: Number(battery[2]),
    batteryKeep: Number(battery[4]),
    batteryPercent: Number(returned[3]),
    scratchCm: Number(returned[2]),
    changeArticle: Number(change[1])
  };
}

function solve(slots) {
  if (slots.lateDays <= 0) {
    throw new Error('the return falls inside the contracted term');
  }
  if (slots.scratchCm <= 0) {
    throw new Error('the statement does not describe an impact mark on the frame');
  }
  const lateTotal = slots.lateDays * slots.latePerDay;
  const lateClause = `Late fee ${slots.lateDays}×${slots.latePerDay}=${lateTotal}.`;
  const batteryClause =
    slots.batteryPercent < slots.batteryLimit
      ? `Battery ${slots.batteryPercent}%<${slots.batteryLimit}% → ${slots.batteryKeep} from the deposit.`
      : `Battery ${slots.batteryPercent}%≥${slots.batteryLimit}% → nothing kept from the deposit.`;
  const depositClause = `The scratch cancels the duty to return the deposit in full (Art. ${slots.depositArticle}).`;
  const speechClause = `Speech does not amend Art. ${slots.changeArticle}.`;
  const cashClause = 'Return is not “same day cash”.';
  return { lateClause, batteryClause, depositClause, speechClause, cashClause };
}

function render(solution) {
  return [
    solution.lateClause,
    solution.batteryClause,
    solution.depositClause,
    solution.speechClause,
    solution.cashClause
  ].join(' ');
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots === "object" && slots !== null, "the case must carry the parsed contract");',
  'probe(Number.isInteger(slots.termDays) && slots.termDays > 0, "the contracted term must be a whole number of days");',
  'probe(Number.isInteger(slots.lateDays) && slots.lateDays > 0, "the return must be after the contracted term");',
  'probe(Number.isInteger(slots.latePerDay) && slots.latePerDay > 0, "the late fee per calendar day must be positive");',
  'probe(Number.isInteger(slots.batteryPercent) && Number.isInteger(slots.batteryLimit), "the battery charge and its threshold must be whole percentages");',
  'probe(Number.isInteger(slots.depositArticle) && Number.isInteger(slots.changeArticle), "every clause must keep its article number");',
  'probe(slots.depositArticle !== slots.changeArticle, "the deposit clause and the written-changes clause must be different articles");',
  'probe(slots.renter !== slots.staff, "the renter and the staff member must be different people");',
  'const lateTotal = slots.lateDays * slots.latePerDay;',
  'const lateClause = "Late fee " + slots.lateDays + "×" + slots.latePerDay + "=" + lateTotal + ".";',
  'const batteryClause = slots.batteryPercent < slots.batteryLimit',
  '  ? "Battery " + slots.batteryPercent + "%<" + slots.batteryLimit + "% → " + slots.batteryKeep + " from the deposit."',
  '  : "Battery " + slots.batteryPercent + "%≥" + slots.batteryLimit + "% → nothing kept from the deposit.";',
  'const depositClause = "The scratch cancels the duty to return the deposit in full (Art. " + slots.depositArticle + ").";',
  'const speechClause = "Speech does not amend Art. " + slots.changeArticle + ".";',
  'const cashClause = "Return is not “same day cash”.";',
  'return [lateClause, batteryClause, depositClause, speechClause, cashClause].join(" ");'
].join('\n');

function explain(slots, solution) {
  return [
    `The contract runs for ${slots.termDays} calendar days and ${slots.renter} returned after ${slots.returnDays}, so ${slots.lateDays} calendar days were begun and Art. 5 charges ${slots.latePerDay} for each: ${solution.lateClause}`,
    `The battery came back at ${slots.batteryPercent}%, below the ${slots.batteryLimit}% that Art. 7 requires, so ${slots.batteryKeep} stays with the desk.`,
    `${slots.renter} keeps the ${slots.scratchCm} cm scratch, and an impact mark on the frame is exactly what removes the duty to return the deposit in full, so the demand for the whole deposit in cash the same day fails.`,
    `${slots.staff} spoke for the desk, but Art. ${slots.changeArticle} allows changes only in writing signed by both parties, so the offer has no force.`
  ];
}

export const unit = 2;

export const cases = [
  {
    template: 'Contracts and plain clauses',
    type: slugify('Contracts and plain clauses'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
