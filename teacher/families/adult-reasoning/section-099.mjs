/**
 * Section 99 of the adult-reasoning course: testimony, memory, and confirmation.
 *
 * Every variant prints the same notebook rule — testimony weakens with
 * distance, darkness, or a changed version, and only independent confirmation
 * strengthens it — and then three accounts of one coat: a witness who was far
 * away at night and changed the colour, a witness who was close up in daylight
 * and never spoke to the first, and a third person who merely repeats the first
 * version. The variants change the names, the distance, and the colours, so the
 * family derives the weaknesses, the firmer account, and the echo from the
 * parsed values.
 */

import { slugify } from '../../naming.mjs';

// A witness standing this far away cannot count as a close-up identification;
// every variant prints a distance well above it.
const FAR_DISTANCE_METERS = 25;

const FAR_PATTERN =
  /([A-Z][a-z]+): “at night, from (\d+) m, a (\w+) coat” then “actually (\w+)”\./;
const CLOSE_PATTERN =
  /([A-Z][a-z]+): close up, in daylight, “(\w+)”, without having spoken to ([A-Z][a-z]+)\./;
const ECHO_PATTERN = /([A-Z][a-z]+) repeats ([A-Z][a-z]+)’s first version\./;

function parse(statement) {
  const far = FAR_PATTERN.exec(statement);
  const close = CLOSE_PATTERN.exec(statement);
  const echo = ECHO_PATTERN.exec(statement);
  if (far === null || close === null || echo === null) {
    throw new Error('the statement does not print the far, close-up, and echoing accounts');
  }
  return {
    far: {
      name: far[1],
      distance: Number(far[2]),
      atNight: true,
      firstColour: far[3],
      secondColour: far[4],
      changed: far[3] !== far[4]
    },
    close: {
      name: close[1],
      colour: close[2],
      avoided: close[3],
      closeUp: true,
      daylight: true,
      // "without having spoken to <far witness>" is what makes the account
      // independent of the weakened version.
      independent: close[3] === far[1]
    },
    echo: { name: echo[1], source: echo[2], repeatsFirstVersion: true }
  };
}

function solve(slots) {
  if (slots.echo.source !== slots.far.name) {
    throw new Error('the echoing account does not repeat the far witness’s first version');
  }
  const weaknesses = [];
  if (slots.far.distance >= FAR_DISTANCE_METERS) {
    weaknesses.push('distance');
  }
  if (slots.far.atNight) {
    weaknesses.push('night');
  }
  if (slots.far.changed) {
    weaknesses.push('change');
  }
  if (weaknesses.length === 0) {
    throw new Error('the far account carries no weakness from the notebook');
  }
  const firm = slots.close.closeUp && slots.close.daylight && slots.close.independent;
  if (!firm) {
    throw new Error('the close-up account is not the independent account the notebook favours');
  }
  return {
    firm: slots.close.name,
    weakened: slots.far.name,
    weaknessClause: weaknesses.join(', '),
    echo: slots.echo.name
  };
}

function render(solution) {
  return `${solution.firm}’s. ${solution.weakened}’s is weakened by ${solution.weaknessClause}. ${solution.echo} is an echo, not confirmation.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const weaknesses = [];',
  'if (slots.far.distance >= 25) weaknesses.push("distance");',
  'if (slots.far.atNight) weaknesses.push("night");',
  'if (slots.far.changed) weaknesses.push("change");',
  'probe(weaknesses.length > 0, "the far account must carry at least one weakness from the notebook");',
  'return slots.close.name + "’s. " + slots.far.name + "’s is weakened by " + weaknesses.join(", ") + ". " + slots.echo.name + " is an echo, not confirmation.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The notebook lists three weakeners — distance, darkness, and a changed version — and ${slots.far.name} accumulates all three: ${slots.far.distance} m away, at night, and a coat that moved from ${slots.far.firstColour} to ${slots.far.secondColour}.`,
    `${slots.close.name} saw the same coat close up in daylight and never spoke to ${slots.far.name}, so the account is independent rather than refined by the first version.`,
    `${solution.echo} only repeats ${slots.far.name}’s first version, and repetition by someone who heard it is an echo, not the independent confirmation the notebook asks for.`,
    `The firmer account is therefore ${solution.firm}’s.`
  ];
}

export const unit = 99;

export const cases = [
  {
    template: 'Testimony, memory, and confirmation',
    type: slugify('Testimony, memory, and confirmation'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
