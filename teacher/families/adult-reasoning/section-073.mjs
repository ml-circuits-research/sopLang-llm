/**
 * Section 73 of the adult-reasoning course: passwords, sessions, and recovery.
 *
 * Every variant prints the same account guide — a minimum length with a
 * capital, a digit and a symbol, no reuse of the last three passwords, a
 * recovery question that is not findable on the public profile, sessions on a
 * shared computer closed when you leave, and an administrator who never asks
 * for the password by email — and then one named person who breaks several of
 * those rules at once. The verdict lists the broken rules in the guide’s
 * order and notes that the length and the capital/digit mix may still be fine.
 * The variants change the name, the password, and the details of the recovery
 * answer and the shared machine, so the family derives every clause from the
 * parsed record.
 */

import { slugify } from '../../naming.mjs';

const GUIDE_PATTERN = /Account guide: password ≥(\d+) characters, one capital, one digit, one symbol\./;
const RECORD_PATTERN =
  /\n([A-Z][a-z]+) sets “([^”]+)” \(([^)]+)\), reuses one of the last 3, recovery answer = ([^,]+), leaves the session at ([^,]+), replies to an email with the password\./;

function parse(statement) {
  const guide = GUIDE_PATTERN.exec(statement);
  const record = RECORD_PATTERN.exec(statement);
  if (guide === null || record === null) {
    throw new Error('the statement does not describe the password guide and one person following it');
  }
  const password = record[2];
  const qualifier = record[3];
  const recoveryAnswer = record[4];
  return {
    name: record[1],
    password,
    minLength: Number(guide[1]),
    hasSymbol: !/no symbol/i.test(qualifier) && /[^A-Za-z0-9]/.test(password),
    reusesOldPassword: true,
    recoveryOnPublicProfile: /profile/i.test(recoveryAnswer),
    recoveryAnswer,
    sessionPlace: record[5],
    sessionLeftOpen: true,
    emailedPassword: true
  };
}

function solve(slots) {
  const broken = [];
  if (!slots.hasSymbol) {
    broken.push('No symbol.');
  }
  if (slots.reusesOldPassword) {
    broken.push('Reuse.');
  }
  if (slots.recoveryOnPublicProfile) {
    broken.push('Public recovery.');
  }
  if (slots.sessionLeftOpen) {
    broken.push('Session left open.');
  }
  if (slots.emailedPassword) {
    broken.push('Email with the password.');
  }
  if (broken.length === 0) {
    throw new Error('the record breaks none of the printed rules');
  }
  const shortfalls = [];
  if (slots.password.length < slots.minLength) {
    shortfalls.push('short length');
  }
  if (!/[A-Z]/.test(slots.password)) {
    shortfalls.push('no capital');
  }
  if (!/[0-9]/.test(slots.password)) {
    shortfalls.push('no digit');
  }
  const qualityClause =
    shortfalls.length === 0
      ? 'Length and capital/digit may be fine.'
      : `Length and capital/digit break: ${shortfalls.join(', ')}.`;
  return { brokenClause: broken.join(' '), qualityClause };
}

function render(solution) {
  return `${solution.brokenClause} ${solution.qualityClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const broken = [];',
  'if (!slots.hasSymbol) { broken.push("No symbol."); }',
  'if (slots.reusesOldPassword) { broken.push("Reuse."); }',
  'if (slots.recoveryOnPublicProfile) { broken.push("Public recovery."); }',
  'if (slots.sessionLeftOpen) { broken.push("Session left open."); }',
  'if (slots.emailedPassword) { broken.push("Email with the password."); }',
  'const shortfalls = [];',
  'if (slots.password.length < slots.minLength) { shortfalls.push("short length"); }',
  'if (!/[A-Z]/.test(slots.password)) { shortfalls.push("no capital"); }',
  'if (!/[0-9]/.test(slots.password)) { shortfalls.push("no digit"); }',
  'const qualityClause = shortfalls.length === 0',
  '  ? "Length and capital/digit may be fine."',
  '  : "Length and capital/digit break: " + shortfalls.join(", ") + ".";',
  'return broken.join(" ") + " " + qualityClause;'
].join('\n');

function explain(slots) {
  return [
    `${slots.name} chooses “${slots.password}”, and the guide asks for at least ${slots.minLength} characters with a capital, a digit, and a symbol.`,
    'The password is long enough and mixes capitals with digits, but it carries no symbol and comes from the last three, so two rules fail together.',
    `The recovery answer is taken from ${slots.recoveryAnswer}, which the public profile shows, and the machine at ${slots.sessionPlace} keeps the session open after the visit.`,
    'The password is also sent back by email, and the guide states that an administrator never asks for the password that way.'
  ];
}

export const unit = 73;

export const cases = [
  {
    template: 'Passwords, sessions, and recovery',
    type: slugify('Passwords, sessions, and recovery'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
