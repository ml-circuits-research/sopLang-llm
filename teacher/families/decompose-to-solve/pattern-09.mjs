/**
 * Pattern 9 of the decompose-to-solve book: ten-part integrated decomposition.
 *
 * Every variant states a plan over a demand that is first converted by a
 * factor and then hit by a percent process loss, a batch capacity with its
 * parallel batch capacity and wave time, a setup and a mandatory buffer, a
 * slot limit, a fixed cost with a per-unit rate, a deadline, and a budget.
 * The book splits that scenario into ten subproblems whose interfaces the
 * solver must keep apart; the answer prints the feasibility verdict and four
 * summaries. The variants change the domain phrase and the numbers, never the
 * method.
 *
 * Arithmetic, all of it derived from the statement text:
 *
 *   standardUnits = localUnits × factor
 *   preLoss       = standardUnits / (1 − lossPercent/100)
 *   display       = preLoss rounded to one decimal, ties to the even tenth (book SP2)
 *   batches       = ceil(display / capacity)                       (book SP3)
 *   waves         = ceil(batches / parallelBatches)                (book SP4)
 *   minutes       = waves × waveMinutes + setupMinutes + bufferMinutes
 *   cost          = fixedCost + ratePerUnit × preLoss
 *   feasible      = batches ≤ batchSlots ∧ minutes ≤ deadlineMinutes ∧ cost ≤ budgetUnits
 *
 * Which pre-loss value the cost uses: the price rule is stated per pre-loss
 * standard unit, so the cost applies the printed rate to the exact pre-loss and
 * never to the one-decimal display SP2 prints. The book's own SP7 feeds the
 * printed rate SP2's displayed pre-loss instead; the two readings differ by at
 * most ratePerUnit × 0.05, and only the exact reading keeps every printed cost
 * inside the rounding band below. The batch count uses the displayed pre-loss
 * because that is SP3's stated input, and `solve` refuses a variant whose exact
 * and displayed batch counts disagree, because the statement never says that
 * the demand is rounded to one decimal before it is batched.
 *
 * Printed answer status: `inconsistent`. The statement prints the per-unit rate
 * rounded to two decimals, so the printed cost is not the cost the printed rate
 * yields. A rate printed to two decimals may sit up to half a cent per unit
 * away from the rate the source computed with, so the printed cost can sit half
 * a cent times the whole demand away from the derived cost, plus the cent the
 * printed cost itself was rounded to. The band is therefore
 *
 *   |printedCost − computedCost| ≤ 0.005 × preLoss + 0.01
 *
 * and `verifyPrinted` also requires the printed feasibility word to equal the
 * computed verdict. Every one of the hundred printed costs of this pattern
 * falls inside that band, while the book's SP7 chain (the printed rate applied
 * to SP2's displayed pre-loss) leaves the band for the variants 2.3.9, 6.5.9,
 * and 6.8.9: the statement determines the computation, and the printed cents
 * contradict the statement's own subproblem.
 */
import { slugify } from '../../naming.mjs';

const LOCAL_PATTERN = /a plan starts from (\d+) local units/;
const FACTOR_PATTERN = /Convert by ([\d.]+) to standard units/;
const LOSS_PATTERN = /then allow (\d+)% process loss/;
const CAPACITY_PATTERN = /Each batch handles (\d+) standard units/;
const PARALLEL_PATTERN = /Up to (\d+) batches can run in parallel/;
const WAVE_PATTERN = /each wave taking (\d+) minutes/;
const SETUP_PATTERN = /Setup takes (\d+) minutes/;
const BUFFER_PATTERN = /a mandatory buffer adds (\d+) minutes/;
const SLOTS_PATTERN = /There are at most (\d+) batch slots/;
const FIXED_PATTERN = /Cost is (\d+) fixed/;
const RATE_PATTERN = /plus ([\d.]+) per pre-loss standard unit/;
const DEADLINE_PATTERN = /The deadline is (\d+) minutes/;
const BUDGET_PATTERN = /the budget is ([\d.]+) units/;

const PRINTED_VERDICT_PATTERN = /The plan is (not )?feasible\./;
const PRINTED_SUMMARIES_PATTERN =
  /summaries are ([\d.]+) pre-loss standard units, (\d+) batches, (\d+) minutes, and ([\d.]+) cost units\./;

/** The one captured number of a statement field, or a named parse failure. */
function field(pattern, statement, name) {
  const match = pattern.exec(statement);
  if (match === null) {
    throw new Error(`the statement does not state ${name}`);
  }
  return Number(match[1]);
}

function parse(statement) {
  if (!/Scenario\./.test(statement)) {
    throw new Error('the statement does not carry the blocks this book prints for the template');
  }
  return {
    localUnits: field(LOCAL_PATTERN, statement, 'the local demand'),
    factor: field(FACTOR_PATTERN, statement, 'the conversion factor'),
    lossPercent: field(LOSS_PATTERN, statement, 'the process loss'),
    capacity: field(CAPACITY_PATTERN, statement, 'the batch capacity'),
    parallelBatches: field(PARALLEL_PATTERN, statement, 'the parallel batch capacity'),
    waveMinutes: field(WAVE_PATTERN, statement, 'the wave time'),
    setupMinutes: field(SETUP_PATTERN, statement, 'the setup time'),
    bufferMinutes: field(BUFFER_PATTERN, statement, 'the buffer time'),
    batchSlots: field(SLOTS_PATTERN, statement, 'the batch slots'),
    fixedCost: field(FIXED_PATTERN, statement, 'the fixed cost'),
    ratePerUnit: field(RATE_PATTERN, statement, 'the per-unit rate'),
    deadlineMinutes: field(DEADLINE_PATTERN, statement, 'the deadline'),
    budgetUnits: field(BUDGET_PATTERN, statement, 'the budget')
  };
}

/**
 * The pre-loss demand in tenths: the one-decimal value the book's SP2 prints.
 * An exact half tenth is resolved to the even tenth, which is how the source
 * rounds; for every other value the result is the ordinary nearest tenth.
 */
function preLossTenthsOf(preLoss) {
  const scaled = preLoss * 10;
  const lower = Math.floor(scaled);
  if (Math.abs(scaled - lower - 0.5) < 1e-9 && lower % 2 === 0) {
    return lower;
  }
  return Math.round(scaled);
}

/** The one-decimal text of a value held in tenths. */
function formatTenths(tenths) {
  return `${Math.floor(tenths / 10)}.${tenths % 10}`;
}

function solve(slots) {
  const preLoss = slots.localUnits * slots.factor / (1 - slots.lossPercent / 100);
  const preLossTenths = preLossTenthsOf(preLoss);
  const batches = Math.ceil(preLossTenths / (slots.capacity * 10));
  if (batches !== Math.ceil(preLoss / slots.capacity)) {
    // The statement never says that the one-decimal display of SP2 is taken
    // before the batch count, and here the two readings demand different whole
    // batches, so neither batch count is determined by the text.
    const ambiguity = new Error(
      'the statement does not determine whether the pre-loss demand is rounded to one decimal before it is batched'
    );
    ambiguity.ambiguous = true;
    throw ambiguity;
  }
  const waves = Math.ceil(batches / slots.parallelBatches);
  const minutes = waves * slots.waveMinutes + slots.setupMinutes + slots.bufferMinutes;
  const cost = slots.fixedCost + slots.ratePerUnit * preLoss;
  const capacityOk = batches <= slots.batchSlots;
  const timeOk = minutes <= slots.deadlineMinutes;
  const budgetOk = cost <= slots.budgetUnits;
  return {
    preLoss,
    preLossTenths,
    preLossText: formatTenths(preLossTenths),
    batches,
    waves,
    minutes,
    cost,
    costText: cost.toFixed(2),
    capacityOk,
    timeOk,
    budgetOk,
    feasible: capacityOk && timeOk && budgetOk
  };
}

function render(solution) {
  return `The plan is ${solution.feasible ? 'feasible' : 'not feasible'}. Its key summaries are ` +
    `${solution.preLossText} pre-loss standard units, ${solution.batches} batches, ${solution.minutes} minutes, ` +
    `and ${solution.costText} cost units. The cost applies the stated per-unit rate to the pre-loss demand, ` +
    'the one quantity that every capacity and variable-cost step shares.';
}

const COMPUTE = [
  'const slots = $slots;',
  'const preLossTenthsOf = (preLoss) => {',
  '  const scaled = preLoss * 10;',
  '  const lower = Math.floor(scaled);',
  '  if (Math.abs(scaled - lower - 0.5) < 1e-9 && lower % 2 === 0) {',
  '    return lower;',
  '  }',
  '  return Math.round(scaled);',
  '};',
  'const preLoss = slots.localUnits * slots.factor / (1 - slots.lossPercent / 100);',
  'probe(preLoss > 0, "the pre-loss demand must be positive");',
  'const preLossTenths = preLossTenthsOf(preLoss);',
  'const batches = Math.ceil(preLossTenths / (slots.capacity * 10));',
  'probe(batches === Math.ceil(preLoss / slots.capacity), "the one-decimal display must not change the whole-batch requirement");',
  'probe(batches > 0, "the demand must require at least one batch");',
  'const waves = Math.ceil(batches / slots.parallelBatches);',
  'probe(waves * slots.parallelBatches >= batches, "the waves must cover every batch");',
  'const minutes = waves * slots.waveMinutes + slots.setupMinutes + slots.bufferMinutes;',
  'probe(minutes >= slots.setupMinutes + slots.bufferMinutes, "the elapsed time must include the setup and the buffer");',
  'const cost = slots.fixedCost + slots.ratePerUnit * preLoss;',
  'probe(cost >= slots.fixedCost, "the cost must include the fixed charge");',
  'const capacityOk = batches <= slots.batchSlots;',
  'const timeOk = minutes <= slots.deadlineMinutes;',
  'const budgetOk = cost <= slots.budgetUnits;',
  'const feasible = capacityOk && timeOk && budgetOk;',
  'const failing = (capacityOk ? 0 : 1) + (timeOk ? 0 : 1) + (budgetOk ? 0 : 1);',
  'probe(feasible === (failing === 0), "the verdict must be feasible exactly when no hard constraint fails");',
  'const preLossText = Math.floor(preLossTenths / 10) + "." + (preLossTenths % 10);',
  'const costText = cost.toFixed(2);',
  'return "The plan is " + (feasible ? "feasible" : "not feasible") + ". Its key summaries are " + preLossText +',
  '  " pre-loss standard units, " + batches + " batches, " + minutes + " minutes, and " + costText + " cost units. " +',
  '  "The cost applies the stated per-unit rate to the pre-loss demand, the one quantity that every capacity " +',
  '  "and variable-cost step shares.";'
].join('\n');

function explain(slots, solution) {
  const verdict = (ok) => (ok ? 'holds' : 'fails');
  const constraints = [
    `the physical capacity ${verdict(solution.capacityOk)}`,
    `the deadline ${verdict(solution.timeOk)}`,
    `the budget ${verdict(solution.budgetOk)}`
  ];
  return [
    `The demand converts first: ${slots.localUnits} local units times the factor ${slots.factor} give the standard ` +
      `requirement, and allowing ${slots.lossPercent}% process loss gives ${solution.preLossText} pre-loss standard ` +
      'units, the quantity every downstream step shares (SP1-SP2).',
    `Whole batches are demanded next: ${solution.preLossText} over the capacity ${slots.capacity} requires ` +
      `${solution.batches} batches, and at ${slots.parallelBatches} parallel batches per wave that is ` +
      `${solution.waves} waves (SP3-SP4).`,
    `Elapsed time is the waves only: ${solution.waves} waves at ${slots.waveMinutes} minutes plus the setup ` +
      `${slots.setupMinutes} and the buffer ${slots.bufferMinutes} give ${solution.minutes} minutes, which is compared ` +
      `with the ${slots.deadlineMinutes}-minute deadline (SP5-SP6, SP9).`,
    `Cost is the fixed charge plus the rate per pre-loss unit: ${slots.fixedCost} plus ${slots.ratePerUnit} times ` +
      `${Number(solution.preLoss.toFixed(4))} gives ${solution.costText} cost units, compared with the budget ` +
      `${slots.budgetUnits} (SP7, SP9).`,
    `The three hard constraints are recombined as a conjunction: ${constraints.join(', ')}, so the overall verdict is ` +
      `${solution.feasible ? 'feasible' : 'not feasible'} (SP8, SP10).`,
    'The printed cost is a two-decimal rounding of a charge the source computed from an unrounded rate, so it sits ' +
      'inside the rounding band of the printed rate rather than at the value the printed rate yields.'
  ];
}

/**
 * The printed answer of this template is `inconsistent`: the statement prints
 * the per-unit rate rounded to two decimals, so the printed cost follows the
 * rate the source computed with and only agrees with the arithmetic derived
 * from the printed rate inside that rounding band. The printed feasibility
 * word, which the statement does determine, must match the computed verdict,
 * and the printed cost must stay within `0.005 × preLoss + 0.01` of the cost
 * the printed rate gives. A variant whose printed cost lies outside the band,
 * or whose printed verdict contradicts the statement's own constraints, is not
 * accepted, so the pilot reports it instead of shipping it.
 */
function verifyPrinted(parsedSlots, solution, printedText) {
  const verdict = PRINTED_VERDICT_PATTERN.exec(printedText);
  const summaries = PRINTED_SUMMARIES_PATTERN.exec(printedText);
  if (verdict === null || summaries === null) {
    throw new Error('the printed answer does not state the feasibility verdict and the four summaries');
  }
  if ((verdict[1] === undefined) !== solution.feasible) {
    return false;
  }
  // The pre-loss demand, the batch count, and the elapsed time are exactly
  // determined by the statement, so the printed text must agree with the
  // computation on all three; only the cost is allowed to sit in the rounding
  // band of the printed rate.
  if (summaries[1] !== solution.preLossText || Number(summaries[2]) !== solution.batches || Number(summaries[3]) !== solution.minutes) {
    return false;
  }
  const printedCost = Number(summaries[4]);
  if (!Number.isFinite(printedCost)) {
    return false;
  }
  return Math.abs(printedCost - solution.cost) <= 0.005 * solution.preLoss + 0.01;
}

export const unit = 9;

export const cases = [
  {
    template: 'Ten-Part Integrated Decomposition',
    type: slugify('Ten-Part Integrated Decomposition'),
    category: 'no-knowledge',
    printedAnswerStatus: 'inconsistent',
    printedAnswerReason:
      'the statement prints the per-unit rate rounded to two decimals while the source computed the printed cost ' +
      'from an unrounded rate, so the printed cost agrees with the arithmetic the statement determines only inside ' +
      "the printed rate's rounding band.",
    verifyPrinted,
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
