/**
 * Family N14 of the world seed book: provenance and chain of custody.
 *
 * Every problem lists the custody record of an object as dated handoffs
 * ("found by Excavator on day 1; transferred to Museum A on day 2; sent from
 * Museum A to Research Lab on day 5 ...") and, in some variants, adds that one
 * record names only one side of its handoff. The answer checks the chain in
 * time order: every handoff must connect the previous holder to the next, and a
 * handoff that names only a sender or only a receiver is a gap.
 *
 * The four grades share one computation; grades 1 to 4 append cross-domain
 * checks in some variants, which the family renders as the labelled answer
 * suffix through the shared `renderCrossDomain`.
 */

import { slugify } from '../../naming.mjs';
import {
  blocksOf,
  stripCrossDomain,
  parseCrossDomain,
  renderCrossDomain,
  CROSS_DOMAIN_SOURCE
} from './shared.mjs';

const RECORD_PATTERN = /An artifact record states:\s*([\s\S]*?)\.\s*Every transfer/;
const MISSING_SENDER_PATTERN = /The record for day (\d+) names (.+?) as receiver but does not name the sender/;
const MISSING_RECEIVER_PATTERN = /The record for day (\d+) names (.+?) as sender but does not name the receiver/;

/** One dated entry of the record, as sender/receiver or as the initial find. */
function stepOf(entry) {
  const text = entry.trim();
  const day = /on day (\d+)/.exec(text);
  if (day === null) {
    throw new Error(`the record entry "${text}" states no day`);
  }
  const number = Number(day[1]);
  const found = /^found by (.+?) on day \d+$/.exec(text);
  if (found !== null) {
    return { day: number, kind: 'found', holder: found[1], sender: null, receiver: null };
  }
  const both = /^\w+ (?:from|by) (.+?) to (.+?) on day \d+$/.exec(text);
  if (both !== null) {
    return { day: number, kind: 'transfer', holder: null, sender: both[1], receiver: both[2] };
  }
  const receiverOnly = /^\w+ to (.+?) on day \d+$/.exec(text);
  if (receiverOnly !== null) {
    return { day: number, kind: 'transfer', holder: null, sender: null, receiver: receiverOnly[1] };
  }
  const senderOnly = /^\w+ (?:from|by) (.+?) on day \d+$/.exec(text);
  if (senderOnly !== null) {
    return { day: number, kind: 'transfer', holder: null, sender: senderOnly[1], receiver: null };
  }
  throw new Error(`the record entry "${text}" does not describe a handoff`);
}

function parse(statement) {
  const blocks = blocksOf(statement);
  const facts = stripCrossDomain(blocks['Given facts']);
  const record = RECORD_PATTERN.exec(facts);
  if (record === null) {
    throw new Error('the statement does not state an artifact record');
  }
  const steps = record[1].split(';').map(stepOf);
  if (steps.length === 0) {
    throw new Error('the artifact record states no handoff');
  }
  const missingSender = MISSING_SENDER_PATTERN.exec(facts);
  const missingReceiver = MISSING_RECEIVER_PATTERN.exec(facts);
  const statedGap = missingSender !== null
    ? { day: Number(missingSender[1]), kind: 'sender' }
    : missingReceiver !== null
      ? { day: Number(missingReceiver[1]), kind: 'receiver' }
      : null;
  return {
    steps,
    statedGap,
    crossDomain: parseCrossDomain(blocks['Given facts'])
  };
}

function solve(slots) {
  // Walk the handoffs in day order. The first handoff is the find; every later
  // transfer must carry a receiver and, when it names a sender, must name the
  // holder the previous handoff left behind.
  const ordered = [...slots.steps].sort((left, right) => left.day - right.day);
  let holder = null;
  let gap = slots.statedGap;
  for (const step of ordered) {
    if (step.kind === 'found') {
      holder = step.holder;
      continue;
    }
    if (step.receiver === null) {
      gap = gap ?? { day: step.day, kind: 'receiver' };
      continue;
    }
    if (step.sender !== null && holder !== null && step.sender !== holder) {
      gap = gap ?? { day: step.day, kind: 'link' };
    }
    holder = step.receiver;
  }
  return { complete: gap === null, gap, crossDomain: slots.crossDomain };
}

function render(solution) {
  let main;
  if (solution.complete) {
    main = 'The chain is complete under the stated rule.';
  } else if (solution.gap.kind === 'link') {
    main = `The chain is incomplete because the day-${solution.gap.day} handoff does not connect to the previous holder.`;
  } else {
    main = `The chain is incomplete because the day-${solution.gap.day} ${solution.gap.kind} is missing.`;
  }
  const suffix = renderCrossDomain(solution.crossDomain);
  return suffix === '' ? main : `${main} ${suffix}`;
}

const COMPUTE = [
  CROSS_DOMAIN_SOURCE,
  'const slots = $slots;',
  'const ordered = [...slots.steps].sort((left, right) => left.day - right.day);',
  'let holder = null;',
  'let gap = slots.statedGap || null;',
  'for (const step of ordered) {',
  '  if (step.kind === "found") {',
  '    holder = step.holder;',
  '    continue;',
  '  }',
  '  if (step.receiver === null) {',
  '    gap = gap || { day: step.day, kind: "receiver" };',
  '    continue;',
  '  }',
  '  if (step.sender !== null && holder !== null && step.sender !== holder) {',
  '    gap = gap || { day: step.day, kind: "link" };',
  '  }',
  '  holder = step.receiver;',
  '}',
  'const main = gap === null',
  '  ? "The chain is complete under the stated rule."',
  '  : gap.kind === "link"',
  '    ? "The chain is incomplete because the day-" + gap.day + " handoff does not connect to the previous holder."',
  '    : "The chain is incomplete because the day-" + gap.day + " " + gap.kind + " is missing.";',
  'const suffix = renderCrossDomain(slots.crossDomain);',
  'return suffix === "" ? main : main + " " + suffix;'
].join('\n');

function explain(slots, solution) {
  const ordered = [...slots.steps].sort((left, right) => left.day - right.day);
  const transfers = ordered.filter((step) => step.kind === 'transfer');
  return [
    `Read the ${ordered.length} dated record entries and order them by day.`,
    `Follow the object through its ${transfers.length} handoffs, checking that each handoff leaves the object with the holder the next one starts from.`,
    solution.complete
      ? 'Every handoff names both sides and connects to the previous holder, so the chain is continuous.'
      : `The day-${solution.gap.day} record fails the rule, so the chain has a gap that limits certainty.`,
    'The appended check, when present, is a separate arithmetic question answered in the labelled suffix.'
  ];
}

function caseFor(grade) {
  const template = `Provenance and chain of custody (grade ${grade})`;
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

export const unit = 'N14';

export const cases = [caseFor(1), caseFor(2), caseFor(3), caseFor(4)];
