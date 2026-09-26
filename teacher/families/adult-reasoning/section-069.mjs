/**
 * Section 69 of the adult-reasoning course: volumes, containers, and mixtures.
 *
 * Every variant prints the same sheet — 1 l = 1000 cm³ — plus the quoted rule
 * "Volume of water = volume up to the level minus the stones", then one
 * rectangular tank with its three sides, a fill percentage, and a volume of
 * submerged stones. The verdict converts the tank to litres, takes the filled
 * share, and subtracts the stones, which displace water without being water.
 * The cases change the tank height and the fill level, so the family derives
 * the full volume and the water volume from the parsed tank.
 */

import { slugify } from '../../naming.mjs';

const SHEET_PATTERN = /1 l = 1000 cm³\./;
const RULE_PATTERN = /“Volume of water = volume up to the level minus the stones\.”/;
const TANK_PATTERN =
  /Tank ([0-9]+(?:\.[0-9]+)?) cm × ([0-9]+(?:\.[0-9]+)?) cm × ([0-9]+(?:\.[0-9]+)?) cm, filled ([0-9]+(?:\.[0-9]+)?)%\. Stones ([0-9]+(?:\.[0-9]+)?) l submerged\./;

/** One litre is ten tenths, so tenths print with the one decimal of the answer. */
function litres(tenths) {
  return (tenths / 10).toFixed(1);
}

function parse(statement) {
  const tank = TANK_PATTERN.exec(statement);
  if (tank === null || !SHEET_PATTERN.test(statement) || !RULE_PATTERN.test(statement)) {
    throw new Error('the statement does not give the conversion sheet, the rule, and one tank');
  }
  return {
    tank: { length: Number(tank[1]), width: Number(tank[2]), height: Number(tank[3]) },
    filledPercent: Number(tank[4]),
    stonesLitres: Number(tank[5]),
    waterIsLevelMinusStones: /volume up to the level minus the stones/.test(statement)
  };
}

function solve(slots) {
  const { length, width, height } = slots.tank;
  if (!(length > 0) || !(width > 0) || !(height > 0)) {
    throw new Error('the three sides of the tank must be positive lengths');
  }
  if (!(slots.filledPercent > 0) || !(slots.filledPercent < 100)) {
    throw new Error('the tank must be filled to a percentage strictly between 0 and 100');
  }
  if (!(slots.stonesLitres > 0) || !slots.waterIsLevelMinusStones) {
    throw new Error('the stones must have a volume and the statement must state the level-minus-stones rule');
  }
  const fullCm3 = length * width * height;
  const fullTenths = fullCm3 / 100;
  const levelTenths = (fullTenths * slots.filledPercent) / 100;
  const stonesTenths = slots.stonesLitres * 10;
  if (!Number.isInteger(fullTenths) || !Number.isInteger(levelTenths) || !Number.isInteger(stonesTenths)) {
    throw new Error('the tank and the stones must give whole tenths of a litre');
  }
  const waterTenths = levelTenths - stonesTenths;
  if (!(waterTenths > 0) || waterTenths >= levelTenths) {
    throw new Error('the submerged stones must leave some water below the level');
  }
  return { fullLitres: litres(fullTenths), waterLitres: litres(waterTenths) };
}

function render(solution) {
  return `Full ${solution.fullLitres} l. Water ${solution.waterLitres} l.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const fullCm3 = slots.tank.length * slots.tank.width * slots.tank.height;',
  'const fullTenths = fullCm3 / 100;',
  'const levelTenths = (fullTenths * slots.filledPercent) / 100;',
  'const stonesTenths = slots.stonesLitres * 10;',
  'probe(Number.isInteger(fullTenths) && Number.isInteger(levelTenths) && Number.isInteger(stonesTenths), "the tank and the stones must give whole tenths of a litre");',
  'const waterTenths = levelTenths - stonesTenths;',
  'probe(waterTenths > 0 && waterTenths < levelTenths, "the submerged stones must leave some water below the level");',
  'const litres = (tenths) => (tenths / 10).toFixed(1);',
  'return "Full " + litres(fullTenths) + " l. Water " + litres(waterTenths) + " l.";'
].join('\n');

function explain(slots, solution) {
  const { length, width, height } = slots.tank;
  return [
    `The tank measures ${length} cm × ${width} cm × ${height} cm, so its full volume is ${length * width * height} cm³, which the sheet converts to ${solution.fullLitres} l.`,
    `Filling it to ${slots.filledPercent}% gives ${slots.filledPercent}% of that, and the submerged stones take ${slots.stonesLitres} l of the space up to the level.`,
    `Because the rule subtracts the stones from the volume up to the level, the water is ${solution.waterLitres} l: the stones displace water without becoming water.`
  ];
}

export const unit = 69;

export const cases = [
  {
    template: 'Volumes, containers, and mixtures',
    type: slugify('Volumes, containers, and mixtures'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
