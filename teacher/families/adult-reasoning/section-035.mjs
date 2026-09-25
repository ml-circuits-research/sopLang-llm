/**
 * Section 35 of the adult-reasoning course: indoor temperature and insulation.
 *
 * Every variant quotes one ward's winter guide: an inner wall more than 4 °C
 * colder than mid-room is a cold wall, airing is 5 minutes with a wide window
 * and the radiator off (not a 3-hour tilt), the target humidity is 40–60%,
 * and 70% together with a cold wall is a condensation risk. The room then
 * states its mid and wall temperatures, its humidity, and how the window was
 * aired, and the verdict reads off the signs and the wrong act. The variants
 * change the ward and the person's name, so the family derives the difference,
 * the risk, and the broken act from the parsed values.
 */

import { slugify } from '../../naming.mjs';

const GUIDE_PATTERN = /Winter guide, ([^:\n]+):/;
const COLD_WALL_PATTERN = /inner wall is >(\d+) °C colder than mid-room/;
const AIRING_PATTERN = /Airing: (\d+) min wide window, radiator off, then on again\. Not tilted (\d+) h\./;
const HUMIDITY_PATTERN = /Target humidity (\d+)–(\d+)%\. (\d+)% \+ cold wall = condensation risk/;
const ROOM_PATTERN =
  /([A-Z][a-z]+)’s room: (-?\d+) °C mid, (-?\d+) °C wall, (\d+)% humidity, window tilted (\d+) h with the radiator (on|off)\./;

function parse(statement) {
  const guide = GUIDE_PATTERN.exec(statement);
  const coldWall = COLD_WALL_PATTERN.exec(statement);
  const airing = AIRING_PATTERN.exec(statement);
  const humidity = HUMIDITY_PATTERN.exec(statement);
  const room = ROOM_PATTERN.exec(statement);
  if (guide === null || coldWall === null || airing === null || humidity === null || room === null) {
    throw new Error('the statement does not carry the guide and the room readings');
  }
  return {
    place: guide[1].trim(),
    coldWallDrop: Number(coldWall[1]),
    airingMinutes: Number(airing[1]),
    tiltLimit: Number(airing[2]),
    humidityLow: Number(humidity[1]),
    humidityHigh: Number(humidity[2]),
    riskHumidity: Number(humidity[3]),
    name: room[1],
    midTemperature: Number(room[2]),
    wallTemperature: Number(room[3]),
    humidityPercent: Number(room[4]),
    tiltHours: Number(room[5]),
    radiatorOn: room[6] === 'on'
  };
}

/**
 * The guide's numbers decide the three clauses: the temperature difference
 * against the cold-wall threshold, the humidity against the risk line, and the
 * airing against the 5-minute wide-window gesture.
 */
function solve(slots) {
  const drop = slots.midTemperature - slots.wallTemperature;
  const coldWall = drop > slots.coldWallDrop;
  const tempClause = coldWall
    ? `${slots.midTemperature}−${slots.wallTemperature}=${drop}>${slots.coldWallDrop} cold wall`
    : `${slots.midTemperature}−${slots.wallTemperature}=${drop}≤${slots.coldWallDrop} no cold wall`;
  let humidityClause;
  if (coldWall && slots.humidityPercent >= slots.riskHumidity) {
    humidityClause = `${slots.humidityPercent}% + cold wall = condensation risk`;
  } else if (slots.humidityPercent > slots.humidityHigh) {
    humidityClause = `${slots.humidityPercent}% is above the ${slots.humidityLow}–${slots.humidityHigh}% target`;
  } else if (slots.humidityPercent < slots.humidityLow) {
    humidityClause = `${slots.humidityPercent}% is below the ${slots.humidityLow}–${slots.humidityHigh}% target`;
  } else {
    humidityClause = `${slots.humidityPercent}% is inside the ${slots.humidityLow}–${slots.humidityHigh}% target`;
  }
  let actClause;
  if (slots.tiltHours >= slots.tiltLimit) {
    actClause = `Long tilt breaks the ${slots.airingMinutes}-minute airing.`;
  } else if (slots.radiatorOn) {
    actClause = 'The radiator must be off during the airing.';
  } else {
    actClause = `A wide ${slots.airingMinutes}-minute airing with the radiator off is the gesture.`;
  }
  return { tempClause, humidityClause, actClause };
}

function render(solution) {
  return `${solution.tempClause}; ${solution.humidityClause}. ${solution.actClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const drop = slots.midTemperature - slots.wallTemperature;',
  'const coldWall = drop > slots.coldWallDrop;',
  'const tempClause = coldWall',
  '  ? slots.midTemperature + "−" + slots.wallTemperature + "=" + drop + ">" + slots.coldWallDrop + " cold wall"',
  '  : slots.midTemperature + "−" + slots.wallTemperature + "=" + drop + "≤" + slots.coldWallDrop + " no cold wall";',
  'let humidityClause;',
  'if (coldWall && slots.humidityPercent >= slots.riskHumidity) {',
  '  humidityClause = slots.humidityPercent + "% + cold wall = condensation risk";',
  '} else if (slots.humidityPercent > slots.humidityHigh) {',
  '  humidityClause = slots.humidityPercent + "% is above the " + slots.humidityLow + "–" + slots.humidityHigh + "% target";',
  '} else if (slots.humidityPercent < slots.humidityLow) {',
  '  humidityClause = slots.humidityPercent + "% is below the " + slots.humidityLow + "–" + slots.humidityHigh + "% target";',
  '} else {',
  '  humidityClause = slots.humidityPercent + "% is inside the " + slots.humidityLow + "–" + slots.humidityHigh + "% target";',
  '}',
  'let actClause;',
  'if (slots.tiltHours >= slots.tiltLimit) {',
  '  actClause = "Long tilt breaks the " + slots.airingMinutes + "-minute airing.";',
  '} else if (slots.radiatorOn) {',
  '  actClause = "The radiator must be off during the airing.";',
  '} else {',
  '  actClause = "A wide " + slots.airingMinutes + "-minute airing with the radiator off is the gesture.";',
  '}',
  'const answer = tempClause + "; " + humidityClause + ". " + actClause;',
  'return answer;'
].join('\n');

function explain(slots, solution) {
  return [
    `The guide turns a comparison into a sign: mid-room ${slots.midTemperature} °C against wall ${slots.wallTemperature} °C is a drop of ${slots.midTemperature - slots.wallTemperature} °C, more than the stated ${slots.coldWallDrop} °C, so the room has a cold wall.`,
    `${slots.name}'s humidity is ${slots.humidityPercent}%, and the guide pairs that level with a cold wall as a condensation risk rather than diagnosing anything.`,
    `The guide's airing is ${slots.airingMinutes} minutes with a wide window and the radiator off, so a ${slots.tiltHours}-hour tilt with the radiator on breaks that gesture and leaves the sign standing.`
  ];
}

export const unit = 35;

export const cases = [
  {
    template: 'Indoor temperature and insulation',
    type: slugify('Indoor temperature and insulation'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
