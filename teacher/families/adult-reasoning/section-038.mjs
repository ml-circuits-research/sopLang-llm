/**
 * Section 38 of the adult-reasoning course: domestic emergency guides.
 *
 * Every variant quotes the same earthquake guide for a block in some place:
 * during the shaking, away from windows and to an inner wall or solid table,
 * no lift, no window jump; after it, check the gas if there is a smell, use
 * the stairs, take water and the ID from the drawer by the door when it is to
 * hand, phone only if hurt, and meet at a named point outside. The described
 * resident is at a window on an upper floor, runs to the lift with the phone,
 * leaves the ID, and heads to a shop to watch the news. The verdict separates
 * the two phases of the guide and names each breach; the cases change the
 * place, the resident, and the meeting point.
 */

import { slugify } from '../../naming.mjs';

const GUIDE_PATTERN = /Earthquake guide for a block in ([^:]+):/;
const ROUTE_PATTERN =
  /The building shakes\. ([A-Z][a-z]+), (\d+)(?:st|nd|rd|th) floor by a window, runs to the lift with the phone, leaves the ID, goes to a shop/;
const MEETING_PATTERN = /meeting point: (the [a-z]+)/;

const GUIDE_CLAUSES = [
  'away from windows, inner wall or solid table',
  'no lift',
  'no window jump',
  'stairs',
  'water + ID from the drawer by the door if to hand',
  'phone only if you are hurt'
];

function parse(statement) {
  const guide = GUIDE_PATTERN.exec(statement);
  const route = ROUTE_PATTERN.exec(statement);
  const meeting = MEETING_PATTERN.exec(statement);
  if (guide === null || route === null || meeting === null) {
    throw new Error('the statement does not carry the guide, the described route, and the meeting point');
  }
  for (const clause of GUIDE_CLAUSES) {
    if (!statement.includes(clause)) {
      throw new Error(`the quoted guide does not state "${clause}"`);
    }
  }
  return {
    place: guide[1].trim(),
    resident: route[1],
    floor: Number(route[2]),
    meetingPoint: meeting[1],
    byWindow: /by a window/.test(statement),
    takesLift: /runs to the lift/.test(statement),
    usesPhone: /with the phone/.test(statement),
    leavesId: /leaves the ID/.test(statement),
    goesToShop: /goes to a shop/.test(statement)
  };
}

function solve(slots) {
  const breaches = [];
  if (slots.byWindow) {
    breaches.push('not window');
  }
  if (slots.takesLift) {
    breaches.push('not lift');
  }
  if (slots.usesPhone) {
    breaches.push('not a panic call');
  }
  if (breaches.length !== 3) {
    throw new Error('the described route does not breach the window, the lift, and the panic call together');
  }
  const phase1 = ['wall/table', ...breaches].join(', ');
  const phase2 = ['stairs', slots.leavesId ? 'ID if by the door' : 'ID if to hand', slots.meetingPoint].join(', ');
  if (!slots.goesToShop) {
    throw new Error('the described route does not end away from the meeting point');
  }
  return { phase1, phase2, shopClause: 'The shop is not the point.' };
}

function render(solution) {
  return `Phase 1: ${solution.phase1}. Phase 2: ${solution.phase2}. ${solution.shopClause}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const breaches = [];',
  'if (slots.byWindow) { breaches.push("not window"); }',
  'if (slots.takesLift) { breaches.push("not lift"); }',
  'if (slots.usesPhone) { breaches.push("not a panic call"); }',
  'probe(breaches.length === 3, "the route must break the window, the lift, and the panic call rules");',
  'const phase1 = ["wall/table"].concat(breaches).join(", ");',
  'const phase2 = ["stairs", slots.leavesId ? "ID if by the door" : "ID if to hand", slots.meetingPoint].join(", ");',
  'const answer = "Phase 1: " + phase1 + ". Phase 2: " + phase2 + ". The shop is not the point.";',
  'return answer;'
].join('\n');

function explain(slots, solution) {
  return [
    `The guide has two phases: ${slots.resident} is still inside the first one while the building shakes, so ${slots.byWindow ? 'standing by the window' : 'standing away from the windows'} and ${slots.takesLift ? 'taking the lift' : 'taking the stairs'} already leave the rule behind.`,
    `The phone belongs to the aftermath and only if ${slots.resident} is hurt, so ${slots.usesPhone ? 'carrying it to the lift is a breach' : 'leaving it unused is right'}; the ID counts only when it is to hand at the drawer by the door.`,
    `The second phase ends at ${slots.meetingPoint} outside the block in ${slots.place}, and ${slots.goesToShop ? 'the shop detour is not that meeting point' : 'the route ends at the meeting point'}.`
  ];
}

export const unit = 38;

export const cases = [
  {
    template: 'Domestic emergency guides',
    type: slugify('Domestic emergency guides'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
