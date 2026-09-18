/**
 * Families for chapter 35 of the mathematical seed book: mathematical models
 * for phenomena and measurements (temperature as a position on a scale, mass,
 * volume, density, growth and flow rates, mixtures, and levers).
 *
 * Every printed template of this chapter states the rule it uses, including the
 * negative continuation of the temperature scale, the density definition, the
 * proportional shadow model, and the additive volume rule. No case therefore
 * needs a unit convention, formula, calendar fact, or named entity that the
 * statement does not supply, and all families declare `no-knowledge`. A family
 * provides the parse of the statement, an independent computation, the answer
 * text the source prints, the SOP Lang computation body that the circuit
 * executes, and the explanation lines.
 */

export const unit = 35;

function fmt(value) {
  return String(Number(Number(value).toFixed(6)));
}

function requireMatch(statement, pattern, description) {
  const match = statement.match(pattern);
  if (match === null) {
    throw new Error(`could not find ${description}`);
  }
  return match;
}

function gcd(left, right) {
  return right === 0 ? left : gcd(right, left % right);
}

function reducedFraction(part, whole) {
  const divide = gcd(part, whole);
  return `${part / divide}/${whole / divide}`;
}

export const cases = [
  {
    template: 'Temperature as a position on a scale',
    type: 'temperature-as-a-position-on-a-scale',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /temperature is (-?\d+)\s*°C and rises by (\d+)\s*°C/, 'a starting temperature and a rise');
      return { start: Number(match[1]), rise: Number(match[2]) };
    },
    solve(slots) { return { value: slots.start + slots.rise }; },
    render(solution) { return `${fmt(solution.value)}°C.`; },
    compute: [
      'const slots = $slots;',
      'return String(slots.start + slots.rise) + "°C.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The reading starts at ${slots.start}°C, which is the position of the temperature on the scale.`,
        `A rise of ${slots.rise} means that the position moves ${slots.rise} steps upward, so the two values are added.`,
        `The final position is ${solution.value}°C.`
      ];
    }
  },
  {
    template: 'Decrease below zero on a defined scale',
    type: 'decrease-below-zero-on-a-defined-scale',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /temperature is (-?\d+)\s*°C and falls by (\d+)\s*°C/, 'a starting temperature and a fall');
      return { start: Number(match[1]), fall: Number(match[2]) };
    },
    solve(slots) { return { value: slots.start - slots.fall }; },
    render(solution) { return `${fmt(solution.value)}°C.`; },
    compute: [
      'const slots = $slots;',
      'return String(slots.start - slots.fall) + "°C.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The reading starts at ${slots.start}°C and falls by ${slots.fall}°C, so the change is subtracted from the position.`,
        `Because the fall is larger than ${slots.start}, the position passes 0 and continues with the negative readings -1, -2, -3, as the statement defines.`,
        `Counting ${slots.fall} steps down from ${slots.start} lands on ${solution.value}°C.`
      ];
    }
  },
  {
    template: 'Temperature difference across zero',
    type: 'temperature-difference-across-zero',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /morning it is (-?\d+)\s*°C, and at noon it is (-?\d+)\s*°C/, 'a morning and a noon temperature');
      return { morning: Number(match[1]), noon: Number(match[2]) };
    },
    solve(slots) { return { rise: slots.noon - slots.morning }; },
    render(solution) { return `${fmt(solution.rise)}°C.`; },
    compute: [
      'const slots = $slots;',
      'return String(slots.noon - slots.morning) + "°C.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The temperature stands at ${slots.morning}°C in the morning and at ${slots.noon}°C at noon.`,
        `The rise is the distance between the two positions on the same scale, so it is ${slots.noon} - (${slots.morning}).`,
        `Crossing zero is handled by the sign of the result, and the rise is ${solution.rise}°C.`
      ];
    }
  },
  {
    template: 'Mass of contents by subtraction',
    type: 'mass-of-contents-by-subtraction',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /weighs (\d+)\s*g\.\s*The empty container weighs (\d+)\s*g/, 'the two container masses');
      return { total: Number(match[1]), container: Number(match[2]) };
    },
    solve(slots) { return { mass: slots.total - slots.container }; },
    render(solution) { return `${fmt(solution.mass)} g.`; },
    compute: [
      'const slots = $slots;',
      'return String(slots.total - slots.container) + " g.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The container together with the material weighs ${slots.total} g, and the empty container weighs ${slots.container} g.`,
        `The material is what is left when the container's own mass is removed, so the masses are subtracted.`,
        `The mass of the material is ${solution.mass} g.`
      ];
    }
  },
  {
    template: 'Conservation of mass during transfer',
    type: 'conservation-of-mass-during-transfer',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /hold (\d+)\s*g of sand in total\. We move (\d+)\s*g/, 'a total mass and a moved mass');
      return { total: Number(match[1]), moved: Number(match[2]) };
    },
    solve(slots) { return { total: slots.total }; },
    render(solution) { return `It remains ${fmt(solution.total)} g.`; },
    compute: [
      'const slots = $slots;',
      'const first = slots.total / 2;',
      'const second = slots.total / 2;',
      'const afterFirst = first - slots.moved;',
      'const afterSecond = second + slots.moved;',
      'return "It remains " + String(afterFirst + afterSecond) + " g.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The two containers hold ${slots.total} g of sand together before the transfer.`,
        `Moving ${slots.moved} g takes that amount out of the first container and puts the same amount into the second.`,
        `The loss and the gain cancel exactly, and nothing leaves the system, so the total is unchanged at ${solution.total} g.`
      ];
    }
  },
  {
    template: 'Volume by counting cubes',
    type: 'volume-by-counting-cubes',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /block of (\d+)×(\d+)×(\d+) unit cubes/, 'the block dimensions');
      return { a: Number(match[1]), b: Number(match[2]), c: Number(match[3]) };
    },
    solve(slots) { return { count: slots.a * slots.b * slots.c }; },
    render(solution) { return `${fmt(solution.count)} unit cubes.`; },
    compute: [
      'const slots = $slots;',
      'return String(slots.a * slots.b * slots.c) + " unit cubes.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The block is ${slots.a} cubes long, ${slots.b} cubes wide, and ${slots.c} cubes high.`,
        `The statement defines the volume as the total number of unit cubes that fill the box.`,
        `Counting layer by layer gives ${slots.a} × ${slots.b} × ${slots.c} = ${solution.count} unit cubes.`
      ];
    }
  },
  {
    template: 'Water level and added volume',
    type: 'water-level-and-added-volume',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /reads (\d+)\s*ml\. We add liquid until it reads (\d+)\s*ml/, 'the two container readings');
      return { before: Number(match[1]), after: Number(match[2]) };
    },
    solve(slots) { return { added: slots.after - slots.before }; },
    render(solution) { return `${fmt(solution.added)} ml.`; },
    compute: [
      'const slots = $slots;',
      'return String(slots.after - slots.before) + " ml.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The container reads ${slots.before} ml before the liquid is poured in.`,
        `After pouring it reads ${slots.after} ml, so the added liquid is exactly the increase of the reading.`,
        `The added volume is ${slots.after} - ${slots.before} = ${solution.added} ml.`
      ];
    }
  },
  {
    template: 'Water displacement as a measure of object volume',
    type: 'water-displacement-as-a-measure-of-object-volume',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /container has (\d+)\s*ml of water\. We fully submerge a stone, and the level reads (\d+)\s*ml/, 'the two water levels');
      return { before: Number(match[1]), after: Number(match[2]) };
    },
    solve(slots) { return { volume: slots.after - slots.before }; },
    render(solution) { return `${fmt(solution.volume)} ml of volume.`; },
    compute: [
      'const slots = $slots;',
      'return String(slots.after - slots.before) + " ml of volume.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The water level reads ${slots.before} ml before the stone is submerged.`,
        `With the stone fully under water the level reads ${slots.after} ml.`,
        `The stated rule says the stone's volume equals that increase, so the volume is ${solution.volume} ml.`
      ];
    }
  },
  {
    template: 'Density defined as mass per unit volume',
    type: 'density-defined-as-mass-per-unit-volume',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /mass (\d+)\s*g and volume (\d+)\s*cm/, 'a mass and a volume');
      return { mass: Number(match[1]), volume: Number(match[2]) };
    },
    solve(slots) { return { density: slots.mass / slots.volume }; },
    render(solution) { return `${fmt(solution.density)} g/cm³.`; },
    compute: [
      'const slots = $slots;',
      'const fmt = (v) => String(Number(Number(v).toFixed(6)));',
      'return fmt(slots.mass / slots.volume) + " g/cm³.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The statement defines density as mass divided by volume.`,
        `The block has mass ${slots.mass} g and volume ${slots.volume} cm³.`,
        `Dividing gives ${slots.mass} / ${slots.volume} = ${solution.density} g/cm³.`
      ];
    }
  },
  {
    template: 'Compare materials by density',
    type: 'compare-materials-by-density',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /Material A has (\d+)\s*g in (\d+)\s*cm³; B has (\d+)\s*g in (\d+)\s*cm³/, 'the two material measurements');
      return { aMass: Number(match[1]), aVolume: Number(match[2]), bMass: Number(match[3]), bVolume: Number(match[4]) };
    },
    solve(slots) {
      const aDensity = slots.aMass / slots.aVolume;
      const bDensity = slots.bMass / slots.bVolume;
      return { aDensity, bDensity, denser: aDensity > bDensity ? 'Material A' : 'Material B' };
    },
    render(solution) { return `${solution.denser}.`; },
    compute: [
      'const slots = $slots;',
      'const a = slots.aMass / slots.aVolume;',
      'const b = slots.bMass / slots.bVolume;',
      'return a > b ? "Material A." : "Material B.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Density is mass divided by volume, so material A has ${slots.aMass} / ${slots.aVolume} = ${solution.aDensity} g/cm³.`,
        `Material B has ${slots.bMass} / ${slots.bVolume} = ${solution.bDensity} g/cm³.`,
        `The larger value belongs to the denser material, so ${solution.denser} is denser.`
      ];
    }
  },
  {
    template: 'Plant growth rate as change per day',
    type: 'plant-growth-rate-as-change-per-day',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /plant is (\d+)\s*cm tall on Monday and (\d+)\s*cm tall after (\d+) days/, 'a plant height and a number of days');
      return { start: Number(match[1]), end: Number(match[2]), days: Number(match[3]) };
    },
    solve(slots) {
      const total = slots.end - slots.start;
      return { total, rate: total / slots.days };
    },
    render(solution) { return `${fmt(solution.rate)} cm/day.`; },
    compute: [
      'const slots = $slots;',
      'const fmt = (v) => String(Number(Number(v).toFixed(6)));',
      'return fmt((slots.end - slots.start) / slots.days) + " cm/day.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The plant is ${slots.start} cm tall on Monday and ${slots.end} cm tall after ${slots.days} days.`,
        `The total growth is ${slots.end} - ${slots.start} = ${solution.total} cm.`,
        `Equal growth each day divides that change evenly: ${solution.total} / ${slots.days} = ${solution.rate} cm/day.`
      ];
    }
  },
  {
    template: 'Prediction in a stated linear model',
    type: 'prediction-in-a-stated-linear-model',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /starts at (\d+) units, and the model says it adds exactly (\d+) units per day\. How much does it have after (\d+) days/, 'a start, a daily rate, and a horizon');
      return { start: Number(match[1]), rate: Number(match[2]), days: Number(match[3]) };
    },
    solve(slots) {
      const added = slots.rate * slots.days;
      return { added, value: slots.start + added };
    },
    render(solution) { return `${fmt(solution.value)} units.`; },
    compute: [
      'const slots = $slots;',
      'return String(slots.start + slots.rate * slots.days) + " units.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The culture starts at ${slots.start} units and the stated model adds ${slots.rate} units every day.`,
        `Over ${slots.days} days the total addition is ${slots.rate} × ${slots.days} = ${solution.added} units.`,
        `Adding that to the start gives ${slots.start} + ${solution.added} = ${solution.value} units.`
      ];
    }
  },
  {
    template: 'The model does not allow extrapolation when the rule changes',
    type: 'the-model-does-not-allow-extrapolation-when-the-rule-changes',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /grows by (\d+) units per day only during the first (\d+) days;.*?starts at (-?\d+), can we know its value after (\d+) days/, 'a rule period and a horizon');
      return { rate: Number(match[1]), limit: Number(match[2]), start: Number(match[3]), horizon: Number(match[4]) };
    },
    solve(slots) {
      const determined = slots.horizon <= slots.limit;
      return { determined, value: determined ? slots.start + slots.rate * slots.horizon : null };
    },
    render(solution) { return solution.determined ? `${fmt(solution.value)} units.` : 'It cannot be determined.'; },
    compute: [
      'const slots = $slots;',
      'if (slots.horizon > slots.limit) {',
      '  return "It cannot be determined.";',
      '}',
      'return String(slots.start + slots.rate * slots.horizon) + " units.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The stated rule adds ${slots.rate} units per day only during the first ${slots.limit} days, starting from ${slots.start} units.`,
        `The question asks for the value after ${slots.horizon} days, which lies beyond the period the rule describes.`,
        `No rule is given for the days after ${slots.limit}, so the value after ${slots.horizon} days cannot be determined from the information.`
      ];
    }
  },
  {
    template: 'Energy consumption per hour',
    type: 'energy-consumption-per-hour',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /consumes (\d+) energy units per hour, at a constant rate\. How much does it consume in (\d+) hours/, 'a rate and a duration');
      return { rate: Number(match[1]), hours: Number(match[2]) };
    },
    solve(slots) { return { total: slots.rate * slots.hours }; },
    render(solution) { return `${fmt(solution.total)} units.`; },
    compute: [
      'const slots = $slots;',
      'return String(slots.rate * slots.hours) + " units.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The device consumes ${slots.rate} energy units every hour at a constant rate.`,
        `Consumption is proportional to time, so over ${slots.hours} hours it uses ${slots.rate} × ${slots.hours}.`,
        `The total consumption is ${solution.total} units.`
      ];
    }
  },
  {
    template: 'Battery remaining after consumption',
    type: 'battery-remaining-after-consumption',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /battery has (\d+) units\. A device consumes (\d+) units per hour for (\d+) hours/, 'a capacity, a rate, and a duration');
      return { capacity: Number(match[1]), rate: Number(match[2]), hours: Number(match[3]) };
    },
    solve(slots) {
      const used = slots.rate * slots.hours;
      return { used, remaining: slots.capacity - used };
    },
    render(solution) { return `${fmt(solution.remaining)} units.`; },
    compute: [
      'const slots = $slots;',
      'return String(slots.capacity - slots.rate * slots.hours) + " units.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The battery starts with ${slots.capacity} units.`,
        `In ${slots.hours} hours the device consumes ${slots.rate} × ${slots.hours} = ${solution.used} units.`,
        `With no other consumption the remainder is ${slots.capacity} - ${solution.used} = ${solution.remaining} units.`
      ];
    }
  },
  {
    template: 'Can the battery support the duration?',
    type: 'can-the-battery-support-the-duration',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /battery has (\d+) units\. Consumption is (\d+) per hour\. Can it support (\d+) complete hours/, 'a capacity, a rate, and a duration');
      return { capacity: Number(match[1]), rate: Number(match[2]), hours: Number(match[3]) };
    },
    solve(slots) {
      const needed = slots.rate * slots.hours;
      return { needed, supported: needed <= slots.capacity };
    },
    render(solution) { return solution.supported ? 'Yes.' : 'No.'; },
    compute: [
      'const slots = $slots;',
      'const needed = slots.rate * slots.hours;',
      'return needed <= slots.capacity ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `${slots.hours} complete hours at ${slots.rate} units per hour would need ${slots.rate} × ${slots.hours} = ${solution.needed} units.`,
        `The battery holds only ${slots.capacity} units.`,
        `Because ${solution.needed} is greater than ${slots.capacity}, the battery cannot support the whole duration.`
      ];
    }
  },
  {
    template: 'Mixture without reaction: volumes add under the given rule',
    type: 'mixture-without-reaction-volumes-add-under-the-given-rule',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /We pour (\d+)\s*ml and (\d+)\s*ml/, 'the two liquid volumes');
      return { first: Number(match[1]), second: Number(match[2]) };
    },
    solve(slots) { return { volume: slots.first + slots.second }; },
    render(solution) { return `${fmt(solution.volume)} ml.`; },
    compute: [
      'const slots = $slots;',
      'return String(slots.first + slots.second) + " ml.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The stated model says the volumes of the two liquids add exactly.`,
        `The two amounts are ${slots.first} ml and ${slots.second} ml.`,
        `Their sum is ${slots.first} + ${slots.second} = ${solution.volume} ml.`
      ];
    }
  },
  {
    template: 'Intuitive concentration as a fraction of the total',
    type: 'intuitive-concentration-as-a-fraction-of-the-total',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /mixture has (\d+) parts syrup and (\d+) parts water/, 'the syrup and water parts');
      return { syrup: Number(match[1]), water: Number(match[2]) };
    },
    solve(slots) {
      const total = slots.syrup + slots.water;
      return { total, fraction: reducedFraction(slots.syrup, total) };
    },
    render(solution) { return `${solution.fraction}.`; },
    compute: [
      'const slots = $slots;',
      'function reduce(a, b) { return b === 0 ? a : reduce(b, a % b); }',
      'const total = slots.syrup + slots.water;',
      'const divide = reduce(slots.syrup, total);',
      'return String(slots.syrup / divide) + "/" + String(total / divide) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The mixture is described with ${slots.syrup} parts syrup and ${slots.water} parts water.`,
        `The number of equal parts in the whole mixture is ${slots.syrup} + ${slots.water} = ${solution.total}.`,
        `The syrup fraction is the syrup parts over those total parts, ${slots.syrup}/${solution.total}, which reduces to ${solution.fraction}.`
      ];
    }
  },
  {
    template: 'Preserve the same concentration when scaling',
    type: 'preserve-the-same-concentration-when-scaling',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /recipe has (\d+) parts syrup to (\d+) parts water\. If we (\w+) the recipe/, 'the recipe parts and the scaling word');
      return { syrup: Number(match[1]), water: Number(match[2]), word: match[3] };
    },
    solve(slots) {
      const factor = slots.word === 'double' ? 2 : slots.word === 'triple' ? 3 : 1;
      const syrup = slots.syrup * factor;
      const water = slots.water * factor;
      return { factor, syrup, water, fraction: reducedFraction(syrup, syrup + water) };
    },
    render(solution) {
      return `${fmt(solution.syrup)} parts syrup, ${fmt(solution.water)} parts water; the fraction remains ${solution.fraction}.`;
    },
    compute: [
      'const slots = $slots;',
      'function reduce(a, b) { return b === 0 ? a : reduce(b, a % b); }',
      'const factor = slots.word === "double" ? 2 : slots.word === "triple" ? 3 : 1;',
      'const syrup = slots.syrup * factor;',
      'const water = slots.water * factor;',
      'const divide = reduce(syrup, syrup + water);',
      'return String(syrup) + " parts syrup, " + String(water) + " parts water; the fraction remains "',
      '  + String(syrup / divide) + "/" + String((syrup + water) / divide) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The original recipe uses ${slots.syrup} parts syrup and ${slots.water} parts water, a total of ${slots.syrup + slots.water} parts.`,
        `Scaling multiplies both amounts by ${solution.factor}, giving ${solution.syrup} parts syrup and ${solution.water} parts water.`,
        `The total also grows by the same factor, so ${solution.syrup}/${solution.syrup + solution.water} reduces to the same fraction ${solution.fraction}: the concentration is preserved.`
      ];
    }
  },
  {
    template: 'Lever modeled by force×distance',
    type: 'lever-modeled-by-force-distance',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /On the left, weight (\d+) is at distance (\d+)\. On the right, the weight is (\d+)/, 'the lever weights and distance');
      return { leftWeight: Number(match[1]), leftDistance: Number(match[2]), rightWeight: Number(match[3]) };
    },
    solve(slots) {
      const leftProduct = slots.leftWeight * slots.leftDistance;
      return { leftProduct, distance: leftProduct / slots.rightWeight };
    },
    render(solution) { return `Distance ${fmt(solution.distance)}.`; },
    compute: [
      'const slots = $slots;',
      'const fmt = (v) => String(Number(Number(v).toFixed(6)));',
      'return "Distance " + fmt(slots.leftWeight * slots.leftDistance / slots.rightWeight) + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Equilibrium requires the same weight × distance product on both sides of the balance.`,
        `On the left that product is ${slots.leftWeight} × ${slots.leftDistance} = ${solution.leftProduct}.`,
        `On the right the weight is ${slots.rightWeight}, so the distance must satisfy ${slots.rightWeight} × d = ${solution.leftProduct}, which gives d = ${solution.distance}.`
      ];
    }
  },
  {
    template: 'Shadow in a stated proportional model',
    type: 'shadow-in-a-stated-proportional-model',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /shadow length is exactly (half|twice) the object's height\. A pole is (\d+)\s*m tall/, 'the shadow rule and the pole height');
      return { mode: match[1], height: Number(match[2]) };
    },
    solve(slots) {
      const shadow = slots.mode === 'half' ? slots.height / 2 : slots.height * 2;
      return { shadow };
    },
    render(solution) { return `${fmt(solution.shadow)} m.`; },
    compute: [
      'const slots = $slots;',
      'const fmt = (v) => String(Number(Number(v).toFixed(6)));',
      'const shadow = slots.mode === "half" ? slots.height / 2 : slots.height * 2;',
      'return fmt(shadow) + " m.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The stated model makes the shadow length exactly half the object's height.`,
        `The pole is ${slots.height} m tall.`,
        `Half of ${slots.height} m is ${solution.shadow} m, which is the shadow's length.`
      ];
    }
  },
  {
    template: 'Detect a measurement incompatible with the model',
    type: 'detect-a-measurement-incompatible-with-the-model',
    category: 'no-knowledge',
    sharedPremise: 'Under the same light, the stated model fixes the shadow length at exactly half the object height.',
    parse(statement) {
      const match = requireMatch(statement, /object (\d+)\s*m tall, a shadow of (\d+)\s*m is reported/, 'a height and a reported shadow');
      return { height: Number(match[1]), reported: Number(match[2]) };
    },
    solve(slots) {
      const expected = slots.height / 2;
      return { expected, compatible: slots.reported === expected };
    },
    render(solution) { return solution.compatible ? 'Yes.' : 'No.'; },
    compute: [
      'const slots = $slots;',
      'return slots.reported === slots.height / 2 ? "Yes." : "No.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The stated model requires the shadow to be half the object's height.`,
        `For an object ${slots.height} m tall the model expects ${slots.height} / 2 = ${solution.expected} m.`,
        `The reported shadow is ${slots.reported} m, which differs from the expected value, so the report is not compatible with the model.`
      ];
    }
  },
  {
    template: 'Flow rate defined as volume per minute',
    type: 'flow-rate-defined-as-volume-per-minute',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /tap supplies (\d+)\s*L per minute at a constant rate\. How many liters does it supply in (\d+) minutes/, 'a flow rate and a duration');
      return { rate: Number(match[1]), minutes: Number(match[2]) };
    },
    solve(slots) { return { total: slots.rate * slots.minutes }; },
    render(solution) { return `${fmt(solution.total)} L.`; },
    compute: [
      'const slots = $slots;',
      'return String(slots.rate * slots.minutes) + " L.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The tap supplies ${slots.rate} L every minute at a constant rate.`,
        `At that rate, ${slots.minutes} minutes supply ${slots.rate} × ${slots.minutes}.`,
        `The total supplied is ${solution.total} L.`
      ];
    }
  },
  {
    template: 'Filling time at constant flow',
    type: 'filling-time-at-constant-flow',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /container needs (\d+)\s*L\. A tap supplies (\d+)\s*L\/min/, 'a needed volume and a flow rate');
      return { volume: Number(match[1]), rate: Number(match[2]) };
    },
    solve(slots) { return { minutes: slots.volume / slots.rate }; },
    render(solution) { return `${fmt(solution.minutes)} minutes.`; },
    compute: [
      'const slots = $slots;',
      'const fmt = (v) => String(Number(Number(v).toFixed(6)));',
      'return fmt(slots.volume / slots.rate) + " minutes.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The container needs ${slots.volume} L and the tap supplies ${slots.rate} L each minute.`,
        `At a constant flow the time is the volume divided by the rate: ${slots.volume} / ${slots.rate}.`,
        `Filling from empty therefore takes ${solution.minutes} minutes.`
      ];
    }
  },
  {
    template: 'Two opposing processes: inflow and loss',
    type: 'two-opposing-processes-inflow-and-loss',
    category: 'no-knowledge',
    parse(statement) {
      const match = requireMatch(statement, /enters a tank at (\d+)\s*L\/min and leaks out at (\d+)\s*L\/min/, 'an inflow and an outflow rate');
      return { inflow: Number(match[1]), outflow: Number(match[2]) };
    },
    solve(slots) { return { net: slots.inflow - slots.outflow }; },
    render(solution) { return `${fmt(solution.net)} L/min.`; },
    compute: [
      'const slots = $slots;',
      'return String(slots.inflow - slots.outflow) + " L/min.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Water enters at ${slots.inflow} L/min while ${slots.outflow} L/min leaks out at the same time.`,
        `The stated model defines the net rate as the inflow minus the outflow: ${slots.inflow} - ${slots.outflow}.`,
        `The volume therefore grows by ${solution.net} L each minute.`
      ];
    }
  }
];
