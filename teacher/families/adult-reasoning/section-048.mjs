/**
 * Section 48 of the adult-reasoning course: rent, repairs, and inventory.
 *
 * Every variant posts the same lease split at a district (small repairs such as
 * a bulb, a trap, or a lock fall on the tenant; structure such as the roof or a
 * buried pipe falls on the landlord; the move-in inventory lists the chairs, the
 * table, and the stains; a missing chair is charged against the deposit; a
 * structural defect must be notified within 48 h) and then reports a burst
 * buried pipe with its notice delay and a move-out with one chair missing and
 * one bulb burnt. The verdict assigns the pipe to the landlord because a buried
 * pipe is structure and the notice arrived inside the window, the burnt bulb to
 * the tenant as a small repair, and the missing chair as the per-chair charge
 * taken from the deposit. The cases vary the landlord, the tenant, the
 * district, and the notice delay, so every clause is derived from the parsed
 * lease and inventory numbers.
 */

import { slugify } from '../../naming.mjs';

const LEASE_PATTERN =
  /Lease, landlord ([A-Z][a-z]+), tenant ([A-Z][a-z]+), ([^:]+): small repairs \(bulb, trap, lock\) = tenant\. Structure \(roof, buried pipe\) = landlord\./;
const INVENTORY_PATTERN = /Inventory: (\d+) chairs?, (\d+) tables?, (\d+) stains?\./;
const CHARGE_PATTERN = /Missing chair = (\d+) from the (\d+) deposit\./;
const LIMIT_PATTERN = /Structural damage notified within (\d+) h\./;
const INCIDENT_PATTERN = /A buried pipe bursts, notice in (\d+) h\./;
const LEAVING_PATTERN = /On leaving: (one|two|three) chairs? missing, (one|two|three) bulbs? burnt\./;

const COUNT_WORDS = { one: 1, two: 2, three: 3 };

function parse(statement) {
  const lease = LEASE_PATTERN.exec(statement);
  const inventory = INVENTORY_PATTERN.exec(statement);
  const charge = CHARGE_PATTERN.exec(statement);
  const limit = LIMIT_PATTERN.exec(statement);
  const incident = INCIDENT_PATTERN.exec(statement);
  const leaving = LEAVING_PATTERN.exec(statement);
  if (
    lease === null ||
    inventory === null ||
    charge === null ||
    limit === null ||
    incident === null ||
    leaving === null
  ) {
    throw new Error('the statement does not carry the lease, the inventory, and the move-out report');
  }
  return {
    landlord: lease[1],
    tenant: lease[2],
    district: lease[3],
    chairsInInventory: Number(inventory[1]),
    tablesInInventory: Number(inventory[2]),
    stainsInInventory: Number(inventory[3]),
    chargePerChair: Number(charge[1]),
    deposit: Number(charge[2]),
    noticeLimitHours: Number(limit[1]),
    noticeHours: Number(incident[1]),
    missingChairs: COUNT_WORDS[leaving[1]],
    burntBulbs: COUNT_WORDS[leaving[2]]
  };
}

function solve(slots) {
  if (slots.landlord === slots.tenant) {
    throw new Error('the lease must name two different parties');
  }
  if (slots.missingChairs < 1 || slots.missingChairs > slots.chairsInInventory) {
    throw new Error('the move-out report must account for chairs that were listed in the inventory');
  }
  if (slots.burntBulbs < 1) {
    throw new Error('the move-out report must name a burnt bulb for the tenant to replace');
  }
  const notice = slots.noticeHours <= slots.noticeLimitHours ? 'notice ok' : 'notice late';
  const chairCharge = slots.missingChairs * slots.chargePerChair;
  if (chairCharge > slots.deposit) {
    throw new Error('the missing-chair charge must fit inside the deposit');
  }
  return {
    pipe: `Pipe: ${slots.landlord} (structure, ${notice}).`,
    bulb: `Bulb: ${slots.tenant}.`,
    chair: `Chair: ${chairCharge} from the deposit.`
  };
}

function render(solution) {
  return `${solution.pipe} ${solution.bulb} ${solution.chair}`;
}

const COMPUTE = [
  'const slots = $slots;',
  'const notice = slots.noticeHours <= slots.noticeLimitHours ? "notice ok" : "notice late";',
  'const chairCharge = slots.missingChairs * slots.chargePerChair;',
  'probe(chairCharge <= slots.deposit, "the missing-chair charge must fit inside the deposit");',
  'return "Pipe: " + slots.landlord + " (structure, " + notice + "). Bulb: " + slots.tenant + ". Chair: " + chairCharge + " from the deposit.";'
].join('\n');

function explain(slots, solution) {
  return [
    `A buried pipe is structure under the lease of the ${slots.district} flat, so the repair falls on the landlord ${slots.landlord}, and the notice of ${slots.noticeHours} h arrived inside the ${slots.noticeLimitHours} h window.`,
    `A bulb is one of the small repairs the tenant ${slots.tenant} carries, so the ${slots.burntBulbs} burnt bulb is charged to the tenant whatever the amount.`,
    `The inventory listed ${slots.chairsInInventory} chairs and the move-out reports ${slots.missingChairs} missing, so the charge is ${slots.missingChairs} × ${slots.chargePerChair} = ${slots.missingChairs * slots.chargePerChair}, taken from the ${slots.deposit} deposit.`
  ];
}

export const unit = 48;

export const cases = [
  {
    template: 'Rent, repairs, and inventory',
    type: slugify('Rent, repairs, and inventory'),
    category: 'no-knowledge',
    parse,
    solve,
    render,
    compute: COMPUTE,
    explain
  }
];
