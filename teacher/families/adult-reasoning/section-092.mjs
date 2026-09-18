/**
 * Section 92 of the adult-reasoning course: correlation, cause, and coincidence.
 *
 * Every variant reports two series that rise together in one place — ice cream
 * sold and insect bites — has one person read that as ice cream causing bites,
 * and hands the same notebook rule: two series that rise together may have a
 * third cause, and without a mechanism from the text the cause is not declared.
 * The text itself names the possible common cause (the hot months) and never
 * supplies an ice-cream→insects mechanism, so the verdict refuses the causal
 * reading. The variants change the place and the name, so the family derives
 * the common-cause clause, the outcome, and the missing-mechanism clause from
 * the parsed values.
 */

import { slugify } from '../../naming.mjs';

const SERIES_PATTERN = /In months with more ice cream sold in (.+?) there are also more insect bites\./;
const CLAIM_PATTERN = /([A-Z][a-z]+): [“"]Ice cream causes bites[”"]\./;
const CAUSE_PATTERN = /The text also says [“"]([^”"]+)[”"]\./;
const OUTCOME_PATTERN = /more ([a-z]+) bites/;
const STATED_MECHANISM_PATTERN = /\bice cream (?:attracts|drives|produces|carries|leads to)\b/i;

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function parse(statement) {
  const series = SERIES_PATTERN.exec(statement);
  const claim = CLAIM_PATTERN.exec(statement);
  const cause = CAUSE_PATTERN.exec(statement);
  const outcome = OUTCOME_PATTERN.exec(statement);
  if (series === null || claim === null || cause === null || outcome === null) {
    throw new Error(
      'the statement does not carry the two rising series, the person’s claim, and the common cause the text names'
    );
  }
  if (!/two series that rise together may have a third cause/.test(statement)) {
    throw new Error('the statement does not carry the notebook rule on third causes');
  }
  const noun = outcome[1];
  return {
    place: series[1].trim(),
    author: claim[1],
    outcome: noun.endsWith('s') ? noun : `${noun}s`,
    commonCause: cause[1].trim(),
    mechanismStated: STATED_MECHANISM_PATTERN.test(statement)
  };
}

function solve(slots) {
  const commonCauseClause =
    slots.commonCause === ''
      ? 'No third cause is named in the text.'
      : `${capitalize(slots.commonCause)} are a possible common cause, present in the text.`;
  const mechanismClause = slots.mechanismStated
    ? `The ice-cream→${slots.outcome} mechanism is stated in the text.`
    : `The ice-cream→${slots.outcome} mechanism is missing.`;
  return { commonCauseClause, mechanismClause };
}

function render(solution) {
  return `${solution.commonCauseClause} ${solution.mechanismClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots === "object" && slots !== null, "the correlation case must carry its parsed values");',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the two series must be located in a named place");',
  'probe(typeof slots.author === "string" && slots.author.length > 0, "the person drawing the conclusion must be named");',
  'probe(typeof slots.outcome === "string" && slots.outcome.length > 0, "the outcome series must be named");',
  'probe(typeof slots.commonCause === "string" && slots.commonCause.length > 0, "the text must name the possible common cause");',
  'probe(slots.mechanismStated === false, "the stem supplies no ice-cream mechanism, so the conclusion stays unauthorised");',
  'const capitalized = slots.commonCause.charAt(0).toUpperCase() + slots.commonCause.slice(1);',
  'const commonCauseClause = capitalized + " are a possible common cause, present in the text.";',
  'const mechanismClause = slots.mechanismStated',
  '  ? "The ice-cream→" + slots.outcome + " mechanism is stated in the text."',
  '  : "The ice-cream→" + slots.outcome + " mechanism is missing.";',
  'const answer = commonCauseClause + " " + mechanismClause;',
  'return answer;'
].join('\n');

function explain(slots) {
  return [
    `The two series — ice cream sold in ${slots.place} and ${slots.outcome} bites — rise in the same months, and ${slots.author} reads that co-movement as ice cream causing the bites.`,
    `The notebook refuses that step because two series that rise together may share a third cause, and ${slots.commonCause} is exactly such a candidate: the text names it and it can lift both series at once.`,
    `What is missing is the mechanism that would run from ice cream to ${slots.outcome}, and the text never supplies it, so the correlation stays a correlation and the causal conclusion is unauthorised.`
  ];
}

export const unit = 92;

export const cases = [
  {
    template: 'Correlation, cause, and coincidence',
    type: slugify('Correlation, cause, and coincidence'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
