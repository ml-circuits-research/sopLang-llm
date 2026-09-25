/**
 * Section 6 of the adult-reasoning course: letters, messages, and addressees.
 *
 * Every variant prints one message thread on the phone of the person who asked
 * for bread: an invitation to buy bread on the way, a volunteer who passes the
 * shop at a stated time, the asker's own withdrawal ("I'm not going out" then
 * "I'm not passing anywhere"), a conditional milk errand for the volunteer, the
 * volunteer's report that no milk under the limit was there, and a late order
 * not to buy milk at all. The verdict keeps the volunteer on the bread errand
 * after the asker withdraws, checks the milk condition against the report and
 * finds it false and the abstention correct, and dismisses the last order
 * because it arrived unread and, in any case, matched what was already done.
 * The cases change the phone owner, the two correspondents, the times, and the
 * milk limit, so the family derives the holder and every verdict from the
 * parsed thread.
 */

import { slugify } from '../../naming.mjs';

const PHONE_PATTERN = /Message thread, times on ([A-Z][a-z]+)’s phone:/;
const OPENING_PATTERN = /(\d{2}:\d{2}) ([A-Z][a-z]+): “Buy bread if you pass the shop\. I am not going out\.”/;
const RUNNER_PATTERN = /(\d{2}:\d{2}) ([A-Z][a-z]+): “I pass at (\d{2}:\d{2})\. I’ll take (\w+) loaves\.”/;
const WITHDRAWAL_PATTERN = /(\d{2}:\d{2}) ([A-Z][a-z]+): “I’m home\. I’m not passing anywhere\.”/;
const MILK_RULE_PATTERN =
  /(\d{2}:\d{2}) ([A-Z][a-z]+): “Then ([A-Z][a-z]+) also gets milk, but only if it is under (\d+)\. Otherwise not\.”/;
const MILK_REPORT_PATTERN = /(\d{2}:\d{2}) ([A-Z][a-z]+): “No milk under (\d+)\. I took only the loaves\.”/;
const STOP_PATTERN = /(\d{2}:\d{2}) ([A-Z][a-z]+): “Found milk in the fridge\. Don’t get any\.”/;
const WALK_PATTERN =
  /([A-Z][a-z]+) sent (\d{2}:\d{2}) from the car park, closed the phone, walked (\d+) minutes\. (\d{2}:\d{2}) was not read before arrival\./;

function parse(statement) {
  const phone = PHONE_PATTERN.exec(statement);
  const opening = OPENING_PATTERN.exec(statement);
  const runner = RUNNER_PATTERN.exec(statement);
  const withdrawal = WITHDRAWAL_PATTERN.exec(statement);
  const milkRule = MILK_RULE_PATTERN.exec(statement);
  const milkReport = MILK_REPORT_PATTERN.exec(statement);
  const stop = STOP_PATTERN.exec(statement);
  const walk = WALK_PATTERN.exec(statement);
  if (
    phone === null ||
    opening === null ||
    runner === null ||
    withdrawal === null ||
    milkRule === null ||
    milkReport === null ||
    stop === null ||
    walk === null
  ) {
    throw new Error('the statement does not print the message thread with its closing note');
  }
  const unreadTime = walk[4];
  if (unreadTime !== stop[1]) {
    throw new Error('the unread message is not the last message of the thread');
  }
  return {
    owner: phone[1],
    asker: opening[2],
    runner: runner[2],
    askTime: opening[1],
    runnerTime: runner[1],
    passesAt: runner[3],
    loaves: runner[4],
    ownerReplyTime: withdrawal[1],
    ownerWithdrew: true,
    milkRuleTime: milkRule[1],
    milkRunner: milkRule[3],
    milkLimit: Number(milkRule[4]),
    reportTime: milkReport[1],
    reportRunner: milkReport[2],
    shopFloor: Number(milkReport[3]),
    tookOnlyLoaves: /took only the loaves/.test(statement),
    stopTime: stop[1],
    stopSaysBuy: !/Don’t get any/.test(statement),
    sentTime: walk[2],
    walkMinutes: Number(walk[3]),
    unreadTime
  };
}

function solve(slots) {
  if (slots.milkRunner !== slots.runner || slots.reportRunner !== slots.runner) {
    throw new Error('the milk errand and its report do not belong to the volunteer who passes the shop');
  }
  if (slots.sentTime !== slots.reportTime) {
    throw new Error('the volunteer did not send the report from the car park as described');
  }
  const holder = slots.ownerWithdrew ? slots.runner : slots.owner;
  const holderClause = `${holder} stays on bread.`;
  const conditionMet = slots.shopFloor < slots.milkLimit;
  const boughtMilk = !slots.tookOnlyLoaves;
  const milkClause = conditionMet
    ? `Milk: the condition is true, so ${boughtMilk ? 'it was correctly bought' : 'it should have been bought'}.`
    : `Milk: the condition is false, so ${boughtMilk ? 'buying it broke the rule' : 'correctly not bought'}.`;
  const order = slots.stopSaysBuy ? 'buy' : 'don’t buy';
  const respected = boughtMilk === slots.stopSaysBuy;
  const stopClause = `${slots.unreadTime} was unread and, in any case, said “${order}” — ${respected ? 'already respected' : 'still open'}.`;
  return { holderClause, milkClause, stopClause };
}

function render(solution) {
  return `${solution.holderClause} ${solution.milkClause} ${solution.stopClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const holder = slots.ownerWithdrew ? slots.runner : slots.owner;',
  'const holderClause = holder + " stays on bread.";',
  'const conditionMet = slots.shopFloor < slots.milkLimit;',
  'const boughtMilk = !slots.tookOnlyLoaves;',
  'const milkClause = conditionMet',
  '  ? "Milk: the condition is true, so " + (boughtMilk ? "it was correctly bought" : "it should have been bought") + "."',
  '  : "Milk: the condition is false, so " + (boughtMilk ? "buying it broke the rule" : "correctly not bought") + ".";',
  'const order = slots.stopSaysBuy ? "buy" : "don’t buy";',
  'const respected = boughtMilk === slots.stopSaysBuy;',
  'const stopClause = slots.unreadTime + " was unread and, in any case, said “" + order + "” — " + (respected ? "already respected" : "still open") + ".";',
  'return holderClause + " " + milkClause + " " + stopClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `${slots.asker} asked for bread at ${slots.askTime} and said at ${slots.ownerReplyTime} that they were not passing anywhere, so the bread errand the volunteer accepted at ${slots.runnerTime} stays with ${slots.runner}.`,
    `The milk rule of ${slots.milkRuleTime} was conditional on a price under ${slots.milkLimit}, and the ${slots.reportTime} report found nothing below ${slots.shopFloor}, so the condition was false and taking only the ${slots.loaves} loaves respected it.`,
    `${slots.runner} sent the report at ${slots.sentTime} from the car park, closed the phone, and walked ${slots.walkMinutes} minutes, so the ${slots.stopTime} order was never read.`,
    `That order, in any case, forbade the milk the volunteer had not bought, so there was nothing left to undo.`
  ];
}

export const unit = 6;

export const cases = [
  {
    template: 'Letters, messages, and addressees',
    type: slugify('Letters, messages, and addressees'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
