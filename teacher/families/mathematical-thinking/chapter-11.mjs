/**
 * Families for chapter 11 of the mathematical seed book: multiplicative
 * relationships and hierarchical models.
 *
 * Every template states its own rule ("3 times as many" means 3 equal groups,
 * or the rule of a proportional table), so the chapter is self-contained and
 * every case is `no-knowledge`. The three "N times as much" templates differ
 * only in the printed title and are produced by one factory, because the
 * multiplier is read from the statement rather than baked into the edit.
 */

export const unit = 11;

/**
 * One "N times as much as grouping" template: the base quantity and the
 * multiplier are both read from the statement, so the same circuit serves every
 * variant of the template.
 */
function timesAsMuchCase(template, slug) {
  return {
    template,
    type: slug,
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/has (\d+) tokens\. ([A-Z][a-z]+) has (\d+) times as many/);
      if (match === null) {
        throw new Error('the token counts or the multiplier are missing');
      }
      const names = statement.match(/^([A-Z][a-z]+) has/);
      return {
        from: names === null ? '' : names[1],
        to: match[2],
        base: Number(match[1]),
        multiplier: Number(match[3])
      };
    },
    solve(slots) {
      return { total: slots.base * slots.multiplier };
    },
    render(solution) {
      return String(solution.total);
    },
    compute: [
      'const slots = $slots;',
      'const total = slots.base * slots.multiplier;',
      'return String(total);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `${slots.from} has ${slots.base} tokens, and ${slots.to} has ${slots.multiplier} times as many.`,
        `The statement defines "${slots.multiplier} times as many" as ${slots.multiplier} equal groups of the base quantity, so ${slots.to}'s tokens form ${slots.multiplier} groups of ${slots.base}.`,
        `Multiplying the base by the number of groups, ${slots.base} · ${slots.multiplier} = ${solution.total}, gives the second child's tokens.`
      ];
    }
  };
}

export const cases = [
  timesAsMuchCase('“3 Times as Much” as Grouping', '3-times-as-much-as-grouping'),
  timesAsMuchCase('“4 Times as Much” as Grouping', '4-times-as-much-as-grouping'),
  timesAsMuchCase('“5 Times as Much” as Grouping', '5-times-as-much-as-grouping'),
  {
    template: 'Find the Base Group',
    type: 'find-the-base-group',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/has (\d+) objects and is exactly (\d+) times as large/);
      if (match === null) {
        throw new Error('the large collection size or the multiplier is missing');
      }
      return { large: Number(match[1]), factor: Number(match[2]) };
    },
    solve(slots) {
      if (slots.large % slots.factor !== 0) {
        throw new Error('the large collection does not split into equal groups');
      }
      return { small: slots.large / slots.factor };
    },
    render(solution) {
      return String(solution.small);
    },
    compute: [
      'const slots = $slots;',
      'if (slots.large % slots.factor !== 0) {',
      '  throw new Error("the large collection does not split into equal groups");',
      '}',
      'const small = slots.large / slots.factor;',
      'return String(small);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The large collection has ${slots.large} objects and equals ${slots.factor} equal groups, each as large as the small collection.`,
        'Since the groups are equal and together fill the large collection, the small collection is the size of one group.',
        `Dividing the large collection by the number of groups, ${slots.large} ÷ ${slots.factor} = ${solution.small}, gives the size of the small collection.`
      ];
    }
  },
  {
    template: 'Equal Groups Plus an Extra Amount',
    type: 'equal-groups-plus-an-extra-amount',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/There are (\d+) identical boxes with (\d+) pieces in each, plus (\d+) pieces/);
      if (match === null) {
        throw new Error('the boxes, the pieces per box, or the extra pieces are missing');
      }
      return { boxes: Number(match[1]), perBox: Number(match[2]), extra: Number(match[3]) };
    },
    solve(slots) {
      return { inBoxes: slots.boxes * slots.perBox, total: slots.boxes * slots.perBox + slots.extra };
    },
    render(solution) {
      return String(solution.total);
    },
    compute: [
      'const slots = $slots;',
      'const total = slots.boxes * slots.perBox + slots.extra;',
      'return String(total);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The pieces come in two components: ${slots.boxes} identical boxes with ${slots.perBox} pieces each, and ${slots.extra} separate pieces.`,
        `The boxes contribute ${slots.boxes} · ${slots.perBox} = ${solution.inBoxes} pieces.`,
        `Adding the separate pieces, ${solution.inBoxes} + ${slots.extra} = ${solution.total}, gives the total.`
      ];
    }
  },
  {
    template: 'Three Levels of Grouping',
    type: 'three-levels-of-grouping',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/has (\d+) trays, each tray has (\d+) objects, and the cabinet has (\d+) identical shelves/);
      if (match === null) {
        throw new Error('the trays, the objects per tray, or the shelves are missing');
      }
      return { trays: Number(match[1]), objects: Number(match[2]), shelves: Number(match[3]) };
    },
    solve(slots) {
      return { perShelf: slots.trays * slots.objects, total: slots.shelves * slots.trays * slots.objects };
    },
    render(solution) {
      return String(solution.total);
    },
    compute: [
      'const slots = $slots;',
      'const total = slots.shelves * slots.trays * slots.objects;',
      'return String(total);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The grouping has three levels: ${slots.shelves} identical shelves, ${slots.trays} trays per shelf, and ${slots.objects} objects per tray.`,
        `One shelf holds ${slots.trays} · ${slots.objects} = ${solution.perShelf} objects.`,
        `The cabinet repeats that shelf ${slots.shelves} times, so ${solution.perShelf} · ${slots.shelves} = ${solution.total} objects.`
      ];
    }
  },
  {
    template: 'Proportional Table with the Same Rule',
    type: 'proportional-table-with-the-same-rule',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/column B is always (\d+) times column A\. For A=(\d+), three candidate values for B are \[([0-9,\s]+)\]/);
      if (match === null) {
        throw new Error('the rule, the value of A, or the candidates are missing');
      }
      return {
        factor: Number(match[1]),
        a: Number(match[2]),
        candidates: match[3].split(',').map((value) => Number(value.trim()))
      };
    },
    solve(slots) {
      const expected = slots.factor * slots.a;
      const matching = slots.candidates.filter((value) => value === expected);
      if (matching.length !== 1) {
        throw new Error(`${matching.length} candidates follow the rule instead of one`);
      }
      return { value: matching[0] };
    },
    render(solution) {
      return String(solution.value);
    },
    compute: [
      'const slots = $slots;',
      'const expected = slots.factor * slots.a;',
      'const matching = slots.candidates.filter((candidate) => candidate === expected);',
      'if (matching.length !== 1) {',
      '  throw new Error(matching.length + " candidates follow the rule instead of one");',
      '}',
      'return String(matching[0]);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The table rule is constant: B is always ${slots.factor} times A, so for A = ${slots.a} the value of B is fixed.`,
        `Applying the rule gives ${slots.factor} · ${slots.a} = ${solution.value}.`,
        `Testing the candidates ${slots.candidates.join(', ')} against that value leaves exactly ${solution.value}.`
      ];
    }
  }
];
