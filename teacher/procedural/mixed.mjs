/**
 * Three more plan shapes of the procedural arithmetic source.
 *
 * The evidence so far is that the student compiles the shapes it was taught
 * (16 of 16 letter counts, 9 of 9 word counts, 95.7% oracle on its own training
 * rows) and does not compile a family it never saw, so the lever that costs the
 * least and buys the most is plan coverage. These three add shapes every other
 * family of the source lacks: a percentage of a stated total, the elapsed
 * minutes between two clock times, and a recipe scaled to a different number of
 * servings.
 *
 * Every sampler keeps the arithmetic integer-exact on purpose: the oracle, the
 * circuit, and the printed answer must agree exactly, and a rounding rule is a
 * different task from the one these families teach.
 */

const SHIPMENTS = ['a shipment', 'a warehouse batch', 'a delivery', 'a pallet load', 'a stock lot'];
const INSPECTORS = ['the inspector', 'the reviewer', 'the quality clerk', 'the checker'];
const SHIFTS = ['a shift', 'a night shift', 'a maintenance window', 'a counter session'];
const RECIPES = ['a recipe', 'a dough mix', 'a paint batch', 'a feed mix', 'a glaze'];

/** The latent plan: a stated percentage of a stated total. */
const percentOfTotal = {
  id: 'percent-of-total',
  name: 'Percent of Total',
  type: 'percent-of-total',
  category: 'no-knowledge',
  difficulty: { subproblems: 1, dependencyDepth: 1, branching: 0, irrelevantInformation: 0, symbolicShare: 1 },
  sample(random) {
    const percents = [10, 20, 25, 50];
    const percent = percents[Math.floor(random() * percents.length)];
    const units = 20 * (2 + Math.floor(random() * 40));
    return {
      subject: SHIPMENTS[Math.floor(random() * SHIPMENTS.length)],
      actor: INSPECTORS[Math.floor(random() * INSPECTORS.length)],
      units,
      percent
    };
  },
  statement(slots) {
    return `${slots.subject[0].toUpperCase()}${slots.subject.slice(1)} holds ${slots.units} units, and ${slots.actor} checks ${slots.percent} percent of them. ` +
      'How many units are checked?';
  },
  parse(statement) {
    const match = /^([A-Za-z ]+) holds (\d+) units, and ([a-z ]+) checks (\d+) percent of them\./.exec(statement);
    if (match === null) {
      throw new Error('the statement does not state the total, the percentage, and who checks');
    }
    return {
      subject: match[1].toLowerCase(),
      actor: match[3],
      units: Number(match[2]),
      percent: Number(match[4])
    };
  },
  /** Independent oracle: the same product, divided once. */
  solve(slots) {
    const checked = (slots.units * slots.percent) / 100;
    if (!Number.isInteger(checked)) {
      throw new Error('the percentage does not divide the total into whole units');
    }
    return { checked };
  },
  render(solution) {
    return `${solution.checked} units are checked.`;
  },
  compute: [
    'const slots = $slots;',
    'probe(Number.isInteger(slots.units) && slots.units > 0, "the total must be a positive whole number of units");',
    'probe(Number.isInteger(slots.percent) && slots.percent > 0 && slots.percent < 100, "the percentage must be a whole number between 0 and 100");',
    'const product = slots.units * slots.percent;',
    'probe(product % 100 === 0, "the percentage must divide the total into whole units");',
    'const checked = product / 100;',
    'probe(checked <= slots.units, "the checked part cannot exceed the whole shipment");',
    'return checked + " units are checked.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `${slots.percent} percent of ${slots.units} units is what is asked.`,
      'The product is divided by one hundred exactly, so no rounding rule is involved.',
      `${solution.checked} units are checked.`
    ];
  }
};

/** The latent plan: the minutes between two clock times of one day. */
const elapsedMinutes = {
  id: 'elapsed-minutes',
  name: 'Elapsed Minutes',
  type: 'elapsed-minutes',
  category: 'no-knowledge',
  difficulty: { subproblems: 2, dependencyDepth: 2, branching: 1, irrelevantInformation: 0, symbolicShare: 1 },
  sample(random) {
    for (let attempt = 0; attempt < 200; attempt += 1) {
      const startHour = 5 + Math.floor(random() * 10);
      const startMinute = Math.floor(random() * 60);
      const durationHours = 2 + Math.floor(random() * 10);
      const durationMinutes = Math.floor(random() * 60);
      const endTotal = startHour * 60 + startMinute + durationHours * 60 + durationMinutes;
      if (endTotal >= 24 * 60) {
        continue;
      }
      return {
        subject: SHIFTS[Math.floor(random() * SHIFTS.length)],
        startHour,
        startMinute,
        endHour: Math.floor(endTotal / 60),
        endMinute: endTotal % 60
      };
    }
    throw new Error('the sampler could not draw a window inside one day');
  },
  statement(slots) {
    const clock = (hour, minute) => `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    return `${slots.subject[0].toUpperCase()}${slots.subject.slice(1)} starts at ${clock(slots.startHour, slots.startMinute)} ` +
      `and ends at ${clock(slots.endHour, slots.endMinute)} on the same day. How many minutes does it last?`;
  },
  parse(statement) {
    const match = /starts at (\d{2}):(\d{2}) and ends at (\d{2}):(\d{2}) on the same day\./.exec(statement);
    const subject = /^([A-Za-z ]+) starts at/.exec(statement);
    if (match === null || subject === null) {
      throw new Error('the statement does not state the two clock times');
    }
    return {
      subject: subject[1].toLowerCase(),
      startHour: Number(match[1]),
      startMinute: Number(match[2]),
      endHour: Number(match[3]),
      endMinute: Number(match[4])
    };
  },
  /** Independent oracle: whole hours plus the minute remainder. */
  solve(slots) {
    const hours = slots.endHour - slots.startHour;
    const minutes = slots.endMinute - slots.startMinute;
    const total = hours * 60 + minutes;
    if (total <= 0) {
      throw new Error('the end time must be later than the start time');
    }
    return { total };
  },
  render(solution) {
    return `${solution.total} minutes.`;
  },
  compute: [
    'const slots = $slots;',
    'probe(Number.isInteger(slots.startHour) && slots.startHour >= 0 && slots.startHour < 24, "the start hour must be a clock hour");',
    'probe(Number.isInteger(slots.endHour) && slots.endHour >= 0 && slots.endHour < 24, "the end hour must be a clock hour");',
    'probe(Number.isInteger(slots.startMinute) && slots.startMinute >= 0 && slots.startMinute < 60, "the start minute must be a clock minute");',
    'probe(Number.isInteger(slots.endMinute) && slots.endMinute >= 0 && slots.endMinute < 60, "the end minute must be a clock minute");',
    'const startTotal = slots.startHour * 60 + slots.startMinute;',
    'const endTotal = slots.endHour * 60 + slots.endMinute;',
    'probe(endTotal > startTotal, "the end time must be later than the start time on the same day");',
    'const total = endTotal - startTotal;',
    'probe(total <= 24 * 60, "the window cannot exceed one day");',
    'return total + " minutes.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      'Both times are converted to minutes after midnight, which makes the difference a subtraction.',
      `The window is ${solution.total} minutes, counted inside one day.`,
      'Clock arithmetic has no rounding: the answer is exact.'
    ];
  }
};

/** The latent plan: scale a stated amount from one serving count to another. */
const scaledRecipe = {
  id: 'scaled-recipe',
  name: 'Scaled Recipe',
  type: 'scaled-recipe',
  category: 'no-knowledge',
  difficulty: { subproblems: 2, dependencyDepth: 2, branching: 0, irrelevantInformation: 0, symbolicShare: 1 },
  sample(random) {
    const baseServings = [2, 4, 5, 10][Math.floor(random() * 4)];
    const perServing = 2 + Math.floor(random() * 12);
    const wanted = (1 + Math.floor(random() * 6)) * baseServings;
    return {
      subject: RECIPES[Math.floor(random() * RECIPES.length)],
      item: ['flour', 'sugar', 'resin', 'grain', 'pigment'][Math.floor(random() * 5)],
      baseServings,
      baseAmount: perServing * baseServings,
      wanted
    };
  },
  statement(slots) {
    return `${slots.subject[0].toUpperCase()}${slots.subject.slice(1)} for ${slots.baseServings} servings needs ${slots.baseAmount} units of ${slots.item}. ` +
      `How many units are needed for ${slots.wanted} servings?`;
  },
  parse(statement) {
    const match = /^([A-Za-z ]+) for (\d+) servings needs (\d+) units of ([a-z]+)\. How many units are needed for (\d+) servings\?/.exec(statement);
    if (match === null) {
      throw new Error('the statement does not state the base servings, the base amount, and the wanted servings');
    }
    return {
      subject: match[1].toLowerCase(),
      baseServings: Number(match[2]),
      baseAmount: Number(match[3]),
      item: match[4],
      wanted: Number(match[5])
    };
  },
  /** Independent oracle: the per-serving amount, then the wanted count. */
  solve(slots) {
    if (slots.baseAmount % slots.baseServings !== 0) {
      throw new Error('the stated amount is not a whole number per serving');
    }
    return { perServing: slots.baseAmount / slots.baseServings, needed: (slots.baseAmount / slots.baseServings) * slots.wanted };
  },
  render(solution) {
    return `${solution.needed} units are needed.`;
  },
  compute: [
    'const slots = $slots;',
    'probe(Number.isInteger(slots.baseServings) && slots.baseServings > 0, "the base servings must be a positive whole number");',
    'probe(Number.isInteger(slots.wanted) && slots.wanted > 0, "the wanted servings must be a positive whole number");',
    'probe(Number.isInteger(slots.baseAmount) && slots.baseAmount > 0, "the stated amount must be a positive whole number of units");',
    'probe(slots.baseAmount % slots.baseServings === 0, "the stated amount must divide into whole units per serving");',
    'const perServing = slots.baseAmount / slots.baseServings;',
    'const needed = perServing * slots.wanted;',
    'probe(needed % 1 === 0, "the scaled amount must be a whole number of units");',
    'probe(needed >= perServing, "the scaled amount must cover at least one serving");',
    'return needed + " units are needed.";'
  ].join('\n'),
  explain(slots, solution) {
    return [
      `${slots.baseAmount} units for ${slots.baseServings} servings means ${solution.perServing} units per serving.`,
      `${slots.wanted} servings need that amount multiplied by ${slots.wanted}.`,
      `The answer is ${solution.needed} units.`
    ];
  }
};

export const mixedFamilies = [percentOfTotal, elapsedMinutes, scaledRecipe];
