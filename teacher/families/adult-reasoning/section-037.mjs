/**
 * Section 37 of the adult-reasoning course: a weather bulletin and a decision.
 *
 * Every variant prints a bulletin for a district — temperature entries, a
 * shower chance for a fixed window, an evening wind, and a yellow wind warning
 * after a stated hour — and describes a person whose picnic runs past that
 * hour without shelter, raincoat left behind, on the grounds that the percent
 * "means it rather will not rain". The verdict points at the shower window and
 * the wind warning inside the plan, and reads the percent correctly: at or
 * above half it does not support "rather not". The cases change the district,
 * the planner, the percent, and the window and warning hours, so the family
 * derives each printed figure from the parsed bulletin.
 */

import { slugify } from '../../naming.mjs';

const BULLETIN_PATTERN = /Bulletin for ([^:]+):/;
const SHOWER_PATTERN = /showers (\d+)% in the (\d{1,2})[–-](\d{1,2}) window/;
const WIND_PATTERN = /yellow wind warning after (\d{1,2}):(\d{2})/;
const PLAN_PATTERN = /([A-Z][a-z]+) plans a picnic (\d{1,2}):(\d{2})[–-](\d{1,2}):(\d{2}) with no shelter/;

function hourLabel(value) {
  const [hours, minutes] = String(value).split(':');
  return minutes === '00' ? String(Number(hours)) : `${Number(hours)}:${minutes}`;
}

function hourValue(value) {
  const [hours, minutes] = String(value).split(':');
  return Number(hours) + Number(minutes) / 60;
}

function parse(statement) {
  const bulletin = BULLETIN_PATTERN.exec(statement);
  const shower = SHOWER_PATTERN.exec(statement);
  const wind = WIND_PATTERN.exec(statement);
  const plan = PLAN_PATTERN.exec(statement);
  if (bulletin === null || shower === null || wind === null || plan === null) {
    throw new Error('the statement does not carry the bulletin, the shower chance, the wind warning, and the picnic plan');
  }
  return {
    place: bulletin[1].trim(),
    person: plan[1],
    percent: Number(shower[1]),
    showerFrom: shower[2],
    showerTo: shower[3],
    windFrom: `${wind[1]}:${wind[2]}`,
    picnicFrom: `${plan[2]}:${plan[3]}`,
    picnicTo: `${plan[4]}:${plan[5]}`,
    noShelter: /with no shelter/.test(statement),
    leavesRaincoat: /leaves the raincoat/.test(statement)
  };
}

function solve(slots) {
  if (!slots.noShelter || !slots.leavesRaincoat) {
    throw new Error('the described plan must be an unsheltered picnic with the raincoat left behind');
  }
  if (!(hourValue(slots.windFrom) < hourValue(slots.picnicTo))) {
    throw new Error('the wind warning starts after the picnic ends, so the bulletin does not contradict the plan');
  }
  if (slots.percent < 50) {
    throw new Error('the printed answer only challenges a claim at or above 50%');
  }
  return {
    showersClause: `Showers ${slots.showerFrom}–${slots.showerTo}`,
    windClause: `wind after ${hourLabel(slots.windFrom)}`,
    picnicClause: `picnic to ${hourLabel(slots.picnicTo)} with no shelter`,
    percentClause: `${slots.percent}% > 50: not “rather not” if it is ≥50`
  };
}

function render(solution) {
  return `${solution.showersClause} and ${solution.windClause}, ${solution.picnicClause}. ${solution.percentClause}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const hourValue = (value) => { const parts = String(value).split(":"); return Number(parts[0]) + Number(parts[1]) / 60; };',
  'const hourLabel = (value) => { const parts = String(value).split(":"); return parts[1] === "00" ? String(Number(parts[0])) : Number(parts[0]) + ":" + parts[1]; };',
  'const answer = "Showers " + slots.showerFrom + "–" + slots.showerTo + " and wind after " + hourLabel(slots.windFrom) + ", picnic to " + hourLabel(slots.picnicTo) + " with no shelter. " + slots.percent + "% > 50: not “rather not” if it is ≥50.";',
  'return answer;'
].join('\n');

function explain(slots, solution) {
  return [
    `The bulletin for ${slots.place} puts showers in the ${slots.showerFrom}–${slots.showerTo} window, and ${slots.person}'s picnic runs from ${slots.picnicFrom} to ${slots.picnicTo}, so the rain falls inside the plan.`,
    `The yellow wind warning starts after ${hourLabel(slots.windFrom)}, and the plan still runs, unsheltered and without the raincoat, until ${hourLabel(slots.picnicTo)}.`,
    `The percent is for the whole window, not for every minute, and ${slots.percent}% is at or above half, so it cannot be read as "rather not rain".`
  ];
}

export const unit = 37;

export const cases = [
  {
    template: 'A weather bulletin and a decision',
    type: slugify('A weather bulletin and a decision'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
