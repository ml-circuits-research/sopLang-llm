/**
 * Section 47 of the adult-reasoning course: appeal deadlines and petitions.
 *
 * Every variant posts the same petition guide at a town hall (written form,
 * name, address, signature; a reply within 30 calendar days of filing; a day
 * 30 that lands on a Sunday moves the deadline to the Monday after it; a filing
 * without a postal address is filed without reply; a chase before the deadline
 * does not reset the clock) and describes one filer who lodges a complete
 * petition on day 1 and then sends an address-less email to hurry the desk. The
 * verdict names the shifted reply deadline and repeats the guide's two clauses:
 * the email is filed away, and the clock keeps running. The cases vary the town
 * hall and the filer, so the deadline clause is built from the parsed reply
 * period and Sunday flag instead of being printed.
 */

import { slugify } from '../../naming.mjs';

const HALL_PATTERN = /Petition guide, town hall of ([^:]+): written, name, address, signature\./;
const REPLY_PATTERN = /Reply in (\d+) calendar days from filing\./;
const SUNDAY_RULE_PATTERN = /If day (\d+) is a Sunday → Monday\./;
const FILING_PATTERN =
  /([A-Z][a-z]+) files on ([A-Z][a-z]+) the (\d+)(?:st|nd|rd|th) \(filed day (\d+)\) a complete petition\./;
const SUNDAY_DAY_PATTERN = /Day (\d+) is a Sunday\./;
const CHASE_PATTERN = /On the (\d+)(?:st|nd|rd|th) sends an email with no postal address/;
const NO_ADDRESS_PATTERN = /No address → filed without reply\./;
const RESET_PATTERN = /A chase before the deadline does not reset the clock\./;

function parse(statement) {
  const hall = HALL_PATTERN.exec(statement);
  const reply = REPLY_PATTERN.exec(statement);
  const sundayRule = SUNDAY_RULE_PATTERN.exec(statement);
  const filing = FILING_PATTERN.exec(statement);
  const sundayDay = SUNDAY_DAY_PATTERN.exec(statement);
  const chase = CHASE_PATTERN.exec(statement);
  if (hall === null || reply === null || sundayRule === null || filing === null || sundayDay === null || chase === null) {
    throw new Error('the statement does not carry the petition guide and the filing narrative');
  }
  return {
    townHall: hall[1],
    filer: filing[1],
    filingWeekday: filing[2],
    filedDay: Number(filing[4]),
    replyDays: Number(reply[1]),
    dayThirtyIsSunday: Number(sundayDay[1]) === Number(reply[1]),
    chaseDay: Number(chase[1]),
    chaseHasAddress: !/email with no postal address/.test(statement),
    noReplyWithoutAddress: NO_ADDRESS_PATTERN.test(statement),
    chaseLeavesClock: RESET_PATTERN.test(statement)
  };
}

function ordinal(value) {
  const rest = value % 100;
  if (rest >= 11 && rest <= 13) {
    return `${value}th`;
  }
  const suffix = { 1: 'st', 2: 'nd', 3: 'rd' }[value % 10] ?? 'th';
  return `${value}${suffix}`;
}

function solve(slots) {
  if (slots.filedDay < 1 || slots.filedDay >= slots.replyDays) {
    throw new Error('the filing day must fall inside the reply period');
  }
  if (slots.chaseDay <= slots.filedDay) {
    throw new Error('the chase must arrive after the filing day');
  }
  const deadline = slots.dayThirtyIsSunday
    ? `Monday after Sunday the ${ordinal(slots.replyDays)}`
    : `day ${ordinal(slots.replyDays)} itself`;
  const fate = !slots.chaseHasAddress && slots.noReplyWithoutAddress
    ? 'The email is filed away'
    : 'The email is answered within the reply period';
  const clock = slots.chaseLeavesClock ? 'does not reset the clock' : 'restarts the clock';
  return { deadline, fate, clock };
}

function render(solution) {
  return `Deadline: ${solution.deadline}. ${solution.fate} and ${solution.clock}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.filer === "string" && slots.filer.length > 0, "the case must name the filer");',
  'probe(typeof slots.townHall === "string" && slots.townHall.length > 0, "the case must name the town hall");',
  'probe(Number.isInteger(slots.replyDays) && slots.replyDays > 0, "the reply period must be a whole number of days");',
  'probe(Number.isInteger(slots.filedDay) && slots.filedDay >= 1 && slots.filedDay < slots.replyDays, "the filing day must fall inside the reply period");',
  'probe(Number.isInteger(slots.chaseDay) && slots.chaseDay > slots.filedDay, "the chase must arrive after the filing day");',
  'probe(slots.noReplyWithoutAddress === true, "the guide must file an address-less petition without a reply");',
  'probe(slots.chaseLeavesClock === true, "the guide must state that a chase does not reset the clock");',
  'const ordinal = (value) => { const rest = value % 100; if (rest >= 11 && rest <= 13) { return value + "th"; } return value + ({ 1: "st", 2: "nd", 3: "rd" }[value % 10] || "th"); };',
  'const deadline = slots.dayThirtyIsSunday ? "Monday after Sunday the " + ordinal(slots.replyDays) : "day " + ordinal(slots.replyDays) + " itself";',
  'const fate = !slots.chaseHasAddress && slots.noReplyWithoutAddress',
  '  ? "The email is filed away"',
  '  : "The email is answered within the reply period";',
  'const clock = slots.chaseLeavesClock ? "does not reset the clock" : "restarts the clock";',
  'return "Deadline: " + deadline + ". " + fate + " and " + clock + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.filer} lodged a complete petition at the town hall of ${slots.townHall} on ${slots.filingWeekday} the ${slots.filedDay}, so the ${slots.replyDays}-day reply period runs from that filing and the Sunday on day ${slots.replyDays} moves the deadline to the Monday after it.`,
    `The guide files a petition that carries no postal address without a reply, and the email that reached the desk on day ${slots.chaseDay} has no address, so it is filed away.`,
    `Because chasing before the deadline does not reset the clock, the desk still answers within the ${slots.replyDays} days counted from filing, not from the email.`
  ];
}

export const unit = 47;

export const cases = [
  {
    template: 'Appeal deadlines and petitions',
    type: slugify('Appeal deadlines and petitions'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
