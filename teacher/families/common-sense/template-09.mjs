/**
 * Template 9 of the common-sense book: data consistency.
 *
 * Every variant states three disjoint categories, a partition rule that fixes
 * the overall total as their sum, the total the same page prints, and a
 * secondary relationship between the categories. The answer reports that the
 * table is inconsistent, names the category sum, gives the signed difference
 * between the printed and the calculated total, and states what the mismatch
 * does and does not show about the wrong cell.
 *
 * The variants differ in the category values, the printed total (which always
 * differs from the sum by 10, 20, or 30 units in either direction) and the unit
 * noun (`cases`, `service units`, …); the secondary rule is checked, because a
 * variant that violated it would need wording this family does not reproduce.
 */

import { slugify } from '../../naming.mjs';

const CATEGORIES_PATTERN = /A=(\d+), B=(\d+), and C=(\d+) ([a-z][a-z ]*)\./;
const TOTAL_PATTERN = /prints an overall total of (\d+) ([a-z][a-z ]*)\./;
const SECOND_RULE_PATTERN = /A second rule states that ([A-Z])\+([A-Z]) must be greater than ([A-Z])\./;

function parse(statement) {
  const categories = CATEGORIES_PATTERN.exec(statement);
  const total = TOTAL_PATTERN.exec(statement);
  const rule = SECOND_RULE_PATTERN.exec(statement);
  if (categories === null) {
    throw new Error('the statement does not state the three disjoint categories');
  }
  if (total === null) {
    throw new Error('the statement does not state the printed overall total');
  }
  if (rule === null) {
    throw new Error('the statement does not state the secondary relationship between the categories');
  }
  const values = { A: Number(categories[1]), B: Number(categories[2]), C: Number(categories[3]) };
  const unit = categories[4].trim();
  const printedUnit = total[2].trim();
  if (unit !== printedUnit) {
    throw new Error(`the categories are counted in ${unit} but the printed total in ${printedUnit}`);
  }
  return {
    values,
    unit,
    printed: Number(total[1]),
    secondaryRule: { left: rule[1], right: rule[2], greater: rule[3] }
  };
}

function signed(value) {
  return value > 0 ? `+${value}` : String(value);
}

function solve(slots) {
  const { A, B, C } = slots.values;
  const sum = A + B + C;
  const difference = slots.printed - sum;
  if (difference === 0) {
    throw new Error('the printed total equals the category sum, a shape this family does not phrase');
  }
  const rule = slots.secondaryRule;
  if (rule.left !== 'A' || rule.right !== 'B' || rule.greater !== 'C') {
    throw new Error('the secondary relationship is not the stated A+B > C form');
  }
  if (!(A + B > C)) {
    throw new Error('the secondary relationship A+B > C is violated, a shape this family does not phrase');
  }
  return { ...slots.values, sum, printed: slots.printed, difference, secondary: A + B, unit: slots.unit };
}

function render(solution) {
  return `No. The category sum is ${solution.sum}, while the printed total differs by ${signed(solution.difference)} ${solution.unit}. The inconsistency is demonstrable, but the incorrect cell cannot be identified uniquely from these data alone.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(slots.values !== null && typeof slots.values === "object", "the statement must state the three disjoint categories");',
  'probe(["A", "B", "C"].every((name) => Number.isInteger(slots.values[name]) && slots.values[name] >= 0), "every category must carry a whole non-negative count");',
  'probe(Number.isInteger(slots.printed) && slots.printed > 0, "the printed overall total must be a positive whole number");',
  'probe(typeof slots.unit === "string" && slots.unit.length > 0, "the statement must state the unit the counts are given in");',
  'probe(slots.secondaryRule !== null && typeof slots.secondaryRule === "object", "the statement must state the secondary relationship");',
  'const A = slots.values.A;',
  'const B = slots.values.B;',
  'const C = slots.values.C;',
  'const sum = A + B + C;',
  'const difference = slots.printed - sum;',
  'probe(difference !== 0, "the printed total must differ from the category sum, otherwise the table is consistent");',
  'probe(slots.secondaryRule.left === "A" && slots.secondaryRule.right === "B" && slots.secondaryRule.greater === "C", "the secondary relationship must be the stated A+B > C form");',
  'probe(A + B > C, "the secondary relationship A+B > C must hold in this family");',
  'const signed = difference > 0 ? "+" + difference : String(difference);',
  'return "No. The category sum is " + sum + ", while the printed total differs by " + signed + " " + slots.unit + ". The inconsistency is demonstrable, but the incorrect cell cannot be identified uniquely from these data alone.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The three categories are disjoint and together cover every unit, so the partition rule forces the total to be ${solution.A} + ${solution.B} + ${solution.C} = ${solution.sum} ${solution.unit}.`,
    `The page prints ${solution.printed} ${solution.unit}, so printed minus calculated is ${signed(solution.difference)} ${solution.unit}; two numbers that must agree do not, so the table is not internally consistent.`,
    `The secondary relationship is satisfied (${solution.secondary} > ${solution.C}), so the total is the relationship the report breaks.`,
    `Nothing in the statement fixes A, B, or C independently of the total, so the mismatch proves that some entry is wrong but cannot say which one, and any single category, the total, or a combination could carry the error.`
  ];
}

export const unit = 9;

export const cases = [
  {
    template: 'Data consistency',
    type: slugify('Data consistency'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
