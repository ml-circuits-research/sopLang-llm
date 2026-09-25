/**
 * Template 5 of the common-sense book: expected value and risk.
 *
 * Every variant states a probability of an adverse event, the loss it causes,
 * the certain cost of a protective measure, the fraction to which that measure
 * reduces the loss, and a hard risk limit. The expected cost without protection
 * is the probability times the loss; with protection it is the certain cost
 * plus the probability times the reduced loss. The adverse-scenario total is
 * compared with the risk limit first, because a plan that violates the limit is
 * rejected regardless of its expected cost; only the surviving plans are then
 * compared by expected cost.
 *
 * The fifty variants differ in the probability, the loss, the certain cost, the
 * reduction, and the limit. Without protection the adverse-scenario loss always
 * exceeds the limit; with protection it sometimes does and sometimes does not,
 * which is what separates the justified protective measure from the answer that
 * neither option survives the rule. Expected costs that carry quarters
 * (`421.25`, `572.5`) are computed as exact rationals so no binary-float noise
 * reaches the answer.
 */

import { slugify } from '../../naming.mjs';

const PROBABILITY_PATTERN = /there is a (\d+)% probability of a loss of (\d+) CU/;
const COST_PATTERN = /protective measure costs (\d+) CU for certain/;
const REDUCTION_PATTERN = /reduces the loss to (\d+)% of its original amount/;
const LIMIT_PATTERN = /exceeds (\d+) CU/;

function parse(statement) {
  const probability = PROBABILITY_PATTERN.exec(statement);
  const cost = COST_PATTERN.exec(statement);
  const reduction = REDUCTION_PATTERN.exec(statement);
  const limit = LIMIT_PATTERN.exec(statement);
  if (probability === null) {
    throw new Error('the statement does not state the probability and the size of the loss');
  }
  if (cost === null) {
    throw new Error('the statement does not state the certain cost of the protective measure');
  }
  if (reduction === null) {
    throw new Error('the statement does not state the reduction of the loss');
  }
  if (limit === null) {
    throw new Error('the statement does not state the hard risk limit');
  }
  return {
    probabilityPercent: Number(probability[1]),
    loss: Number(probability[2]),
    protectionCost: Number(cost[1]),
    reductionPercent: Number(reduction[1]),
    riskLimit: Number(limit[1])
  };
}

/** The rounded value of the exact rational `numerator / denominator` in hundredths. */
function roundHundredths(numerator, denominator) {
  let hundredths = Math.floor((numerator * 100) / denominator);
  const remainder = (numerator * 100) % denominator;
  if (2 * remainder > denominator || (2 * remainder === denominator && hundredths % 2 === 1)) {
    hundredths += 1;
  }
  return hundredths;
}

/** Hundredths as the book prints them: two decimals, trailing zeros dropped. */
function formatHundredths(hundredths) {
  const whole = Math.floor(hundredths / 100);
  const rest = hundredths % 100;
  if (rest === 0) {
    return String(whole);
  }
  return `${whole}.${String(rest).padStart(2, '0').replace(/0$/, '')}`;
}

/**
 * The adverse-scenario total of an option in hundredths of a CU: the loss the
 * option carries when the event occurs. The risk rule compares this total, not
 * the expected cost, with the limit.
 */
function adverseTotalHundredths(slots) {
  return {
    without: slots.loss * 100,
    with: slots.protectionCost * 100 + slots.reductionPercent * slots.loss
  };
}

function solve(slots) {
  const adverse = adverseTotalHundredths(slots);
  const expected = {
    without: roundHundredths(slots.probabilityPercent * slots.loss, 100),
    with: roundHundredths(
      slots.protectionCost * 10000 + slots.probabilityPercent * slots.reductionPercent * slots.loss,
      10000
    )
  };
  const limit = slots.riskLimit * 100;
  const acceptableWithout = adverse.without <= limit;
  const acceptableWith = adverse.with <= limit;
  let choice = 'neither';
  if (acceptableWithout && acceptableWith) {
    choice = expected.with < expected.without ? 'with' : 'without';
  } else if (acceptableWithout) {
    choice = 'without';
  } else if (acceptableWith) {
    choice = 'with';
  }
  return {
    expected,
    adverse,
    acceptable: { without: acceptableWithout, with: acceptableWith },
    choice
  };
}

function render(solution) {
  const justification = {
    with: 'the protective measure',
    without: 'the option without protection',
    neither: 'neither option, because both violate the hard risk rule'
  }[solution.choice];
  return `Expected cost without protection: ${formatHundredths(solution.expected.without)} CU; with protection: ${formatHundredths(solution.expected.with)} CU. Under the hard risk rule, the justified choice is ${justification}.`;
}

const WIRES = [
  {
    name: 'risk',
    command: 'jsEval',
    body: [
      'const slots = $slots;',
      'const roundHundredths = (numerator, denominator) => {',
      '  let hundredths = Math.floor((numerator * 100) / denominator);',
      '  const remainder = (numerator * 100) % denominator;',
      '  if (2 * remainder > denominator || (2 * remainder === denominator && hundredths % 2 === 1)) {',
      '    hundredths += 1;',
      '  }',
      '  return hundredths;',
      '};',
      'const expectedWithout = roundHundredths(slots.probabilityPercent * slots.loss, 100);',
      'const expectedWith = roundHundredths(slots.protectionCost * 10000 + slots.probabilityPercent * slots.reductionPercent * slots.loss, 10000);',
      'const adverseWithout = slots.loss * 100;',
      'const adverseWith = slots.protectionCost * 100 + slots.reductionPercent * slots.loss;',
      'const limit = slots.riskLimit * 100;',
      'const acceptableWithout = adverseWithout <= limit;',
      'const acceptableWith = adverseWith <= limit;',
      'probe(adverseWith <= adverseWithout, "the protective measure must not increase the adverse-scenario loss");',
      'probe(expectedWithout > 0 && expectedWith > 0, "both expected costs must be positive");',
      'let justification = "neither option, because both violate the hard risk rule";',
      'if (acceptableWithout && acceptableWith) {',
      '  justification = expectedWith < expectedWithout ? "the protective measure" : "the option without protection";',
      '} else if (acceptableWithout) {',
      '  justification = "the option without protection";',
      '} else if (acceptableWith) {',
      '  justification = "the protective measure";',
      '}',
      'return { expectedWithout, expectedWith, justification };'
    ].join('\n')
  }
];

const COMPUTE = [
  'const formatHundredths = (hundredths) => {',
  '  const whole = Math.floor(hundredths / 100);',
  '  const rest = hundredths % 100;',
  '  if (rest === 0) { return String(whole); }',
  '  return whole + "." + String(rest).padStart(2, "0").replace(/0$/, "");',
  '};',
  'return "Expected cost without protection: " + formatHundredths($risk.expectedWithout) + " CU; with protection: " + formatHundredths($risk.expectedWith) + " CU. Under the hard risk rule, the justified choice is " + $risk.justification + ".";'
].join('\n');

function explain(slots, solution) {
  return [
    `Without protection the expected cost is the probability times the loss, ${slots.probabilityPercent}/100 × ${slots.loss} = ${formatHundredths(solution.expected.without)} CU, and the adverse scenario carries the full ${slots.loss} CU loss.`,
    `With protection the ${slots.protectionCost} CU are paid for certain and the loss falls to ${slots.reductionPercent}% of ${slots.loss} CU, so the expected cost is ${slots.protectionCost} + ${slots.probabilityPercent}/100 × ${slots.reductionPercent}/100 × ${slots.loss} = ${formatHundredths(solution.expected.with)} CU.`,
    `The hard risk rule is applied first: an option whose adverse-scenario total exceeds ${slots.riskLimit} CU is rejected before any expected cost is compared.`,
    solution.choice === 'neither'
      ? 'Both options exceed the risk limit in the adverse scenario, so neither is justified even though their expected costs differ.'
      : solution.acceptable.without && solution.acceptable.with
        ? 'Both options survive the risk rule, so the lower expected cost is the justified choice.'
        : solution.acceptable.with
          ? 'Without protection the adverse scenario exceeds the limit, so the protective measure is the only option that survives the hard risk rule.'
          : 'Only the option without protection survives the risk rule, so it is the justified choice.'
  ];
}

export const unit = 5;

export const cases = [
  {
    template: 'Expected value and risk',
    type: slugify('Expected value and risk'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    wires: WIRES,
    compute: COMPUTE,
    explain
  }
];
