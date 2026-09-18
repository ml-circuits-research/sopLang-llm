/**
 * Section 46 of the logical-reasoning book: necessary versus sufficient cause.
 *
 * Every case prints a drill card in a named place that lists the three pieces a
 * fire needs, one struck trigger beside a damp piece and a box short of
 * airflow, and three readers: one calls the trigger sufficient because it is
 * said to "cause fire," one says the card named a cluster, one calls a missing
 * piece irrelevant while the trigger is present. The case data changes the place
 * and the names; the reasoning is fixed: a card that lists a cluster shows one
 * factor, and necessary pieces of a cluster are not each sufficient. The family
 * reads the trigger and the cluster and renders the printed verdict with the
 * trigger the three sentences share.
 */

import { slugify } from '../../naming.mjs';

const TEMPLATE = 'Necessary versus sufficient cause';

const DRILL_PATTERN =
  /Drill card in ([A-Z][A-Za-z ]+): a listed fire needs ([a-z]+), ([a-z]+), and ([a-z]+)\. A ([a-z]+) is struck beside damp ([a-z]+) in a closed box with little listed ([a-z]+)\. ([A-Z][a-z]+) says the ([a-z]+) must be sufficient because ([a-z]+) “cause fire\.” ([A-Z][a-z]+) says the card named a cluster\. ([A-Z][a-z]+) says ([a-z]+) is irrelevant if a ([a-z]+) is present\./;

function article(word) {
  const opening = /^[aeiou]/.test(word) ? 'An' : 'A';
  return `${opening} ${word}`;
}

function parse(statement) {
  const drill = DRILL_PATTERN.exec(statement);
  if (drill === null) {
    throw new Error('the statement does not print the drill card with its three readings');
  }
  return {
    place: drill[1],
    cluster: [drill[2], drill[3], drill[4]],
    trigger: drill[5],
    damp: drill[6],
    withheld: drill[7],
    sufficiencySpeaker: drill[8],
    claimedFactor: drill[9],
    triggerPlural: drill[10],
    clusterSpeaker: drill[11],
    irrelevanceSpeaker: drill[12],
    missingFactor: drill[13],
    triggerPresent: drill[14]
  };
}

function solve(slots) {
  if (slots.claimedFactor !== slots.trigger || slots.triggerPresent !== slots.trigger) {
    throw new Error('the three readings must talk about the same struck trigger');
  }
  if (slots.triggerPlural !== `${slots.trigger}es`) {
    throw new Error('the plural the sufficiency reading quotes must be the trigger’s plural');
  }
  if (slots.cluster.length !== 3 || new Set(slots.cluster).size !== 3) {
    throw new Error('the card must list three different pieces a fire needs');
  }
  if (!slots.cluster.includes(slots.missingFactor) || !slots.cluster.includes(slots.damp)) {
    throw new Error('the pieces the card names as damp or withheld must be listed pieces');
  }
  if (slots.cluster.includes(slots.trigger)) {
    throw new Error('the struck trigger must not be one of the listed pieces');
  }
  const speakers = [slots.sufficiencySpeaker, slots.clusterSpeaker, slots.irrelevanceSpeaker];
  if (new Set(speakers).size !== speakers.length) {
    throw new Error('the three readings must come from three different speakers');
  }
  return { trigger: slots.trigger, cluster: slots.cluster };
}

function render(solution) {
  return `No. The card listed a cluster. ${article(solution.trigger)} is one factor. Necessary pieces of a cluster are not each sufficient.`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.place === "string" && slots.place.length > 0, "the case must name the place of the drill card");',
  'probe(typeof slots.trigger === "string" && slots.trigger.length > 0, "the case must name the struck trigger");',
  'probe(slots.claimedFactor === slots.trigger && slots.triggerPresent === slots.trigger, "the three readings must talk about the same struck trigger");',
  'probe(slots.triggerPlural === slots.trigger + "es", "the plural the sufficiency reading quotes must be the trigger plural");',
  'const cluster = slots.cluster;',
  'probe(Array.isArray(cluster) && cluster.length === 3 && new Set(cluster).size === 3, "the card must list three different pieces a fire needs");',
  'probe(cluster.indexOf(slots.missingFactor) >= 0 && cluster.indexOf(slots.damp) >= 0, "the pieces the card names as damp or withheld must be listed pieces");',
  'probe(cluster.indexOf(slots.trigger) < 0, "the struck trigger must not be one of the listed pieces");',
  'return "No. The card listed a cluster. " + (/^[aeiou]/.test(slots.trigger) ? "An " : "A ") + slots.trigger + " is one factor. Necessary pieces of a cluster are not each sufficient.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The card in ${slots.place} lists the pieces a fire needs as ${solution.cluster.join(', ')}, so it names a cluster rather than one maker of fire.`,
    `${slots.sufficiencySpeaker} calls the ${solution.trigger} sufficient because ${slots.triggerPlural} are said to “cause fire,” but sufficiency would mean this ${solution.trigger} alone, here, is enough.`,
    `${slots.irrelevanceSpeaker} drops ${slots.missingFactor} while the ${solution.trigger} is present, yet little listed airflow is on the page; the question to ask is what else had to be in the room.`
  ];
}

export const unit = 46;

export const cases = [
  {
    template: TEMPLATE,
    type: slugify(TEMPLATE),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
