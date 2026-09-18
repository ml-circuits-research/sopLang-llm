/**
 * Section 67 of the adult-reasoning course: timelines and chained causes.
 *
 * Every variant posts the same kitchen account: the oven goes on, a new tray
 * goes in, smoke appears because an old forgotten tray on top had fat, the
 * alarm sounds only afterwards, and the new tray comes out raw. A neighbour
 * inverts the chain with two claims ("the alarm made the smoke", "the new tray
 * burned"). The verdict reads the timeline forwards: the old tray caused the
 * smoke, the smoke triggered the alarm, the new tray is raw, and the alarm
 * produces no smoke. The cases change the cook's name and the clock times, so
 * the family derives the order and the clauses from the parsed values.
 */

import { slugify } from '../../naming.mjs';

const TIMELINE_PATTERN =
  /“([0-9]{1,2}:[0-9]{2}) ([A-Z][a-z]+) turns the oven on\. ([0-9]{1,2}:[0-9]{2}) puts in a new tray\. ([0-9]{1,2}:[0-9]{2}) smoke alarm: an old tray ([a-z][^.]*) had ([a-z]+)\. The alarm starts (AFTER|BEFORE) smoke\. ([0-9]{1,2}:[0-9]{2}) takes out the new tray, (raw|burnt)\./;
const RIVAL_PATTERN =
  /Neighbour: “The alarm made the smoke” and “the new tray burned”\./;

function minutesOf(time) {
  const [hours, minutes] = time.split(':');
  return Number(hours) * 60 + Number(minutes);
}

function parse(statement) {
  const timeline = TIMELINE_PATTERN.exec(statement);
  if (timeline === null || !RIVAL_PATTERN.test(statement)) {
    throw new Error('the statement does not describe the kitchen account and the neighbour claims');
  }
  return {
    cook: timeline[2],
    ovenOn: timeline[1],
    trayIn: timeline[3],
    alarmAt: timeline[4],
    outAt: timeline[8],
    oldTrayCondition: timeline[5],
    oldTrayFat: timeline[6] === 'fat',
    alarmAfterSmoke: timeline[7] === 'AFTER',
    newTrayRaw: timeline[9] === 'raw',
    rivalAlarmClaim: /The alarm made the smoke/.test(statement),
    rivalBurnClaim: /the new tray burned/.test(statement)
  };
}

function solve(slots) {
  const times = [slots.ovenOn, slots.trayIn, slots.alarmAt, slots.outAt].map(minutesOf);
  const ordered = times[0] <= times[1] && times[1] < times[2] && times[2] <= times[3];
  if (!ordered || !slots.oldTrayFat || !slots.alarmAfterSmoke) {
    throw new Error('the account does not follow the fat-on-the-old-tray, smoke-before-the-alarm pattern');
  }
  const orderClause = `${slots.oldTrayFat ? 'Old tray' : 'Burning tray'} → smoke → alarm.`;
  const trayClause = slots.newTrayRaw
    ? 'The new tray is raw, not burned.'
    : 'The new tray is burned.';
  const alarmClause = slots.rivalAlarmClaim && slots.rivalBurnClaim
    ? 'The alarm does not produce smoke.'
    : 'The alarm is the cause of the smoke.';
  return { orderClause, trayClause, alarmClause };
}

function render(solution) {
  return `${solution.orderClause} ${solution.trayClause} ${solution.alarmClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.cook === "string" && slots.cook.length > 0, "the account must name the person who turns the oven on");',
  'probe(typeof slots.oldTrayCondition === "string" && slots.oldTrayCondition.length > 0, "the account must describe the old tray forgotten on top");',
  'const timeShape = /^[0-9]{1,2}:[0-9]{2}$/;',
  'probe(timeShape.test(slots.ovenOn) && timeShape.test(slots.trayIn) && timeShape.test(slots.alarmAt) && timeShape.test(slots.outAt), "the account must print whole clock times");',
  'const minutesOf = (time) => { const parts = time.split(":"); return Number(parts[0]) * 60 + Number(parts[1]); };',
  'const times = [slots.ovenOn, slots.trayIn, slots.alarmAt, slots.outAt].map(minutesOf);',
  'probe(times[0] <= times[1] && times[1] < times[2] && times[2] <= times[3], "the oven, the new tray, the alarm and the removal must be in that order");',
  'probe(slots.oldTrayFat === true, "the old tray forgotten on top must be the one that had fat");',
  'probe(slots.alarmAfterSmoke === true, "the account must place the alarm after the smoke");',
  'probe(slots.newTrayRaw === true, "the new tray must come out raw");',
  'const orderClause = (slots.oldTrayFat ? "Old tray" : "Burning tray") + " → smoke → alarm.";',
  'const trayClause = slots.newTrayRaw ? "The new tray is raw, not burned." : "The new tray is burned.";',
  'const alarmClause = slots.rivalAlarmClaim && slots.rivalBurnClaim ? "The alarm does not produce smoke." : "The alarm is the cause of the smoke.";',
  'return orderClause + " " + trayClause + " " + alarmClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `The account runs ${slots.ovenOn} (oven on), ${slots.trayIn} (new tray in), ${slots.alarmAt} (smoke alarm) and ${slots.outAt} (new tray out), so the smoke and the alarm are separated in time and the alarm comes second.`,
    `The old tray ${slots.oldTrayCondition} had fat, and the fat in the hot oven is what produced the smoke, so the chain runs old tray → smoke → alarm.`,
    `The new tray came out raw, which contradicts the neighbour's claim that it burned, and it went in only after the oven was already on.`,
    'The alarm is a detector: it reacts to smoke, so it does not produce smoke, and none of the two neighbour claims matches the account.'
  ];
}

export const unit = 67;

export const cases = [
  {
    template: 'Timelines and chained causes',
    type: slugify('Timelines and chained causes'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
