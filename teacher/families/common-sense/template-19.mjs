/**
 * Template 19 of the common-sense book: robustness.
 *
 * Every variant gives three strategies A, B, and C with an integer outcome in
 * each of three named scenarios, a percentage probability per scenario, and a
 * threshold that a strategy must reach in every scenario to stay acceptable.
 * The weighted mean of a strategy is the sum over the scenarios of the
 * scenario probability times its outcome, computed in hundredths so the
 * printed one-decimal means are exact; the choice is the acceptable strategy
 * with the largest mean (the first such strategy in the order the statement
 * lists them), and no choice exists when the threshold removes every strategy.
 *
 * The family accepts every variant that carries the scenario names, one
 * outcome list per strategy, the scenario probabilities, and the threshold.
 * The fifty variants differ in the outcomes, in the threshold (55, 60 or 65),
 * and in whether one, several, or no strategy stays acceptable.
 */

import { slugify } from '../../naming.mjs';

const SCENARIOS_PATTERN = /outcomes \(higher is better\) in ([A-Za-z]+, [A-Za-z]+, and [A-Za-z]+) scenarios: /;
const PROBABILITIES_PATTERN = /Weighted-average scenario probabilities are ([^.]*)\./;
const THRESHOLD_PATTERN = /A robustness rule also requires a result of at least (\d+) in every scenario/;
const LABELLED_LIST_PATTERN = /([A-Z]): (\d+(?:, \d+)*)/g;

function scenarioNames(text) {
  return text.replace(/ and /g, ', ').split(', ').map((name) => name.trim());
}

function parse(statement) {
  const scenarios = SCENARIOS_PATTERN.exec(statement);
  if (scenarios === null) {
    throw new Error('the statement does not name the scenarios');
  }
  const probabilities = PROBABILITIES_PATTERN.exec(statement);
  if (probabilities === null) {
    throw new Error('the statement does not state the scenario probabilities');
  }
  const threshold = THRESHOLD_PATTERN.exec(statement);
  if (threshold === null) {
    throw new Error('the statement does not state the robustness threshold');
  }
  const outcomesIndex = statement.indexOf('scenarios: ');
  if (outcomesIndex < 0) {
    throw new Error('the statement does not state the strategy outcomes');
  }
  const strategies = [...statement.slice(outcomesIndex).matchAll(LABELLED_LIST_PATTERN)]
    .map((match) => ({ label: match[1], outcomes: match[2].split(', ').map(Number) }));
  if (strategies.length === 0) {
    throw new Error('the statement does not state any strategy outcomes');
  }
  return {
    scenarios: scenarioNames(scenarios[1]),
    probabilities: [...probabilities[1].matchAll(/(\d+)%/g)].map((match) => Number(match[1])),
    threshold: Number(threshold[1]),
    strategies
  };
}

/**
 * A weighted mean in hundredths of a unit: `(p/100) × outcome` summed over the
 * scenarios is `Σ p × outcome` hundredths, an integer multiple of ten here, so
 * the printed one-decimal means never pick up binary-float noise.
 */
function meanHundredths(strategy, probabilities) {
  let total = 0;
  for (let index = 0; index < probabilities.length; index += 1) {
    total += probabilities[index] * strategy.outcomes[index];
  }
  return total;
}

function formatTenths(hundredths) {
  const tenths = Math.floor(hundredths / 10);
  return `${Math.floor(tenths / 10)}.${tenths % 10}`;
}

function solve(slots) {
  const scenarioCount = slots.scenarios.length;
  if (slots.probabilities.length !== scenarioCount) {
    throw new Error('the statement must state one probability per scenario');
  }
  const strategies = slots.strategies.map((strategy) => {
    if (strategy.outcomes.length !== scenarioCount) {
      throw new Error(`strategy ${strategy.label} does not carry one outcome per scenario`);
    }
    const minimum = Math.min(...strategy.outcomes);
    return {
      label: strategy.label,
      hundredths: meanHundredths(strategy, slots.probabilities),
      minimum,
      acceptable: minimum >= slots.threshold
    };
  });
  const acceptable = strategies.filter((strategy) => strategy.acceptable);
  const best = acceptable.length === 0
    ? 0
    : Math.max(...acceptable.map((strategy) => strategy.hundredths));
  // Variant 8.6.10 leaves A and C at the same largest mean and the printed
  // answer names A alone, so the choice is the first acceptable strategy that
  // attains the maximum, read in the order the statement lists the strategies.
  const winner = acceptable.find((strategy) => strategy.hundredths === best) ?? null;
  const rivals = winner === null
    ? []
    : acceptable.filter((strategy) => strategy !== winner && strategy.hundredths === best).map((strategy) => strategy.label);
  return {
    strategies,
    threshold: slots.threshold,
    acceptable: acceptable.map((strategy) => strategy.label),
    chosen: winner === null ? null : winner.label,
    rivals
  };
}

function render(solution) {
  const means = solution.strategies
    .map((strategy) => `${strategy.label}=${formatTenths(strategy.hundredths)}`)
    .join(', ');
  const choice = solution.chosen === null ? 'none of the strategies' : solution.chosen;
  return `Weighted means: ${means}. After the robustness threshold, the choice is ${choice}.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const scenarioCount = slots.scenarios.length;',
  'let probabilitySum = 0;',
  'for (const probability of slots.probabilities) {',
  '  probabilitySum += probability;',
  '}',
  'const labels = [];',
  'const hundredths = {};',
  'const minimums = {};',
  'for (const strategy of slots.strategies) {',
  '  let total = 0;',
  '  for (let index = 0; index < scenarioCount; index += 1) {',
  '    const outcome = strategy.outcomes[index];',
  '    total += slots.probabilities[index] * outcome;',
  '  }',
  '  hundredths[strategy.label] = total;',
  '  minimums[strategy.label] = Math.min(...strategy.outcomes);',
  '  labels.push(strategy.label);',
  '}',
  'const acceptable = labels.filter((label) => minimums[label] >= slots.threshold);',
  'const bestMean = acceptable.length === 0 ? 0 : Math.max(...acceptable.map((label) => hundredths[label]));',
  'const winner = acceptable.find((label) => hundredths[label] === bestMean);',
  'probe(acceptable.length === 0 || winner !== undefined, "the acceptable strategies must attain a largest weighted mean");',
  'const format = (value) => {',
  '  const tenths = Math.floor(value / 10);',
  '  return Math.floor(tenths / 10) + "." + (tenths % 10);',
  '};',
  'const means = labels.map((label) => label + "=" + format(hundredths[label])).join(", ");',
  'return "Weighted means: " + means + ". After the robustness threshold, the choice is " + (winner === undefined ? "none of the strategies" : winner) + ".";'
].join('\n');

function explain(slots, solution) {
  const probabilities = slots.probabilities.map((probability) => `${probability}%`).join('/');
  const names = slots.scenarios.join(', ');
  const rejected = solution.strategies.filter((strategy) => !strategy.acceptable);
  const ruled = rejected.length === 0
    ? 'no strategy falls below it'
    : `${rejected.map((strategy) => strategy.label).join(' and ')} fall${rejected.length === 1 ? 's' : ''} below it`;
  const shared = solution.rivals.length === 0
    ? ''
    : `, shared with ${solution.rivals.join(' and ')}, which the statement lists later`;
  const choice = solution.chosen === null
    ? 'the threshold leaves no strategy to choose from'
    : `the largest mean among them belongs to ${solution.chosen}${shared}, so the choice is ${solution.chosen}`;
  return [
    `The weighted mean of a strategy adds, over the scenarios ${names}, the scenario probability times the outcome, with probabilities ${probabilities}, so a likely scenario moves the mean more than an unlikely one.`,
    `The robustness rule is separate from that average: a strategy is acceptable only when every one of its scenario results reaches the threshold of ${solution.threshold}, and ${ruled}.`,
    `The decision then compares the weighted means of the acceptable strategies only, and ${choice}.`,
    'Dropping a strategy with a high average is therefore not a contradiction, because an average rewards likely performance while the threshold forbids an unacceptably weak outcome in any single scenario.'
  ];
}

export const unit = 19;

export const cases = [
  {
    template: 'Robustness',
    type: slugify('Robustness'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
