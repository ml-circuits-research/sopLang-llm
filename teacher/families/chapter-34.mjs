/**
 * Families for chapter 34 of the mathematical seed book: resources, packing,
 * budgets, and optimization.
 *
 * This chapter titles every problem individually, so each of its 25 problems
 * forms a template of one variant. Each family still parses the quantities out
 * of the statement and recomputes the answer, so the circuit is an algorithm
 * rather than a constant. Every premise the solutions use (capacities, prices,
 * durations, subdivision rules, "may be rotated", "one cut increases the number
 * of pieces by one") is stated in the problem text, so the chapter needs no
 * external fact and every case is `no-knowledge`.
 *
 * This is part A of the chapter. The parts carry disjoint cases and each
 * one repeats the header, the chapter number, and the helpers its own cases
 * call, so every part imports and loads on its own.
 */

export const chapter = 34;

const WORD_NUMBERS = Object.freeze({
  one: 1,
  once: 1,
  two: 2,
  twice: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10
});

function numberWord(text) {
  const value = WORD_NUMBERS[String(text).toLowerCase()];
  if (value === undefined) {
    throw new Error(`the word "${text}" is not a supported number`);
  }
  return value;
}
function requireMatch(statement, pattern, label) {
  const match = statement.match(pattern);
  if (match === null) {
    throw new Error(`${label} is missing from the statement`);
  }
  return match.slice(1);
}
function numbers(statement, pattern, label) {
  return requireMatch(statement, pattern, label).map(Number);
}
function words(statement, pattern, label) {
  return requireMatch(statement, pattern, label);
}
function plural(count, singular) {
  return `${count} ${count === 1 ? singular : `${singular}s`}`;
}
/** Build the `@answer jsEval` body; `$slots` carries the values parsed from the statement. */
function circuit(lines) {
  return ['const slots = $slots;', ...lines].join('\n');
}
export const cases = [
  {
    template: 'Boxes with fixed capacity',
    type: 'boxes-with-fixed-capacity',
    category: 'no-knowledge',
    parse(statement) {
      const [items] = numbers(statement, /(\d+) books must be packed/, 'the book count');
      const [capacity] = numbers(statement, /hold at most (\d+)/, 'the box capacity');
      return { items, capacity };
    },
    solve(slots) { return { boxes: Math.ceil(slots.items / slots.capacity) }; },
    render(solution) { return `${solution.boxes} boxes.`; },
    compute: circuit(['return Math.ceil(slots.items / slots.capacity) + " boxes.";']),
    explain(slots, solution) {
      return [
        `A box holds at most ${slots.capacity}, so each full box takes ${slots.capacity} of the ${slots.items} books.`,
        `Dividing ${slots.items} by ${slots.capacity} leaves a remainder, and a partly filled box still counts as a box.`,
        `Rounding the division up gives ${solution.boxes} boxes, because one box fewer would leave books unpacked.`
      ];
    }
  },
  {
    template: 'Minimum wasted space',
    type: 'minimum-wasted-space',
    category: 'no-knowledge',
    parse(statement) {
      const [objects, aWord, aCapacity, bWord, bCapacity] = words(
        statement,
        /You have (\d+) objects\. Option A: (\w+) boxes of capacity (\d+) each\. Option B: (\w+) boxes of capacity (\d+) each/,
        'the option data'
      );
      return {
        objects: Number(objects),
        optionA: { boxes: numberWord(aWord), capacity: Number(aCapacity) },
        optionB: { boxes: numberWord(bWord), capacity: Number(bCapacity) }
      };
    },
    solve(slots) {
      const waste = (option) => option.boxes * option.capacity - slots.objects;
      return { wasteA: waste(slots.optionA), wasteB: waste(slots.optionB) };
    },
    render(solution) {
      if (solution.wasteA === solution.wasteB) { return `Equal: ${solution.wasteA} unused places.`; }
      return solution.wasteA < solution.wasteB
        ? `Option A: ${solution.wasteA} unused places.`
        : `Option B: ${solution.wasteB} unused places.`;
    },
    compute: circuit([
      'const waste = (option) => option.boxes * option.capacity - slots.objects;',
      'const wasteA = waste(slots.optionA);',
      'const wasteB = waste(slots.optionB);',
      'if (wasteA === wasteB) { return "Equal: " + wasteA + " unused places."; }',
      'return wasteA < wasteB ? "Option A: " + wasteA + " unused places." : "Option B: " + wasteB + " unused places.";'
    ]),
    explain(slots, solution) {
      return [
        `Unused space is what the chosen boxes can hold minus the ${slots.objects} objects.`,
        `Option A uses ${slots.optionA.boxes} boxes of ${slots.optionA.capacity}, leaving ${solution.wasteA}; option B uses ${slots.optionB.boxes} boxes of ${slots.optionB.capacity}, leaving ${solution.wasteB}.`,
        `Comparing the leftovers shows the options are equal, so neither wastes less than the other.`
      ];
    }
  },
  {
    template: 'Choose the box that fits the longest object dimension',
    type: 'choose-the-box-that-fits-the-longest-object-dimension',
    category: 'no-knowledge',
    parse(statement) {
      const [objectA, objectB, aA, aB, bA, bB] = numbers(
        statement,
        /measures (\d+)[×x](\d+)\. Box A has interior dimensions (\d+)[×x](\d+), box B (\d+)[×x](\d+)/,
        'the box and object dimensions'
      );
      return { object: [objectA, objectB], boxA: [aA, aB], boxB: [bA, bB] };
    },
    solve(slots) {
      const fits = (box) =>
        Math.min(...slots.object) <= Math.min(...box) && Math.max(...slots.object) <= Math.max(...box);
      const names = [['A', slots.boxA], ['B', slots.boxB]].filter((entry) => fits(entry[1])).map((entry) => entry[0]);
      return { names };
    },
    render(solution) {
      if (solution.names.length === 1) { return `Box ${solution.names[0]}.`; }
      return solution.names.length === 0 ? 'Neither box.' : `Boxes ${solution.names.join(' and ')}.`;
    },
    compute: circuit([
      'const short = Math.min(slots.object[0], slots.object[1]);',
      'const long = Math.max(slots.object[0], slots.object[1]);',
      'const fits = (box) => short <= Math.min(box[0], box[1]) && long <= Math.max(box[0], box[1]);',
      'const names = [["A", slots.boxA], ["B", slots.boxB]].filter((entry) => fits(entry[1])).map((entry) => entry[0]);',
      'if (names.length === 1) { return "Box " + names[0] + "."; }',
      'return names.length === 0 ? "Neither box." : "Boxes " + names.join(" and ") + ".";'
    ]),
    explain(slots, solution) {
      return [
        `Because the object may be rotated, only its shorter and longer sides matter: ${Math.min(...slots.object)} and ${Math.max(...slots.object)}.`,
        `Box A offers ${slots.boxA.join(' and ')}, box B offers ${slots.boxB.join(' and ')}; a box holds the object when both object sides fit inside its sides.`,
        `Only ${solution.names.join(' and ')} satisfies both comparisons, so that is the box that holds the object without bending it.`
      ];
    }
  },
  {
    template: 'Budget with two types of objects',
    type: 'budget-with-two-types-of-objects',
    category: 'no-knowledge',
    parse(statement) {
      const [budget, notebookCost, pencilCost] = numbers(
        statement,
        /You have (\d+) lei\. A notebook costs (\d+) lei and a pencil (\d+) lei/,
        'the budget and the prices'
      );
      return { budget, notebookCost, pencilCost };
    },
    solve(slots) {
      let best = null;
      for (let notebooks = 1; notebooks * slots.notebookCost <= slots.budget; notebooks += 1) {
        const pencils = Math.floor((slots.budget - notebooks * slots.notebookCost) / slots.pencilCost);
        const total = notebooks + pencils;
        if (best === null || total > best.total) { best = { notebooks, pencils, total }; }
      }
      if (best === null) { throw new Error('the budget cannot buy even one notebook'); }
      return best;
    },
    render(solution) {
      return `${plural(solution.notebooks, 'notebook')} and ${plural(solution.pencils, 'pencil')}: ${solution.total} objects.`;
    },
    compute: circuit([
      'let best = null;',
      'for (let notebooks = 1; notebooks * slots.notebookCost <= slots.budget; notebooks += 1) {',
      '  const pencils = Math.floor((slots.budget - notebooks * slots.notebookCost) / slots.pencilCost);',
      '  const total = notebooks + pencils;',
      '  if (best === null || total > best.total) { best = { notebooks, pencils, total }; }',
      '}',
      'if (best === null) { throw new Error("the budget cannot buy even one notebook"); }',
      'const label = (count, noun) => count + " " + (count === 1 ? noun : noun + "s");',
      'return label(best.notebooks, "notebook") + " and " + label(best.pencils, "pencil") + ": " + best.total + " objects.";'
    ]),
    explain(slots, solution) {
      return [
        `At least one notebook must be bought, so the ${slots.budget} lei must first cover a notebook of ${slots.notebookCost} lei.`,
        `Whatever is left buys as many pencils as possible at ${slots.pencilCost} lei each, because pencils are the cheaper object.`,
        `Spending more on notebooks only reduces the remaining money, so one notebook plus ${solution.pencils} pencils gives the largest total of ${solution.total} objects.`
      ];
    }
  },
  {
    template: 'Budget with a minimum requirement in each category',
    type: 'budget-with-a-minimum-requirement-in-each-category',
    category: 'no-knowledge',
    parse(statement) {
      const [budget, minimumA, costA, minimumB, costB] = numbers(
        statement,
        /You have (\d+) lei\. You must buy at least (\d+) objects A at (\d+) lei each and at least (\d+) objects B at (\d+) lei each/,
        'the budget and the minimum requirements'
      );
      return { budget, minimumA, costA, minimumB, costB };
    },
    solve(slots) {
      const cost = slots.minimumA * slots.costA + slots.minimumB * slots.costB;
      return { cost, remaining: slots.budget - cost };
    },
    render(solution) { return `${solution.cost} lei; ${solution.remaining} lei remain.`; },
    compute: circuit([
      'const cost = slots.minimumA * slots.costA + slots.minimumB * slots.costB;',
      'return cost + " lei; " + (slots.budget - cost) + " lei remain.";'
    ]),
    explain(slots, solution) {
      return [
        `The requirement forces the smallest allowed purchase: ${slots.minimumA} objects A and ${slots.minimumB} objects B.`,
        `Its cost is ${slots.minimumA}×${slots.costA} + ${slots.minimumB}×${slots.costB} = ${solution.cost} lei, and buying more would only cost more.`,
        `Subtracting that from the ${slots.budget} lei budget leaves ${solution.remaining} lei untouched.`
      ];
    }
  },
  {
    template: 'Coins: minimum number of pieces',
    type: 'coins-minimum-number-of-pieces',
    category: 'no-knowledge',
    parse(statement) {
      const [first, second, third, target] = numbers(
        statement,
        /coins worth (\d+), (\d+), and (\d+) units[\s\S]*make (\d+) using/,
        'the coin values and the target'
      );
      return { coins: [first, second, third], target };
    },
    solve(slots) {
      const best = [0];
      for (let value = 1; value <= slots.target; value += 1) {
        best[value] = Math.min(...slots.coins.filter((coin) => coin <= value).map((coin) => best[value - coin] + 1));
      }
      const descending = [...slots.coins].sort((left, right) => right - left);
      const combo = [];
      for (let value = slots.target; value > 0; ) {
        const coin = descending.find((candidate) => candidate <= value && best[value - candidate] + 1 === best[value]);
        if (coin === undefined) { throw new Error(`the amount ${slots.target} cannot be made from the given coins`); }
        combo.push(coin);
        value -= coin;
      }
      return { count: combo.length, combo };
    },
    render(solution) { return `${solution.count} coins: ${solution.combo.join('+')}.`; },
    compute: circuit([
      'const best = [0];',
      'for (let value = 1; value <= slots.target; value += 1) {',
      '  best[value] = Math.min(...slots.coins.filter((coin) => coin <= value).map((coin) => best[value - coin] + 1));',
      '}',
      'const descending = slots.coins.slice().sort((left, right) => right - left);',
      'const combo = [];',
      'let value = slots.target;',
      'while (value > 0) {',
      '  const coin = descending.find((candidate) => candidate <= value && best[value - candidate] + 1 === best[value]);',
      '  if (coin === undefined) { throw new Error(`the amount ${slots.target} cannot be made from the given coins`); }',
      '  combo.push(coin);',
      '  value -= coin;',
      '}',
      'return combo.length + " coins: " + combo.join("+") + ".";'
    ]),
    explain(slots, solution) {
      return [
        `Making ${slots.target} is searched coin by coin, keeping the smallest number of pieces for every intermediate amount.`,
        `The table starts at 0 pieces for amount 0 and grows to ${slots.target}, so each amount reuses the best solution of a smaller amount.`,
        `The reconstruction takes ${solution.combo.join(' + ')} = ${slots.target} with ${solution.count} coins, and no other choice uses fewer pieces.`
      ];
    }
  },
  {
    template: 'Exact payment versus overshooting',
    type: 'exact-payment-versus-overshooting',
    category: 'no-knowledge',
    parse(statement) {
      const [firstCoin, secondCoin, first, second] = numbers(
        statement,
        /coins worth (\d+) and (\d+) units[\s\S]*pay exactly (\d+)\? What about exactly (\d+)\?/,
        'the coin values and the amounts'
      );
      return { coins: [firstCoin, secondCoin], first, second };
    },
    solve(slots) {
      const payable = (amount) => {
        for (let count = 0; count * slots.coins[0] <= amount; count += 1) {
          if ((amount - count * slots.coins[0]) % slots.coins[1] === 0) { return true; }
        }
        return false;
      };
      return {
        firstAmount: slots.first,
        secondAmount: slots.second,
        first: payable(slots.first),
        second: payable(slots.second)
      };
    },
    render(solution) {
      return `${solution.firstAmount}: ${solution.first ? 'yes' : 'no'}; ${solution.secondAmount}: ${solution.second ? 'yes' : 'no'}.`;
    },
    compute: circuit([
      'const payable = (amount) => {',
      '  for (let count = 0; count * slots.coins[0] <= amount; count += 1) {',
      '    if ((amount - count * slots.coins[0]) % slots.coins[1] === 0) { return true; }',
      '  }',
      '  return false;',
      '};',
      'return slots.first + ": " + (payable(slots.first) ? "yes" : "no") + "; " + slots.second + ": " + (payable(slots.second) ? "yes" : "no") + ".";'
    ]),
    explain(slots, solution) {
      return [
        `Only combinations ${slots.coins[0]}a + ${slots.coins[1]}b can be paid, so each amount is tested by checking whether the rest after some ${slots.coins[0]}-coins divides by ${slots.coins[1]}.`,
        `${slots.first} splits into whole coins while ${slots.second} leaves a remainder for every count, because both coin values are even and ${slots.second} is odd.`,
        `So the first amount can be paid exactly and the second cannot.`
      ];
    }
  },
  {
    template: 'Minimum cuts for equal pieces',
    type: 'minimum-cuts-for-equal-pieces',
    category: 'no-knowledge',
    parse(statement) {
      const [pieces] = numbers(statement, /divided into (\d+) pieces/, 'the number of pieces');
      return { pieces };
    },
    solve(slots) { return { cuts: slots.pieces - 1 }; },
    render(solution) { return `${solution.cuts} cuts.`; },
    compute: circuit(['return (slots.pieces - 1) + " cuts.";']),
    explain(slots, solution) {
      return [
        `One cut turns a single rod into two pieces, and the problem states that each further cut adds exactly one piece.`,
        `After k cuts the rod has 1 + k pieces, so reaching ${slots.pieces} pieces means 1 + k = ${slots.pieces}.`,
        `Solving that gives ${solution.cuts} cuts, and no arrangement without stacking can do it faster.`
      ];
    }
  },
  {
    template: 'Cuts when stacking is allowed',
    type: 'cuts-when-stacking-is-allowed',
    category: 'no-knowledge',
    parse(statement) {
      const [sheetWord, , pieceWord] = words(
        statement,
        /(\w+) identical sheets[\s\S]*cut each sheet (\w+) into (\w+) pieces/,
        'the sheet and cutting data'
      );
      return { sheets: numberWord(sheetWord), piecesPerSheet: numberWord(pieceWord) };
    },
    solve(slots) { return { motions: slots.piecesPerSheet - 1 }; },
    render(solution) { return `${plural(solution.motions, 'motion')}.`; },
    compute: circuit([
      'const motions = slots.piecesPerSheet - 1;',
      'return motions + " motion" + (motions === 1 ? "" : "s") + ".";'
    ]),
    explain(slots, solution) {
      return [
        `Cutting one sheet into ${slots.piecesPerSheet} pieces needs ${slots.piecesPerSheet - 1} cuts if it is cut alone.`,
        `Because the ${slots.sheets} sheets are perfectly stacked, one cutting motion passes through all of them at once.`,
        `So the ${slots.piecesPerSheet - 1} cut is done in a single motion, and no motion can be saved further.`
      ];
    }
  }
];
