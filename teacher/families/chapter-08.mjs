/**
 * Families for chapter 8 of the mathematical seed book: multiplication,
 * division, and equal groups.
 *
 * Each template states its own grouping rule (rows and columns, repeated
 * subtraction of the package size, division with a remainder, the product of
 * the two levels of packing), so no outside fact is required and the whole
 * chapter is `no-knowledge`.
 */

export const chapter = 8;

export const cases = [
  {
    template: 'Rows and Columns',
    type: 'rows-and-columns',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/in (\d+) equal rows, with (\d+) objects in each row/);
      if (match === null) {
        throw new Error('the row count or the objects per row are missing');
      }
      return { rows: Number(match[1]), perRow: Number(match[2]) };
    },
    solve(slots) {
      let total = 0;
      for (let row = 0; row < slots.rows; row += 1) {
        total += slots.perRow;
      }
      return { total };
    },
    render(solution) {
      return String(solution.total);
    },
    compute: [
      'const slots = $slots;',
      'let total = 0;',
      'for (let row = 0; row < slots.rows; row += 1) {',
      '  total += slots.perRow;',
      '}',
      'return String(total);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The objects form ${slots.rows} equal rows of ${slots.perRow}, which is the repeated addition the problem describes.`,
        `Adding ${slots.perRow} once for each of the ${slots.rows} rows gives ${Array.from({ length: slots.rows }, () => slots.perRow).join(' + ')} = ${solution.total}.`,
        `The product ${slots.rows}×${slots.perRow} gives the same result ${solution.total}, which confirms the count.`
      ];
    }
  },
  {
    template: 'How Many Packages?',
    type: 'how-many-packages',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/We have (\d+) pencils and put them into packages of (\d+)/);
      if (match === null) {
        throw new Error('the pencil count or the package size are missing');
      }
      return { total: Number(match[1]), size: Number(match[2]) };
    },
    solve(slots) {
      if (slots.total % slots.size !== 0) {
        throw new Error('the pencils do not divide exactly into packages');
      }
      let remaining = slots.total;
      let packages = 0;
      while (remaining > 0) {
        remaining -= slots.size;
        packages += 1;
      }
      return { packages };
    },
    render(solution) {
      return `${solution.packages} packages.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.total % slots.size !== 0) {',
      '  throw new Error("the pencils do not divide exactly into packages");',
      '}',
      'let remaining = slots.total;',
      'let packages = 0;',
      'while (remaining > 0) {',
      '  remaining -= slots.size;',
      '  packages += 1;',
      '}',
      'return packages + " packages.";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The problem defines the number of packages as how many times ${slots.size} can be subtracted from ${slots.total} before reaching zero.`,
        `Repeated subtraction succeeds ${solution.packages} times, since ${slots.size}×${solution.packages} = ${slots.total}.`,
        `Because nothing remains, ${slots.total} pencils fill exactly ${solution.packages} packages of ${slots.size}.`
      ];
    }
  },
  {
    template: 'Complete Packages and a Remainder',
    type: 'complete-packages-and-a-remainder',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/There are (\d+) objects\. A complete package contains exactly (\d+)/);
      if (match === null) {
        throw new Error('the object count or the package size are missing');
      }
      return { total: Number(match[1]), size: Number(match[2]) };
    },
    solve(slots) {
      const packages = Math.floor(slots.total / slots.size);
      const remainder = slots.total - packages * slots.size;
      return { packages, remainder };
    },
    render(solution) {
      return `${solution.packages} packages and remainder ${solution.remainder}.`;
    },
    compute: [
      'const slots = $slots;',
      'const packages = Math.floor(slots.total / slots.size);',
      'const remainder = slots.total - packages * slots.size;',
      'return packages + " packages and remainder " + remainder + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Making as many complete packages as possible means subtracting ${slots.size} from ${slots.total} until fewer than ${slots.size} objects are left.`,
        `That subtraction succeeds ${solution.packages} times and leaves ${solution.remainder} objects, since ${slots.size}×${solution.packages} = ${slots.size * solution.packages}.`,
        `The remainder ${solution.remainder} is smaller than the package size ${slots.size}, so no further complete package can be formed and ${slots.total} = ${slots.size}×${solution.packages} + ${solution.remainder}.`
      ];
    }
  },
  {
    template: 'Same Quantity, Different Groupings',
    type: 'same-quantity-different-groupings',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/The same (\d+) pieces are grouped first in groups of (\d+), then in groups of (\d+)/);
      if (match === null) {
        throw new Error('the total or the two grouping sizes are missing');
      }
      return { total: Number(match[1]), first: Number(match[2]), second: Number(match[3]) };
    },
    solve(slots) {
      if (slots.total % slots.first !== 0 || slots.total % slots.second !== 0) {
        throw new Error('one of the groupings leaves a remainder');
      }
      return {
        firstSize: slots.first,
        secondSize: slots.second,
        firstGroups: slots.total / slots.first,
        secondGroups: slots.total / slots.second
      };
    },
    render(solution) {
      return `${solution.firstGroups} groups of ${solution.firstSize}; ${solution.secondGroups} groups of ${solution.secondSize}.`;
    },
    compute: [
      'const slots = $slots;',
      'if (slots.total % slots.first !== 0 || slots.total % slots.second !== 0) {',
      '  throw new Error("one of the groupings leaves a remainder");',
      '}',
      'const firstGroups = slots.total / slots.first;',
      'const secondGroups = slots.total / slots.second;',
      'return firstGroups + " groups of " + slots.first + "; " + secondGroups + " groups of " + slots.second + ".";'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `The same ${slots.total} pieces are regrouped without loss, so each grouping divides ${slots.total} exactly.`,
        `Groups of ${slots.first} give ${slots.total} ÷ ${slots.first} = ${solution.firstGroups} groups, and groups of ${slots.second} give ${slots.total} ÷ ${slots.second} = ${solution.secondGroups} groups.`,
        `Both counts satisfy ${slots.first}×${solution.firstGroups} = ${slots.second}×${solution.secondGroups} = ${slots.total}, so nothing remains in either case.`,
        `The smaller grouping size produces more groups, so ${solution.firstGroups > solution.secondGroups ? `groups of ${slots.first}` : `groups of ${slots.second}`} yield the larger number of groups.`
      ];
    }
  },
  {
    template: 'Two Levels of Packing',
    type: 'two-levels-of-packing',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/One box contains (\d+) small bags, and each bag contains (\d+) beads\. There are (\d+) identical boxes/);
      if (match === null) {
        throw new Error('the packing levels are missing');
      }
      return { bags: Number(match[1]), beads: Number(match[2]), boxes: Number(match[3]) };
    },
    solve(slots) {
      const perBox = slots.bags * slots.beads;
      return { total: slots.boxes * perBox };
    },
    render(solution) {
      return String(solution.total);
    },
    compute: [
      'const slots = $slots;',
      'return String(slots.boxes * slots.bags * slots.beads);'
    ].join('\n'),
    explain(slots, solution) {
      return [
        `Each box holds ${slots.bags} bags and each bag holds ${slots.beads} beads, so one box holds ${slots.bags}×${slots.beads} = ${slots.bags * slots.beads} beads.`,
        `There are ${slots.boxes} identical boxes, so the beads are counted once per box.`,
        `Multiplying the three levels gives ${slots.boxes}×${slots.bags}×${slots.beads} = ${solution.total} beads in total.`
      ];
    }
  }
];
