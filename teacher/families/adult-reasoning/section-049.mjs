/**
 * Section 49 of the adult-reasoning course: issuing a document from a guide.
 *
 * Every variant posts the same certificate-desk guide at a place (the file is
 * the form, the ID copy, and the proof of the fee paid; a slot lasts 10 min and
 * more than 10 min late means rebooking; the document is issued in 5 working
 * days; only the holder with the original ID may collect) and then describes one
 * applicant who brings the form and the copy but forgets the payment proof,
 * arrives late by 12 min, and wants a relative to collect. The verdict runs the
 * three gates in the order the question asks them: the missing payment proof
 * blocks the file, the lateness beyond the slot forces a rebooking, and the
 * relative cannot collect because collection belongs to the holder alone. The
 * cases vary the place and the applicant, so each clause is built from the
 * parsed fee, slot, and lateness.
 */

import { slugify } from '../../naming.mjs';

const DESK_PATTERN = /Certificate desk, ([^:]+): file = form \+ ID copy \+ proof of (\d+) paid\./;
const SLOT_PATTERN = /Slot (\d+) min\. More than (\d+) min late → rebook\./;
const WORKING_PATTERN = /Issue in (\d+) WORKING days\./;
const HOLDER_PATTERN = /Collection only by the holder with original ID\./;
const APPLICANT_PATTERN =
  /([A-Z][a-z]+) has the form and copy, forgets the (\d+) proof, is (\d+) min late, wants an? ([a-z]+) to collect/;

function parse(statement) {
  const desk = DESK_PATTERN.exec(statement);
  const slot = SLOT_PATTERN.exec(statement);
  const applicant = APPLICANT_PATTERN.exec(statement);
  if (desk === null || slot === null || applicant === null) {
    throw new Error('the statement does not carry the desk guide and the applicant narrative');
  }
  if (!HOLDER_PATTERN.test(statement)) {
    throw new Error('the guide must reserve collection for the holder');
  }
  return {
    place: desk[1],
    fee: Number(desk[2]),
    slotMinutes: Number(slot[1]),
    latenessLimitMinutes: Number(slot[2]),
    workingDays: Number(WORKING_PATTERN.exec(statement)[1]),
    applicant: applicant[1],
    forgottenFee: Number(applicant[2]),
    lateMinutes: Number(applicant[3]),
    collector: applicant[4]
  };
}

function solve(slots) {
  if (slots.forgottenFee !== slots.fee) {
    throw new Error('the forgotten proof must be the proof of the stated fee');
  }
  if (slots.lateMinutes < 0) {
    throw new Error('the lateness must not be negative');
  }
  const proof = 'Payment proof missing.';
  const lateness =
    slots.lateMinutes > slots.latenessLimitMinutes
      ? `${slots.lateMinutes}>${slots.latenessLimitMinutes} → rebook.`
      : `${slots.lateMinutes}<=${slots.latenessLimitMinutes} → keep the slot.`;
  const collection = `The ${slots.collector} is not the holder.`;
  return { proof, lateness, collection };
}

function render(solution) {
  return `${solution.proof} ${solution.lateness} ${solution.collection}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'probe(typeof slots.applicant === "string" && slots.applicant.length > 0, "the case must name the applicant");',
  'probe(typeof slots.collector === "string" && slots.collector.length > 0, "the case must name the person sent to collect");',
  'probe(slots.collector !== slots.applicant, "the person sent to collect must not be the applicant");',
  'probe(Number.isInteger(slots.fee) && slots.fee > 0, "the fee must be a positive whole number");',
  'probe(slots.forgottenFee === slots.fee, "the forgotten proof must be the proof of the stated fee");',
  'probe(Number.isInteger(slots.slotMinutes) && slots.slotMinutes > 0, "the slot must last a positive whole number of minutes");',
  'probe(slots.latenessLimitMinutes === slots.slotMinutes, "the guide must bound lateness by the slot length");',
  'probe(Number.isInteger(slots.lateMinutes) && slots.lateMinutes >= 0, "the lateness must be a whole number of minutes");',
  'probe(Number.isInteger(slots.workingDays) && slots.workingDays > 0, "the issue period must be a positive whole number of working days");',
  'const lateness = slots.lateMinutes > slots.latenessLimitMinutes',
  '  ? slots.lateMinutes + ">" + slots.latenessLimitMinutes + " → rebook."',
  '  : slots.lateMinutes + "<=" + slots.latenessLimitMinutes + " → keep the slot.";',
  'return "Payment proof missing. " + lateness + " The " + slots.collector + " is not the holder.";'
].join('\n');

function explain(slots, solution) {
  return [
    `The guide builds the file from the form, the ID copy, and the proof of ${slots.fee} paid, and ${slots.applicant} arrives with the form and the copy but not with the ${slots.forgottenFee} proof, so the missing payment proof is what blocks the file.`,
    `The slot lasts ${slots.slotMinutes} min and more than that means rebooking; ${slots.lateMinutes} min late is past the limit, so the desk reopens a slot instead of serving the late arrival.`,
    `Collection is reserved for the holder with the original ID, so the ${slots.collector} ${slots.applicant} sends cannot collect even after the ${slots.workingDays} working days the issue takes.`
  ];
}

export const unit = 49;

export const cases = [
  {
    template: 'Issuing a document from a guide',
    type: slugify('Issuing a document from a guide'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
