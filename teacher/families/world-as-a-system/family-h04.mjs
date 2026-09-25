/**
 * Family H4 of the world seed book: conflicting sources.
 *
 * Every problem confronts three sources over one claim: two of them are close
 * to the event and independent (a contemporary record and a separate
 * operational register), and one is late or derivative (copied years later from
 * an unknown account, or a later textbook). The printed verdict names the
 * account the two sound sources support and, in the cart-count variants, also
 * names the unsupported figure. The verdict is derived here from the comparison
 * the rules state - proximity to the event, independence, and a mechanism to
 * record the fact - and never read off the printed answer.
 *
 * The appraisal has two printed shapes: when the two sound sources agree on a
 * named day the answer states that day, and when they report two nearby counts
 * the answer states the count range and the outlier. Grades 2-4 append a
 * cross-domain check (grade 2 and 4 also a mixed-domain map-sheet count), which
 * the family renders as the labelled answer suffix.
 */

import {
  blocksOf,
  stripCrossDomain,
  parseCrossDomain,
  renderCrossDomain,
  CROSS_DOMAIN_SOURCE
} from './shared.mjs';
import { slugify } from '../../naming.mjs';

const PANEL_PATTERN = /Source ([A-C]), ([^.]*?), (?:says|begins charging on) ([^.]*?)\./g;
const REGISTER_PATTERN = /Source ([A-C]) is ([^.]*?) and lists ([^.]*?)\./g;
const COUNTED_PATTERN = /(\d+)\s+([a-z]+)/;
const DAY_PATTERN = /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/;

/** A source is sound when it is near the event and independent of the others. */
const SOUND_SOURCE_PATTERN = /independent|on the day|eyewitness/;

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const sources = [];
  for (const pattern of [PANEL_PATTERN, REGISTER_PATTERN]) {
    for (const match of facts.matchAll(pattern)) {
      sources.push({
        index: match.index,
        label: match[1],
        description: match[2].trim(),
        claim: match[3].trim()
      });
    }
  }
  sources.sort((left, right) => left.index - right.index);
  if (sources.length !== 3) {
    throw new Error('the statement must confront exactly three sources');
  }
  return {
    sources: sources.map(({ label, description, claim }) => ({ label, description, claim })),
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function isSound(source) {
  return SOUND_SOURCE_PATTERN.test(source.description);
}

/** The value a source asserts: a counted quantity, or a named day. */
function valueOf(claim) {
  const counted = COUNTED_PATTERN.exec(claim);
  if (counted !== null) {
    return { text: counted[1], number: Number(counted[1]), unit: counted[2] };
  }
  const day = DAY_PATTERN.exec(claim);
  if (day !== null) {
    return { text: day[1], number: null, unit: null };
  }
  return null;
}

function solve(slots) {
  const sound = slots.sources.filter((source) => isSound(source));
  const derivative = slots.sources.filter((source) => !isSound(source));
  if (sound.length !== 2 || derivative.length !== 1) {
    throw new Error('exactly two sound sources and one late or derivative account must be stated');
  }
  const values = sound.map((source) => valueOf(source.claim));
  if (values.some((value) => value === null)) {
    throw new Error('every sound source must state a comparable value');
  }
  const outlier = valueOf(derivative[0].claim);
  if (outlier === null) {
    throw new Error('the derivative account must state a value to compare against');
  }
  const texts = values.map((value) => value.text);
  const crossDomain = slots.crossDomain;
  if (texts.every((text) => text === texts[0])) {
    if (outlier.text === texts[0]) {
      throw new Error('the accounts do not conflict on this value');
    }
    return { kind: 'agreed', value: texts[0], outlier: outlier.text, crossDomain };
  }
  if (values.every((value) => value.number !== null) && outlier.number !== null) {
    const numbers = values.map((value) => value.number);
    const low = Math.min(...numbers);
    const high = Math.max(...numbers);
    if (outlier.number >= low && outlier.number <= high) {
      throw new Error('the derivative account does not conflict with the corroborated range');
    }
    return { kind: 'range', low, high, unit: values[0].unit, outlier: outlier.number, crossDomain };
  }
  throw new Error('the two sound sources state values that cannot be compared');
}

function render(solution) {
  const main = solution.kind === 'range'
    ? `An arrival count near ${solution.low}\u2013${solution.high} ${solution.unit} is better supported than ${solution.outlier}.`
    : `${solution.value} is better supported, while remaining a historical conclusion rather than absolute proof.`;
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'const isSound = (source) => /independent|on the day|eyewitness/.test(source.description);',
  'const sound = slots.sources.filter(isSound);',
  'probe(sound.length === 2, "two sources must be close to the event and independent");',
  'const derivative = slots.sources.filter((source) => !isSound(source));',
  'probe(derivative.length === 1, "one source must be the late or derivative account");',
  'const valueOf = (claim) => {',
  '  const counted = /(\\d+)\\s+([a-z]+)/.exec(claim);',
  '  if (counted !== null) {',
  '    return { text: counted[1], number: Number(counted[1]), unit: counted[2] };',
  '  }',
  '  const day = /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/.exec(claim);',
  '  return day === null ? null : { text: day[1], number: null, unit: null };',
  '};',
  'const values = sound.map((source) => valueOf(source.claim));',
  'const outlier = valueOf(derivative[0].claim);',
  'const texts = values.map((value) => value.text);',
  'let main;',
  'if (texts.every((text) => text === texts[0])) {',
  '  main = texts[0] + " is better supported, while remaining a historical conclusion rather than absolute proof.";',
  '} else {',
  '  const numbers = values.map((value) => value.number);',
  '  const low = Math.min.apply(null, numbers);',
  '  const high = Math.max.apply(null, numbers);',
  '  main = "An arrival count near " + low + "\\u2013" + high + " " + values[0].unit + " is better supported than " + outlier.number + ".";',
  '}',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  const labels = slots.sources.map((source) => source.label).join(', ');
  const sound = slots.sources.filter((source) => isSound(source));
  return [
    `Sources ${labels} are stated, and ${sound.map((source) => source.label).join(' and ')} are the two that are close to the event and independent.`,
    solution.kind === 'range'
      ? `Those two report ${solution.low} and ${solution.high}, a cluster of nearby counts, while the remaining account reports ${solution.outlier}.`
      : `Those two independently name ${solution.value}, while the remaining account names ${solution.outlier}.`,
    'The late or derivative account has no independent chain of transmission, so agreement between two proximate independent sources outweighs it.',
    solution.kind === 'range'
      ? `The evidence therefore supports an arrival count near ${solution.low}\u2013${solution.high} rather than ${solution.outlier}.`
      : `The evidence therefore supports ${solution.value}, though two agreeing sources still give a historical conclusion rather than absolute proof.`
  ];
}

function caseFor(grade) {
  const template = `Conflicting sources (grade ${grade})`;
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

export const unit = 'H4';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
