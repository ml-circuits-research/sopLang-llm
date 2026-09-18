/**
 * Section 74 of the adult-reasoning course: personal data in terms of use.
 *
 * Every variant prints the same recipe-app terms: the email list carries news
 * and can be switched off in Account, the list is never sold, view history is
 * kept for a fixed number of months and then deleted, and uploaded photos
 * stay public while they are in the app. One named person then believes the
 * single off-switch makes the photos private and wipes the history at once.
 * The verdict separates what the switch does — it stops the news — from the
 * clauses it leaves untouched. The variants change the reader’s name, so the
 * family derives the clauses from the parsed terms and belief.
 */

import { slugify } from '../../naming.mjs';

const TERMS_PATTERN =
  /Recipe-app terms: email for news; news can be turned off in Account; the email list is not sold; view history is kept (\d+) months then deleted; photos you upload stay public while they are in the app\./;
const BELIEF_PATTERN = /\n([A-Z][a-z]+) thinks turning off news makes photos private and deletes history at once\./;

function parse(statement) {
  const terms = TERMS_PATTERN.exec(statement);
  const belief = BELIEF_PATTERN.exec(statement);
  if (terms === null || belief === null) {
    throw new Error('the statement does not describe the recipe-app terms and one reader’s belief about the switch');
  }
  return {
    name: belief[1],
    retentionMonths: Number(terms[1]),
    newsSwitchInAccount: true,
    emailListNotSold: true,
    photosPublicWhileInApp: true,
    beliefPhotosPrivate: true,
    beliefHistoryDeletedAtOnce: true
  };
}

function solve(slots) {
  if (!slots.newsSwitchInAccount) {
    throw new Error('the terms do not place the news switch in Account');
  }
  if (!slots.photosPublicWhileInApp || !slots.beliefPhotosPrivate) {
    throw new Error('the terms and the belief do not disagree about the photos in the way this section describes');
  }
  if (!slots.beliefHistoryDeletedAtOnce || !(slots.retentionMonths > 0)) {
    throw new Error('the terms do not state a retention period the belief can contradict');
  }
  const switchClause = 'It stops news.';
  const photoClause = 'It does not change photos.';
  const historyClause = `It does not delete history before ${slots.retentionMonths} months.`;
  return { switchClause, photoClause, historyClause };
}

function render(solution) {
  return `${solution.switchClause} ${solution.photoClause} ${solution.historyClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.name === "string" && slots.name.length > 0, "the case must attribute the belief to a named reader");',
  'probe(Number.isInteger(slots.retentionMonths) && slots.retentionMonths > 0, "the terms must keep the history for a positive whole number of months");',
  'probe(slots.newsSwitchInAccount === true, "the terms must place the news switch in Account");',
  'probe(slots.emailListNotSold === true, "the terms must state that the email list is not sold");',
  'probe(slots.photosPublicWhileInApp === true, "the terms must state that uploaded photos stay public while they are in the app");',
  'probe(slots.beliefPhotosPrivate === true && slots.beliefHistoryDeletedAtOnce === true, "the reader must hold the two beliefs the terms contradict");',
  'const switchClause = "It stops news.";',
  'const photoClause = "It does not change photos.";',
  'const historyClause = "It does not delete history before " + slots.retentionMonths + " months.";',
  'return switchClause + " " + photoClause + " " + historyClause;'
].join('\n');

function explain(slots) {
  return [
    'The terms give the Account switch exactly one job: it turns off the news email, and nothing else in the terms is tied to it.',
    `Photos are governed by their own clause — they stay public while they are in the app — so ${slots.name}'s belief that the switch makes them private is not supported.`,
    `View history is kept ${slots.retentionMonths} months and only then deleted, so turning the news off cannot delete it at once.`,
    'The email list is not sold, which is a separate promise and does not change with the switch either.'
  ];
}

export const unit = 74;

export const cases = [
  {
    template: 'Personal data in terms of use',
    type: slugify('Personal data in terms of use'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
