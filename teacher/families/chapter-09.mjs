/**
 * Families for chapter 9 of the mathematical seed book: tables,
 * classification, and combinations.
 *
 * Each template states its own data (the day values, the four category counts,
 * the card descriptions, the frequencies, the menu choices), so no calendar,
 * currency, or other outside fact is required and the whole chapter is
 * `no-knowledge`.
 */

export const chapter = 9;

export const cases = [
  {
    template: 'Five-Day Table',
    type: 'five-day-table',
    category: 'no-knowledge',
    parse(statement) {
      const entries = [...statement.matchAll(/(\w+): (\d+)/g)].map((match) => [match[1], Number(match[2])]);
      if (entries.length === 0) {
        throw new Error('the table entries are missing');
      }
      return { entries };
    },
    solve(slots) {
      const total = slots.entries.reduce((sum, entry) => sum + entry[1], 0);
      let best = null;
      for (const entry of slots.entries) {
        if (best === null || entry[1] > best[1]) {
          best = entry;
        }
      }
      return { total, day: best[0], maximum: best[1] };
    },
    render(solution) {
      return `Total ${solution.total}; maximum on ${solution.day}: ${solution.maximum}.`;
    },
    compute: [
      'const slots = $slots;',
      'let total = 0;',
      'let best = null;',
      'for (const [day, value] of slots.entries) {',
      '  total += value;',
      '  if (best === null || value > best[1]) {',
      '    best = [day, value];',
      '  }',
      '}',
      'return "Total " + total + "; maximum on " + best[0] + ": " + best[1] + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The table gives ${slots.entries.length} values, and the total for the five days is the sum of those values.`,
        `Adding them gives ${slots.entries.map((entry) => entry[1]).join(' + ')} = ${solution.total}.`,
        `Comparing the values one by one shows that the largest value is ${solution.maximum}, which belongs to ${solution.day}, so the maximum is on ${solution.day}.`
      ];
    }
  },
  {
    template: 'The Missing Category from the Total',
    type: 'the-missing-category-from-the-total',
    category: 'no-knowledge',
    parse(statement) {
      const totalMatch = statement.match(/survey has (\d+) responses/);
      const countsMatch = statement.match(/A has (\d+), B has (\d+), and C has (\d+)/);
      if (totalMatch === null || countsMatch === null) {
        throw new Error('the total or the three known categories are missing');
      }
      return {
        total: Number(totalMatch[1]),
        a: Number(countsMatch[1]),
        b: Number(countsMatch[2]),
        c: Number(countsMatch[3])
      };
    },
    solve(slots) {
      const d = slots.total - slots.a - slots.b - slots.c;
      if (d < 0) {
        throw new Error('the three known categories already exceed the total');
      }
      return { d };
    },
    render(solution) {
      return String(solution.d);
    },
    compute: [
      'const slots = $slots;',
      'const d = slots.total - slots.a - slots.b - slots.c;',
      'if (d < 0) {',
      '  throw new Error("the three known categories already exceed the total");',
      '}',
      'return String(d);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Each response belongs to exactly one category, so the four category counts add up to the total ${slots.total}.`,
        `The three known categories contribute ${slots.a} + ${slots.b} + ${slots.c} = ${slots.a + slots.b + slots.c}.`,
        `Subtracting them from the total gives ${slots.total} - ${slots.a + slots.b + slots.c} = ${solution.d} responses in category D.`,
        `Checking the partition: ${slots.a} + ${slots.b} + ${slots.c} + ${solution.d} = ${slots.total}, so no response is left uncounted.`
      ];
    }
  },
  {
    template: 'Classification by Two Properties',
    type: 'classification-by-two-properties',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/described as follows: (.+?)\. A card is selected only if it has shape “(\w+)” AND color “(\w+)”/);
      if (match === null) {
        throw new Error('the card list or the two properties are missing');
      }
      const cards = match[1].split(',').map((card) => card.trim());
      return { cards, shape: match[2], color: match[3] };
    },
    solve(slots) {
      const selected = slots.cards.filter((card) => {
        const separator = card.indexOf('-');
        return card.slice(0, separator) === slots.shape && card.slice(separator + 1) === slots.color;
      });
      return { count: selected.length };
    },
    render(solution) {
      return String(solution.count);
    },
    compute: [
      'const slots = $slots;',
      'let count = 0;',
      'for (const card of slots.cards) {',
      '  const separator = card.indexOf("-");',
      '  if (card.slice(0, separator) === slots.shape && card.slice(separator + 1) === slots.color) {',
      '    count += 1;',
      '  }',
      '}',
      'return String(count);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A card is selected only when both conditions hold at once: shape “${slots.shape}” and color “${slots.color}”.`,
        `Scanning the ${slots.cards.length} cards and keeping only those that satisfy the shape and the color together selects ${solution.count} card${solution.count === 1 ? '' : 's'}.`,
        `Every other card fails at least one of the two conditions, so the conjunction is what makes the selection.`
      ];
    }
  },
  {
    template: 'Maximum, Minimum, and Ties',
    type: 'maximum-minimum-and-ties',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/A=(\d+), B=(\d+), C=(\d+), D=(\d+)/);
      if (match === null) {
        throw new Error('the four frequencies are missing');
      }
      return { a: Number(match[1]), b: Number(match[2]), c: Number(match[3]), d: Number(match[4]) };
    },
    solve(slots) {
      const entries = [['A', slots.a], ['B', slots.b], ['C', slots.c], ['D', slots.d]];
      const highest = Math.max(...entries.map((entry) => entry[1]));
      const lowest = Math.min(...entries.map((entry) => entry[1]));
      const maxima = entries.filter((entry) => entry[1] === highest).map((entry) => entry[0]);
      const minima = entries.filter((entry) => entry[1] === lowest).map((entry) => entry[0]);
      if (minima.length !== 1) {
        throw new Error('the minimum is not unique');
      }
      return { maxima, minimum: minima[0] };
    },
    render(solution) {
      return `Maxima: ${solution.maxima.join(' and ')}; minimum: ${solution.minimum}.`;
    },
    compute: [
      'const slots = $slots;',
      'const entries = [["A", slots.a], ["B", slots.b], ["C", slots.c], ["D", slots.d]];',
      'const highest = Math.max(...entries.map((entry) => entry[1]));',
      'const lowest = Math.min(...entries.map((entry) => entry[1]));',
      'const maxima = entries.filter((entry) => entry[1] === highest).map((entry) => entry[0]);',
      'const minima = entries.filter((entry) => entry[1] === lowest).map((entry) => entry[0]);',
      'if (minima.length !== 1) {',
      '  throw new Error("the minimum is not unique");',
      '}',
      'const minimum = entries.find((entry) => entry[1] === lowest)[0];',
      'return "Maxima: " + maxima.join(" and ") + "; minimum: " + minimum + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The frequencies are A=${slots.a}, B=${slots.b}, C=${slots.c}, and D=${slots.d}.`,
        `The largest value is ${Math.max(slots.a, slots.b, slots.c, slots.d)}, and a category counts as maximum whenever no other category exceeds it, so ties are kept together.`,
        `Categories ${solution.maxima.join(' and ')} share that largest value and are all maxima.`,
        `The smallest value is ${Math.min(slots.a, slots.b, slots.c, slots.d)} and belongs only to ${solution.minimum}, which is the minimum.`
      ];
    }
  },
  {
    template: 'Combinations by Listing',
    type: 'combinations-by-listing',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/There are (\d+) types of sandwich and (\d+) types of juice/);
      if (match === null) {
        throw new Error('the counts of sandwich and juice types are missing');
      }
      return { sandwiches: Number(match[1]), juices: Number(match[2]) };
    },
    solve(slots) {
      const menus = [];
      for (let sandwich = 0; sandwich < slots.sandwiches; sandwich += 1) {
        for (let juice = 0; juice < slots.juices; juice += 1) {
          menus.push([sandwich, juice]);
        }
      }
      return { count: menus.length };
    },
    render(solution) {
      return String(solution.count);
    },
    compute: [
      'const slots = $slots;',
      'let count = 0;',
      'for (let sandwich = 0; sandwich < slots.sandwiches; sandwich += 1) {',
      '  for (let juice = 0; juice < slots.juices; juice += 1) {',
      '    count += 1;',
      '  }',
      '}',
      'return String(count);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `A menu is exactly one sandwich paired with exactly one juice, so the list of menus is built pair by pair.`,
        `Each of the ${slots.sandwiches} sandwiches can be combined with any of the ${slots.juices} juices, giving ${slots.juices} menus per sandwich.`,
        `Adding ${slots.juices} once for each sandwich gives ${slots.sandwiches}×${slots.juices} = ${solution.count} different menus.`
      ];
    }
  }
];
