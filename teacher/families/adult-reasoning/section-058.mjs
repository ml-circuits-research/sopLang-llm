/**
 * Section 58 of the adult-reasoning course: Earth, moon, and length of day.
 *
 * Every variant quotes the same model sheet — the summer day is longer because
 * the axis is tilted, the Moon has no bulb of its own and reflects the Sun, and
 * at full moon the Earth sits roughly between Sun and Moon — and then reports
 * one person who explains the warmth by distance and gives the full moon a
 * bulb. The verdict replaces both claims with what the sheet states, and keeps
 * the sheet's ordering of the full-moon line. The cases change the place and
 * the name, so the family derives each clause from the parsed values.
 */

import { slugify } from '../../naming.mjs';

const SHEET_PATTERN =
  /The day is longer in summer in ([A-Z][a-z]+(?: [A-Z][a-z]+)*) than in winter because the axis is tilted\. The Moon has no bulb of its own: it reflects the Sun\. Full moon in the model: Earth roughly between Sun and Moon\./;
const CLAIM_PATTERN = /([A-Z][a-z]+): “([^”]+)” and “([^”]+)”\./;

function parse(statement) {
  const sheet = SHEET_PATTERN.exec(statement);
  const claim = CLAIM_PATTERN.exec(statement);
  if (sheet === null || claim === null) {
    throw new Error('the statement does not quote the model sheet and the two claims');
  }
  return {
    place: sheet[1],
    person: claim[1],
    distanceClaim: /closer/.test(claim[2]),
    bulbClaim: /bulb/.test(claim[3]),
    sheetAxis: /the axis is tilted/.test(statement),
    sheetReflection: /it reflects the Sun/.test(statement),
    sheetOrder: /Earth roughly between Sun and Moon/.test(statement)
  };
}

function solve(slots) {
  if (!slots.sheetAxis || !slots.sheetReflection || !slots.sheetOrder) {
    throw new Error('the sheet does not state the tilt, the reflection, and the full-moon order');
  }
  const axisClause = slots.distanceClaim
    ? 'Tilt of the axis (distance is not an ingredient of this model).'
    : 'Tilt of the axis.';
  const moonClause = slots.bulbClaim ? 'Reflection, not a bulb.' : 'Reflection of the Sun.';
  return { axisClause, moonClause, orderClause: 'Sun–Earth–Moon line.' };
}

function render(solution) {
  return `${solution.axisClause} ${solution.moonClause} ${solution.orderClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const axisClause = slots.distanceClaim',
  '  ? "Tilt of the axis (distance is not an ingredient of this model)."',
  '  : "Tilt of the axis.";',
  'const moonClause = slots.bulbClaim ? "Reflection, not a bulb." : "Reflection of the Sun.";',
  'const orderClause = "Sun–Earth–Moon line.";',
  'return axisClause + " " + moonClause + " " + orderClause;'
].join('\n');

function explain(slots, solution) {
  return [
    `The sheet explains the longer summer day in ${slots.place} by the tilt of the axis, and it never treats the distance to the Sun as an ingredient, so ${slots.person}'s "because Earth is closer" is put aside.`,
    slots.bulbClaim
      ? 'The Moon has no bulb of its own in the sheet: it reflects the Sun, so the bulb claim becomes reflection.'
      : 'The sheet has the Moon reflecting the Sun rather than shining on its own.',
    'The full moon of the model keeps the sheet order: the Earth sits roughly on the Sun–Earth–Moon line, so the Moon is lit by the Sun across the Earth.'
  ];
}

export const unit = 58;

export const cases = [
  {
    template: 'Earth, moon, and length of day',
    type: slugify('Earth, moon, and length of day'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
