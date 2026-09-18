/**
 * Section 78 of the adult-reasoning course: networks, bandwidth, and waiting.
 *
 * Every variant prints the same sheet (1 GB is about 8000 Mb, an exclusive
 * 8 Mb/s line moves 8000 Mb in 1000 s, about 16 min, eight users sharing that
 * line get 1 Mb/s each in the equal model, and 8 bits make a byte) and then
 * describes one person who reads the megabit rate as the same number of
 * gigabytes per second and starts five streams on the same line. The verdict
 * gives the exclusive duration and the equal-model slowdown. The variants
 * change the name, so the family derives the minutes and the slowdown from the
 * parsed rates.
 */

import { slugify } from '../../naming.mjs';

const SHEET_PATTERN =
  /1 GB ≈ (\d+) Mb\. At (\d+) Mb\/s exclusive: (\d+)\/(\d+) = (\d+) s ≈ (\d+) min\. (\d+) users sharing (\d+) Mb\/s have, in an equal model, (\d+) Mb\/s each\. (\d+) bits = 1 byte\./;
const READER_PATTERN =
  /^([A-Z][a-z]+) thinks (\d+) Mb\/s = (\d+) GB\/s and hits play instantly for (\d+) people on the same line\.$/m;
const PEOPLE_WORDS = Object.freeze({
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  10: 'Ten'
});

function parse(statement) {
  const sheet = SHEET_PATTERN.exec(statement);
  const reader = READER_PATTERN.exec(statement);
  if (sheet === null || reader === null) {
    throw new Error('the statement does not print the sheet and the person misreading the unit');
  }
  return {
    name: reader[1],
    gbInMb: Number(sheet[1]),
    rateMbps: Number(sheet[2]),
    workMb: Number(sheet[3]),
    workMbps: Number(sheet[4]),
    secondsShown: Number(sheet[5]),
    minutesShown: Number(sheet[6]),
    userCount: Number(sheet[7]),
    sharingMbps: Number(sheet[8]),
    perUserShown: Number(sheet[9]),
    bitsPerByte: Number(sheet[10]),
    believedGbRate: Number(reader[3]),
    instantUsers: Number(reader[4])
  };
}

function solve(slots) {
  if (slots.workMb !== slots.gbInMb || slots.workMbps !== slots.rateMbps || slots.sharingMbps !== slots.rateMbps) {
    throw new Error('the worked division does not use the sheet rates');
  }
  const seconds = slots.gbInMb / slots.rateMbps;
  if (seconds !== slots.secondsShown) {
    throw new Error('the sheet prints a quotient that the stated rate does not produce');
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes !== slots.minutesShown) {
    throw new Error('the sheet prints a minute count that the seconds do not produce');
  }
  const perUser = slots.rateMbps / slots.userCount;
  if (perUser !== slots.perUserShown) {
    throw new Error('the equal model must divide the rate by the number of sharers');
  }
  const slowFactor = slots.userCount / perUser;
  if (!Number.isInteger(slowFactor)) {
    throw new Error('the equal-model slowdown must be a whole multiple');
  }
  const peopleWord = PEOPLE_WORDS[slots.userCount];
  if (peopleWord === undefined) {
    throw new Error(`${slots.userCount} sharers have no printed word`);
  }
  return { minutes, perUser, slowFactor, peopleWord };
}

function render(solution) {
  return `One person: ~${solution.minutes} min/GB. ${solution.peopleWord} people: about ${solution.slowFactor} times slower.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.name === "string" && slots.name.length > 0, "the case must name the person who misreads the unit");',
  'probe(Number.isInteger(slots.gbInMb) && slots.gbInMb > 0, "the sheet states the megabit content of one gigabyte");',
  'probe(Number.isInteger(slots.rateMbps) && slots.rateMbps > 0, "the line rate must be a positive number of megabits per second");',
  'probe(slots.workMb === slots.gbInMb && slots.workMbps === slots.rateMbps && slots.sharingMbps === slots.rateMbps, "the worked division and the sharing model must use the sheet rate");',
  'const seconds = slots.gbInMb / slots.rateMbps;',
  'probe(Number.isInteger(seconds) && seconds === slots.secondsShown && seconds > 0, "the exclusive transfer takes the whole number of seconds the sheet prints");',
  'const minutes = Math.floor(seconds / 60);',
  'probe(minutes === slots.minutesShown && minutes > 0, "the printed minutes are the truncated quotient of the seconds");',
  'probe(Number.isInteger(slots.userCount) && slots.userCount > 1, "several users share the line");',
  'const perUser = slots.rateMbps / slots.userCount;',
  'probe(perUser === slots.perUserShown && perUser > 0, "the equal model divides the rate between the sharers");',
  'const slowFactor = slots.userCount / perUser;',
  'probe(Number.isInteger(slowFactor) && slowFactor === slots.userCount, "the slowdown equals the number of sharers");',
  'probe(Number.isInteger(slots.instantUsers) && slots.instantUsers > 0, "the stem states how many people start watching at once");',
  'probe(slots.believedGbRate === slots.rateMbps, "the case reads the megabit rate as the same number of gigabytes per second");',
  'const words = { 1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five", 6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten" };',
  'const peopleWord = words[slots.userCount];',
  'probe(typeof peopleWord === "string", "the number of sharers must have a printed word");',
  'return "One person: ~" + minutes + " min/GB. " + peopleWord + " people: about " + slowFactor + " times slower.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The sheet converts the unit first: ${slots.gbInMb} Mb at ${slots.rateMbps} Mb/s takes ${slots.secondsShown} s, which is about ${solution.minutes} min per gigabyte, because ${slots.bitsPerByte} bits make a byte and the rate is megabits, not megabytes.`,
    `${slots.name} treats ${slots.rateMbps} Mb/s as ${slots.believedGbRate} GB/s, so the instant start for ${slots.instantUsers} people cannot be right on the same line.`,
    `In the equal model the ${slots.rateMbps} Mb/s line gives ${solution.perUser} Mb/s to each of the ${slots.userCount} sharers, so each person waits about ${solution.slowFactor} times longer than alone.`
  ];
}

export const unit = 78;

export const cases = [
  {
    template: 'Networks, bandwidth, and waiting',
    type: slugify('Networks, bandwidth, and waiting'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
