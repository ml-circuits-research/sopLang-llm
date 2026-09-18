/**
 * Section 56 of the logical-reasoning book: a machine that stops.
 *
 * Every case prints a pump in a named place that stops, two listed signs (the
 * socket lamp is lit and the reset button is out), the manual’s first branch
 * for exactly those signs, and three speakers: one calls a fitter at once and
 * invents a burnt motor, one presses reset, and one says manuals are for
 * cowards. The case data changes the place and the three names; the reasoning
 * is fixed: the reset is the listed cheap test that fits the listed signs,
 * while a burnt motor is an extra engine the page does not list.
 */

import { slugify } from '../../naming.mjs';

const STATEMENT_PATTERN =
  /Pump in ([A-Z][a-z]+(?: [A-Z][a-z]+)*) stops\. Listed: power lamp on the wall socket is lit; reset button on the pump is out\. Manual: “If socket lamp is lit and reset is out, press reset before calling a fitter\.” ([A-Z][a-z]+) calls a fitter at once and invents a burnt motor\. ([A-Z][a-z]+) presses reset\. ([A-Z][a-z]+) says manuals are for cowards\.\s*Question\. What does the best-first explanation recommend\?/;

function parse(statement) {
  const matched = STATEMENT_PATTERN.exec(statement);
  if (matched === null) {
    throw new Error('the statement does not record the stopped pump, the listed signs, and the three speakers');
  }
  return {
    place: matched[1],
    fitter: matched[2],
    reset: matched[3],
    sceptic: matched[4]
  };
}

function solve(slots) {
  const speakers = [slots.fitter, slots.reset, slots.sceptic];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the three speakers must be different people');
  }
  return { place: slots.place, reset: slots.reset };
}

function render(solution) {
  return 'Try the reset. It is the listed cheap test that fits the listed signs. A burnt motor is an extra engine.';
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the stopped pump");',
  'probe(typeof slots.fitter === "string" && slots.fitter.length > 0, "the case must name the speaker who calls the fitter");',
  'probe(typeof slots.reset === "string" && slots.reset.length > 0, "the case must name the speaker who presses reset");',
  'probe(typeof slots.sceptic === "string" && slots.sceptic.length > 0, "the case must name the speaker who dismisses the manual");',
  'probe(slots.fitter !== slots.reset && slots.fitter !== slots.sceptic && slots.reset !== slots.sceptic, "the three speakers must be different people");',
  'return "Try the reset. It is the listed cheap test that fits the listed signs. A burnt motor is an extra engine.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The pump in ${slots.place} stops with the socket lamp lit and the reset button out, which is exactly the manual’s first branch.`,
    `That branch says to press reset before calling a fitter, and pressing reset is the cheap listed test.`,
    `${slots.fitter} skips the test and invents a burnt motor, an engine the listed signs do not carry.`,
    `${slots.sceptic} dismisses the manual, but the best-first explanation follows it, so the reset comes first.`
  ];
}

export const unit = 56;

export const cases = [
  {
    template: 'A machine that stops',
    type: slugify('A machine that stops'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
