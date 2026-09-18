/**
 * Family N17 of the world seed book: counterfactual reasoning.
 *
 * Every problem states one small causal model of a town (heavy rain makes the
 * river high, a high river with an unclosed gate floods the square, a flooded
 * square closes the market), the actual facts, and one intervention to
 * consider. The answer names what changes once that single condition is set and
 * the consequences are recomputed with the rules held fixed.
 *
 * The intervention decides which consequence the recomputation loses: closing
 * the gate or preventing the high river clears the flood and the closure,
 * removing the heavy rain also clears the high river, keeping the gate open
 * leaves the original chain, and holding the market open only overrides the
 * final consequence while the flood remains.
 *
 * The four grades share one computation: the variants differ in the stated
 * intervention and in the appended cross-domain (and mixed-domain) check, which
 * the shared helper renders as the labelled answer suffix.
 */

import { blocksOf, stripCrossDomain, parseCrossDomain, renderCrossDomain, CROSS_DOMAIN_SOURCE } from './shared.mjs';
import { slugify } from '../../naming.mjs';

const INTERVENTION_PATTERN = /intervention [“"]([^”"]+)[”"]/;

/**
 * The stated intervention as the change it applies to one variable of the
 * causal model. Each entry names the variable and the value the intervention
 * fixes, so the consequences are recomputed from the model instead of being
 * read from the printed wording.
 */
const INTERVENTION_FORMS = Object.freeze([
  Object.freeze({ variable: 'gate', closed: true, pattern: /close (?:the )?gate/ }),
  Object.freeze({ variable: 'gate', closed: false, pattern: /(?:keep|leave) (?:the )?gate open/ }),
  Object.freeze({ variable: 'rain', occurs: false, pattern: /(?:remove|stop) (?:the )?heavy rain/ }),
  Object.freeze({ variable: 'river', occurs: false, pattern: /(?:prevent|block) (?:the )?high river/ }),
  Object.freeze({ variable: 'market', open: true, pattern: /(?:keep|hold) (?:the )?market open/ })
]);

function interventionOf(phrase) {
  const text = String(phrase).toLowerCase();
  const form = INTERVENTION_FORMS.find((candidate) => candidate.pattern.test(text));
  if (form === undefined) {
    throw new Error(`the intervention "${phrase}" is not one of the stated changes`);
  }
  return form;
}

function parse(statement) {
  const blocks = blocksOf(statement);
  const intervention = INTERVENTION_PATTERN.exec(blocks.Task);
  if (intervention === null) {
    throw new Error('the task does not state an intervention to consider');
  }
  return { intervention: intervention[1].trim(), crossDomain: parseCrossDomain(blocks['Given facts']) };
}

/** Recomputes the model with the intervention applied; the other rules stay fixed. */
function recompute(plan) {
  const rain = plan.variable === 'rain' ? plan.occurs : true;
  const river = plan.variable === 'river' ? plan.occurs : rain;
  const gateClosed = plan.variable === 'gate' ? plan.closed : false;
  const flood = river && !gateClosed;
  const marketOpen = plan.variable === 'market' ? true : !flood;
  return { rain, river, gateClosed, flood, marketOpen };
}

/** The verdict: which consequences the recomputed model still generates. */
function verdictOf(state) {
  if (state.flood && state.marketOpen) {
    return 'The square still floods; the market is held open only by the direct intervention.';
  }
  if (state.flood) {
    return 'The original chain remains: flood and market closure occur.';
  }
  if (!state.river) {
    return state.rain
      ? 'Preventing the high river blocks the flood and market closure in this model.'
      : 'Without heavy rain, the model generates neither high river, flood, nor market closure.';
  }
  if (state.gateClosed) {
    return 'With the gate closed, the model no longer implies flooding or market closure.';
  }
  throw new Error('the intervention changes no consequence of the stated model');
}

function solve(slots) {
  const state = recompute(interventionOf(slots.intervention));
  return { ...state, verdict: verdictOf(state), crossDomain: slots.crossDomain };
}

function render(solution) {
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? solution.verdict : `${solution.verdict} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'probe(typeof slots.intervention === "string" && slots.intervention.length > 0, "the task must name one intervention");',
  'const phrase = slots.intervention.toLowerCase();',
  'const forms = [',
  '  { variable: "gate", closed: true, pattern: /close (?:the )?gate/ },',
  '  { variable: "gate", closed: false, pattern: /(?:keep|leave) (?:the )?gate open/ },',
  '  { variable: "rain", occurs: false, pattern: /(?:remove|stop) (?:the )?heavy rain/ },',
  '  { variable: "river", occurs: false, pattern: /(?:prevent|block) (?:the )?high river/ },',
  '  { variable: "market", open: true, pattern: /(?:keep|hold) (?:the )?market open/ }',
  '];',
  'const plan = forms.find((candidate) => candidate.pattern.test(phrase));',
  'probe(plan !== undefined, "the intervention must be one of the stated counterfactual changes");',
  'const rain = plan.variable === "rain" ? plan.occurs : true;',
  'const river = plan.variable === "river" ? plan.occurs : rain;',
  'const gateClosed = plan.variable === "gate" ? plan.closed : false;',
  'const flood = river && !gateClosed;',
  'const marketOpen = plan.variable === "market" ? true : !flood;',
  'probe(flood === (river && !gateClosed), "the flood consequence must follow from the stated rule");',
  'probe((plan.variable !== "river" || river === false) && (plan.variable !== "rain" || river === false), "the intervention must clear the river it addresses");',
  'let verdict;',
  'if (flood && marketOpen) {',
  '  verdict = "The square still floods; the market is held open only by the direct intervention.";',
  '} else if (flood) {',
  '  verdict = "The original chain remains: flood and market closure occur.";',
  '} else if (!river) {',
  '  verdict = rain',
  '    ? "Preventing the high river blocks the flood and market closure in this model."',
  '    : "Without heavy rain, the model generates neither high river, flood, nor market closure.";',
  '} else if (gateClosed) {',
  '  verdict = "With the gate closed, the model no longer implies flooding or market closure.";',
  '} else {',
  '  throw new Error("the intervention changes no consequence of the stated model");',
  '}',
  'probe(typeof verdict === "string" && verdict.length > 0, "the recomputed model must yield a verdict");',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? verdict : verdict + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  const state = solution;
  const steps = [
    `The actual facts are a heavy rain and an unclosed gate, which the stated rules turn into a high river, a flood of the square, and a market closure.`,
    `The intervention "${slots.intervention}" sets exactly that one condition and leaves every other rule in place, so the recomputation starts from the actual chain.`
  ];
  if (state.flood && state.marketOpen) {
    steps.push('The flood still follows from the untouched upstream causes, so the only change is at the market itself, which is held open by the intervention and not by the rules.');
  } else if (state.flood) {
    steps.push('The intervention does not remove any link of the chain, so the high river, the flood, and the market closure all still follow.');
  } else if (!state.river) {
    steps.push(
      state.rain
        ? 'The high river itself is fixed to be prevented, so the flood rule loses its first condition even though the rain still occurs, and neither the flood nor the closure follows.'
        : 'Without the heavy rain the first rule generates no high river, so neither the flood nor the market closure follows.'
    );
  } else {
    steps.push('The gate is closed, so the flood rule loses its unclosed-gate condition; the high river still follows from the rain, but neither the flood nor the market closure follows.');
  }
  steps.push('The answer therefore names the consequences the recomputed model still generates, not the causes that were held fixed.');
  return steps;
}

function caseFor(grade) {
  const template = `Counterfactual reasoning (grade ${grade})`;
  return {
    template,
    type: slugify(template),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  };
}

export const unit = 'N17';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
