/**
 * Families for chapter 27 of the mathematical seed book: data, pictograms, and
 * tables as models.
 *
 * Chapter 27 titles every problem individually, so each printed template has a
 * single variant and a case of its own: a pictogram scale, a half symbol, the
 * tallest bar, a difference, the missing cell of a total, the corrected datum,
 * the two filtered tables, and so on. Every premise of a solution is printed in
 * the problem text, including the legend of a pictogram and the rule that ranks
 * teams, so all cases are `no-knowledge`.
 *
 * Problem 27.22 ("Total by day from a two-way table") hands its premise to
 * 27.21: "With the same data, how many points were obtained on Monday in
 * total?" names no values at all. The family declares that referenced table as
 * a `sharedPremise`, expressed with the cells the statement of 27.21 prints
 * ("Using Ana-Monday=3, Ana-Tuesday=5, Dan-Monday=4, Dan-Tuesday=2, ..."), so
 * the writer prints it as a `Referenced context:` line and the parse reads the
 * table from the same text a solver receives; no value comes from the answer
 * key or from the solution steps.
 */

export const unit = 27;

/** Join JavaScript statements into the body of a `jsEval` wire. */
function jsEval(...lines) {
  return lines.join('\n');
}

/** Join names the way the source prints them: "A", "A and B", "A, B and C". */
function joinWithAnd(names) {
  if (names.length <= 1) {
    return names.join('');
  }
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
}

/** Read the printed `label=value` pairs of a table statement, in order. */
function pairsIn(text, pattern = /([A-Za-z]+)=(\d+)/g) {
  return [...text.matchAll(pattern)].map((match) => [match[1], Number(match[2])]);
}

/** Read the `row-column=value` cells of a two-way table. */
function cellsIn(statement) {
  return [...statement.matchAll(/(\w+)-(\w+)=(\d+)/g)].map((match) => [match[1], match[2], Number(match[3])]);
}

const READ = 'const slots = $slots;';
const JOIN_KEPT = 'const joined = kept.length <= 1 ? kept.join("") : kept.slice(0, -1).join(", ") + " and " + kept[kept.length - 1];';
const SUM_VALUES = 'const sum = slots.values.reduce((acc, value) => acc + value, 0);';
const TOTAL_MINUS_KNOWN = jsEval(READ, 'const known = slots.values.reduce((sum, entry) => sum + entry[1], 0);', 'return String(slots.total - known) + ".";');

export const cases = [
  {
    template: 'A pictogram where one symbol represents two objects',
    type: 'a-pictogram-where-one-symbol-represents-two-objects',
    category: 'no-knowledge',
    parse(statement) {
      const legend = statement.match(/each (\S+) represents (\d+) ([a-z]+)/);
      const row = statement.match(/shows ([^\s.]+)/);
      if (legend === null || row === null) throw new Error('the pictogram legend or the symbol row is missing');
      const count = [...row[1]].filter((char) => char === legend[1]).length;
      if (count === 0) throw new Error('the symbol row contains none of the legend symbols');
      return { symbol: legend[1], perSymbol: Number(legend[2]), unit: legend[3], count };
    },
    solve(slots) { return { total: slots.count * slots.perSymbol, unit: slots.unit }; },
    render(solution) { return `${solution.total} ${solution.unit}.`; },
    compute: jsEval(READ, 'return String(slots.count * slots.perSymbol) + " " + slots.unit + ".";'),
    explain(slots, solution) {
      return [`The legend fixes the scale of the pictogram: one ${slots.symbol} stands for ${slots.perSymbol} ${slots.unit}.`, `The row prints ${slots.count} symbols and every symbol carries the same value, so ${slots.count} times ${slots.perSymbol} gives ${solution.total} ${slots.unit}.`];
    }
  },
  {
    template: 'Half a symbol in a pictogram',
    type: 'half-a-symbol-in-a-pictogram',
    category: 'no-knowledge',
    parse(statement) {
      const legend = statement.match(/Each (\S+) represents (\d+) ([a-z]+), and half a \S+ represents (\d+)/);
      const row = statement.match(/contains ([^.]*)\./);
      if (legend === null || row === null) throw new Error('the pictogram legend or the row is missing');
      const halves = (row[1].match(/half a/g) ?? []).length;
      const symbols = [...row[1]].filter((char) => char === legend[1]).length;
      if (symbols < halves) throw new Error('the row shows more half symbols than symbols');
      return { symbol: legend[1], perSymbol: Number(legend[2]), unit: legend[3], perHalf: Number(legend[4]), whole: symbols - halves, halves };
    },
    solve(slots) { return { total: slots.whole * slots.perSymbol + slots.halves * slots.perHalf, unit: slots.unit }; },
    render(solution) { return `${solution.total} ${solution.unit}.`; },
    compute: jsEval(READ, 'const total = slots.whole * slots.perSymbol + slots.halves * slots.perHalf;', 'return String(total) + " " + slots.unit + ".";'),
    explain(slots, solution) {
      return [`The legend gives two values: a complete ${slots.symbol} is worth ${slots.perSymbol} ${slots.unit} and half of one is worth ${slots.perHalf}.`, `The row has ${slots.whole} complete symbols and ${slots.halves} half symbol, so each kind is scaled by its own legend value and the results are added to ${solution.total} ${slots.unit}.`];
    }
  },
  {
    template: 'The tallest bar',
    type: 'the-tallest-bar',
    category: 'no-knowledge',
    parse(statement) {
      const entries = pairsIn(statement);
      if (entries.length < 2) throw new Error('the graph values are missing');
      return { entries };
    },
    solve(slots) {
      let best = slots.entries[0];
      for (const entry of slots.entries) {
        if (entry[1] > best[1]) best = entry;
      }
      return { label: best[0], value: best[1] };
    },
    render(solution) { return `${solution.label}.`; },
    compute: jsEval(READ, 'let best = slots.entries[0];', 'for (const entry of slots.entries) { if (entry[1] > best[1]) { best = entry; } }', 'return best[0] + ".";'),
    explain(slots, solution) {
      return ['The text states that bar height follows the value, so the tallest bar belongs to the greatest number.', `Comparing ${slots.entries.map(([label, value]) => `${label}=${value}`).join(', ')} leaves ${solution.value} as the maximum, and that value belongs to category ${solution.label}.`];
    }
  },
  {
    template: 'The difference between two bars',
    type: 'the-difference-between-two-bars',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/category (\w+) has value (\d+) and (\w+) has value (\d+)/);
      if (match === null) throw new Error('the two bars are missing');
      return { left: match[1], leftValue: Number(match[2]), right: match[3], rightValue: Number(match[4]) };
    },
    solve(slots) { return { difference: slots.leftValue - slots.rightValue }; },
    render(solution) { return `${solution.difference}.`; },
    compute: jsEval(READ, 'return String(slots.leftValue - slots.rightValue) + ".";'),
    explain(slots, solution) {
      return [`The question "by how much is ${slots.left} greater than ${slots.right}" asks for a difference, not for a sum.`, `Subtracting the smaller value from the larger one gives ${slots.leftValue} minus ${slots.rightValue}, which is ${solution.difference}.`];
    }
  },
  {
    template: 'A missing value from the total',
    type: 'a-missing-value-from-the-total',
    category: 'no-knowledge',
    parse(statement) {
      const values = pairsIn(statement);
      const missing = statement.match(/([A-Z])=\?/);
      const total = statement.match(/total is (\d+)/);
      if (values.length === 0 || missing === null || total === null) throw new Error('the known values, the missing category, or the total is missing');
      return { values, missing: missing[1], total: Number(total[1]) };
    },
    solve(slots) {
      const value = slots.total - slots.values.reduce((sum, [, entry]) => sum + entry, 0);
      if (value < 0) throw new Error('the stated total is smaller than the known values');
      return { value, missing: slots.missing };
    },
    render(solution) { return `${solution.value}.`; },
    compute: jsEval(READ, 'const known = slots.values.reduce((sum, entry) => sum + entry[1], 0);', 'const value = slots.total - known;', 'if (value < 0) { throw new Error("the stated total is smaller than the known values"); }', 'return String(value) + ".";'),
    explain(slots, solution) {
      return [`The total of the table splits into the printed values plus the missing one, and the printed values add up to ${slots.total - solution.value}.`, `Taking that part away from the stated total ${slots.total} leaves ${solution.value} for ${slots.missing}.`];
    }
  },
  {
    template: 'A table with a row total',
    type: 'a-table-with-a-row-total',
    category: 'no-knowledge',
    parse(statement) {
      const values = pairsIn(statement).filter(([label]) => label !== 'total');
      const total = statement.match(/total=(\d+)/);
      const asked = statement.match(/How many (\w+)/);
      if (values.length === 0 || total === null || asked === null) throw new Error('the row, the asked category, or the row total is missing');
      return { values, asked: asked[1], total: Number(total[1]) };
    },
    solve(slots) {
      const known = slots.values.reduce((sum, [, value]) => sum + value, 0);
      return { value: slots.total - known, asked: slots.asked };
    },
    render(solution) { return `${solution.value}.`; },
    compute: TOTAL_MINUS_KNOWN,
    explain(slots, solution) {
      return ['A row total is the sum of the cells in that row, so the total is fixed and only the missing cell is unknown.', `The printed cells add up to ${slots.total - solution.value} and the row total is ${slots.total}, so the row must contain ${solution.value} ${solution.asked}.`];
    }
  },
  {
    template: 'A table with a column total',
    type: 'a-table-with-a-column-total',
    category: 'no-knowledge',
    parse(statement) {
      const values = pairsIn(statement);
      const missing = statement.match(/([A-Z])=\?/);
      const total = statement.match(/total is (\d+)/);
      if (values.length === 0 || missing === null || total === null) throw new Error('the column values, the missing class, or the column total is missing');
      return { values, missing: missing[1], total: Number(total[1]) };
    },
    solve(slots) {
      const value = slots.total - slots.values.reduce((sum, [, entry]) => sum + entry, 0);
      if (value < 0) throw new Error('the stated total is smaller than the printed values');
      return { value, missing: slots.missing };
    },
    render(solution) { return `${solution.value}.`; },
    compute: jsEval(READ, 'const known = slots.values.reduce((sum, entry) => sum + entry[1], 0);', 'const value = slots.total - known;', 'if (value < 0) { throw new Error("the stated total is smaller than the printed values"); }', 'return String(value) + ".";'),
    explain(slots, solution) {
      return [`A column total is read down the column, so the printed classes plus the missing one must equal ${slots.total}.`, `The printed classes add up to ${slots.total - solution.value}, so ${slots.missing} contributes the remaining ${solution.value}.`];
    }
  },
  {
    template: 'Checking whether a stated total is correct',
    type: 'checking-whether-a-stated-total-is-correct',
    category: 'no-knowledge',
    parse(statement) {
      const list = statement.match(/lists ([\d,\s]+) and states/);
      const stated = statement.match(/total is (\d+)/);
      if (list === null || stated === null) throw new Error('the listed values or the stated total is missing');
      return { values: list[1].split(',').map((value) => Number(value.trim())), stated: Number(stated[1]) };
    },
    solve(slots) {
      const sum = slots.values.reduce((acc, value) => acc + value, 0);
      return { sum, correct: sum === slots.stated };
    },
    render(solution) { return solution.correct ? 'Yes.' : `No; the correct total is ${solution.sum}.`; },
    compute: jsEval(READ, SUM_VALUES, 'return sum === slots.stated ? "Yes." : "No; the correct total is " + sum + ".";'),
    explain(slots, solution) {
      return [`A total must be recomputed from the listed values instead of being taken from the statement; here they add up to ${solution.sum}.`, solution.correct ? `The table states ${slots.stated} as well, so the stated total is correct.` : `The table states ${slots.stated}, so the stated total is wrong and the correct value is ${solution.sum}.`];
    }
  },
  {
    template: 'Two tables describing the same data',
    type: 'two-tables-describing-the-same-data',
    category: 'no-knowledge',
    parse(statement) {
      const tableA = statement.match(/Table A has ([^.]*)\./);
      const tableB = statement.match(/gives values ([\d,\s]+) in the order ([^.]*)\./);
      if (tableA === null || tableB === null) throw new Error('one of the two tables is missing');
      const days = tableB[2].split(/,\s*|\s+and\s+/);
      const values = tableB[1].split(',').map((value) => Number(value.trim()));
      if (days.length !== values.length) throw new Error('Table B lists a different number of days and values');
      return { tableA: pairsIn(tableA[1]), tableB: days.map((day, index) => [day, values[index]]) };
    },
    solve(slots) {
      const mapA = new Map(slots.tableA);
      const same = slots.tableA.length === slots.tableB.length && slots.tableB.every(([day, value]) => mapA.get(day) === value);
      return { same };
    },
    render(solution) { return solution.same ? 'Yes.' : 'No.'; },
    compute: jsEval(READ, 'const mapA = new Map(slots.tableA);', 'const same = slots.tableA.length === slots.tableB.length && slots.tableB.every((row) => mapA.get(row[0]) === row[1]);', 'return same ? "Yes." : "No.";'),
    explain(slots, solution) {
      return ['Two tables describe the same data when every day keeps its own value, even if the rows are printed in a different order.', `Reading Table B by its day labels gives ${slots.tableB.map(([day, value]) => `${day}=${value}`).join(', ')}, which matches Table A, so the two presentations agree.`];
    }
  },
  {
    template: 'Sorting categories by value',
    type: 'sorting-categories-by-value',
    category: 'no-knowledge',
    parse(statement) {
      const entries = pairsIn(statement);
      if (entries.length < 2) throw new Error('the category values are missing');
      return { entries };
    },
    solve(slots) { return { order: [...slots.entries].sort((left, right) => right[1] - left[1]).map((entry) => entry[0]) }; },
    render(solution) { return `${solution.order.join(', ')}.`; },
    compute: jsEval(READ, 'const order = [...slots.entries].sort((left, right) => right[1] - left[1]).map((entry) => entry[0]);', 'return order.join(", ") + ".";'),
    explain(slots, solution) {
      return ['The categories are compared only through their values, so the ranking is a descending sort of the printed pairs.', `Sorting ${slots.entries.map(([label, value]) => `${label}=${value}`).join(', ')} from greatest to least gives ${solution.order.join(', ')}.`];
    }
  },
  {
    template: 'Two equal categories',
    type: 'two-equal-categories',
    category: 'no-knowledge',
    parse(statement) {
      const entries = pairsIn(statement);
      if (entries.length < 2) throw new Error('the category values are missing');
      return { entries };
    },
    solve(slots) {
      const groups = new Map();
      for (const [label, value] of slots.entries) {
        groups.set(value, [...(groups.get(value) ?? []), label]);
      }
      for (const list of groups.values()) {
        if (list.length === 2) return { categories: list };
      }
      throw new Error('no two categories share a value');
    },
    render(solution) { return `${joinWithAnd(solution.categories)}.`; },
    compute: jsEval(READ, 'const groups = new Map();', 'for (const entry of slots.entries) { groups.set(entry[1], [...(groups.get(entry[1]) ?? []), entry[0]]); }', 'for (const list of groups.values()) { if (list.length === 2) { return list[0] + " and " + list[1] + "."; } }', 'throw new Error("no two categories share a value");'),
    explain(slots, solution) {
      return ['Equality of values is found by grouping the categories by their number instead of comparing every pair by eye.', `Grouping ${slots.entries.map(([label, value]) => `${label}=${value}`).join(', ')} leaves one group with two members, ${joinWithAnd(solution.categories)}, while every other value appears once.`];
    }
  },
  {
    template: 'Increase from one day to the next',
    type: 'increase-from-one-day-to-the-next',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/There are (\d+) \w+ on \w+ and (\d+) on \w+/);
      if (match === null) throw new Error('the two daily counts are missing');
      return { earlier: Number(match[1]), later: Number(match[2]) };
    },
    solve(slots) {
      if (slots.later < slots.earlier) throw new Error('the problem states an increase but the later count is smaller');
      return { increase: slots.later - slots.earlier };
    },
    render(solution) { return `By ${solution.increase}.`; },
    compute: jsEval(READ, 'if (slots.later < slots.earlier) { throw new Error("the problem states an increase but the later count is smaller"); }', 'return "By " + (slots.later - slots.earlier) + ".";'),
    explain(slots, solution) {
      return [`A change from one day to the next is the later count minus the earlier one: ${slots.later} minus ${slots.earlier}.`, `The result ${solution.increase} is positive, which is why the problem calls it an increase.`];
    }
  },
  {
    template: 'Decrease from one day to the next',
    type: 'decrease-from-one-day-to-the-next',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/There are (\d+) \w+ on \w+ and (\d+) on \w+/);
      if (match === null) throw new Error('the two daily counts are missing');
      return { earlier: Number(match[1]), later: Number(match[2]) };
    },
    solve(slots) {
      if (slots.later > slots.earlier) throw new Error('the problem states a decrease but the later count is larger');
      return { decrease: slots.earlier - slots.later };
    },
    render(solution) { return `By ${solution.decrease}.`; },
    compute: jsEval(READ, 'if (slots.later > slots.earlier) { throw new Error("the problem states a decrease but the later count is larger"); }', 'return "By " + (slots.earlier - slots.later) + ".";'),
    explain(slots, solution) {
      return [`The size of a decrease is measured from the earlier value to the later one: ${slots.earlier} minus ${slots.later}.`, `The result ${solution.decrease} is how many units disappeared, which is how the decrease is reported.`];
    }
  },
  {
    template: 'A cumulative value',
    type: 'a-cumulative-value',
    category: 'no-knowledge',
    parse(statement) {
      const entries = pairsIn(statement);
      const unit = statement.match(/How many (\w+) were sold/);
      if (entries.length < 2 || unit === null) throw new Error('the daily values or the counted unit is missing');
      return { entries, unit: unit[1] };
    },
    solve(slots) { return { total: slots.entries.reduce((sum, [, value]) => sum + value, 0), unit: slots.unit }; },
    render(solution) { return `${solution.total} ${solution.unit}.`; },
    compute: jsEval(READ, 'const total = slots.entries.reduce((sum, entry) => sum + entry[1], 0);', 'return String(total) + " " + slots.unit + ".";'),
    explain(slots, solution) {
      return ['A cumulative value over several days is the sum of the daily values, because each item belongs to exactly one day.', `Adding ${slots.entries.map(([label, value]) => `${label}=${value}`).join(', ')} gives ${solution.total} ${slots.unit}.`];
    }
  },
  {
    template: 'How much more is needed to reach a target',
    type: 'how-much-more-is-needed-to-reach-a-target',
    category: 'no-knowledge',
    parse(statement) {
      const collected = statement.match(/(\d+) and (\d+) (\w+) were collected/);
      const target = statement.match(/target is (\d+)/);
      if (collected === null || target === null) throw new Error('the collected values or the target is missing');
      return { collected: [Number(collected[1]), Number(collected[2])], target: Number(target[1]), unit: collected[3] };
    },
    solve(slots) { return { needed: slots.target - slots.collected.reduce((sum, value) => sum + value, 0), unit: slots.unit }; },
    render(solution) { return `${solution.needed} ${solution.unit}.`; },
    compute: jsEval(READ, 'const collected = slots.collected.reduce((sum, value) => sum + value, 0);', 'return String(slots.target - collected) + " " + slots.unit + ".";'),
    explain(slots, solution) {
      return [`The collected values ${slots.collected.join(' and ')} form the running part of the target ${slots.target}.`, `Subtracting them leaves ${solution.needed} ${slots.unit}, which is what the last day must add to reach the target exactly.`];
    }
  },
  {
    template: "A category's share as part of the total",
    type: 'a-categorys-share-as-part-of-the-total',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/Of (\d+) \w+, (\d+) are \w+/);
      if (match === null) throw new Error('the total or the part of the share is missing');
      return { total: Number(match[1]), part: Number(match[2]) };
    },
    solve(slots) {
      if (slots.part > slots.total) throw new Error('the part is larger than the total');
      return { part: slots.part, total: slots.total };
    },
    render(solution) { return `${solution.part}/${solution.total}.`; },
    compute: jsEval(READ, 'if (slots.part > slots.total) { throw new Error("the part is larger than the total"); }', 'return slots.part + "/" + slots.total + ".";'),
    explain(slots, solution) {
      return ['The problem defines the share as the fraction "number of the colour divided by the total number", so the two numbers keep the roles the text gives them.', `There are ${slots.part} objects of the colour among ${slots.total} objects, so the share is written ${solution.part}/${solution.total}.`];
    }
  },
  {
    template: 'A dominant category under two criteria',
    type: 'a-dominant-category-under-two-criteria',
    category: 'no-knowledge',
    parse(statement) {
      const teams = [...statement.matchAll(/([A-Z])=\((\d+)[^,]*,\s*(\d+)/g)].map((match) => [match[1], Number(match[2]), Number(match[3])]);
      if (teams.length < 2) throw new Error('the teams with their scores and penalties are missing');
      return { teams };
    },
    solve(slots) {
      let winner = slots.teams[0];
      for (const team of slots.teams) {
        if (team[1] > winner[1]) winner = team;
        else if (team[1] === winner[1] && team[2] < winner[2]) winner = team;
      }
      return { winner: winner[0], score: winner[1], penalties: winner[2] };
    },
    render(solution) { return `Team ${solution.winner}.`; },
    compute: jsEval(READ, 'let winner = slots.teams[0];', 'for (const team of slots.teams) {', '  if (team[1] > winner[1]) { winner = team; }', '  else if (team[1] === winner[1] && team[2] < winner[2]) { winner = team; }', '}', 'return "Team " + winner[0] + ".";'),
    explain(slots, solution) {
      return ['The ranking rule has two stages applied in the stated order: the score decides first, and penalties decide only a tie.', `Reading the teams as ${slots.teams.map(([name, score, penalties]) => `${name}: ${score} points, ${penalties} penalties`).join('; ')} shows that the highest score is shared, and the tie is broken by the smaller penalty count.`, `Team ${solution.winner} wins with ${solution.penalties} penalties.`];
    }
  },
  {
    template: 'Filtering a table by a condition',
    type: 'filtering-a-table-by-a-condition',
    category: 'no-knowledge',
    parse(statement) {
      const entries = pairsIn(statement);
      const threshold = statement.match(/at least (\d+)/);
      if (entries.length === 0 || threshold === null) throw new Error('the table values or the filter condition is missing');
      return { entries, threshold: Number(threshold[1]) };
    },
    solve(slots) {
      const kept = slots.entries.filter(([, value]) => value >= slots.threshold).map(([label]) => label);
      if (kept.length === 0) throw new Error('the filter keeps no category');
      return { kept };
    },
    render(solution) { return `${joinWithAnd(solution.kept)}.`; },
    compute: jsEval(READ, 'const kept = slots.entries.filter((entry) => entry[1] >= slots.threshold).map((entry) => entry[0]);', JOIN_KEPT, 'if (kept.length === 0) { throw new Error("the filter keeps no category"); }', 'return joined + ".";'),
    explain(slots, solution) {
      return [`The condition "at least ${slots.threshold}" keeps a category only when its value is greater than or equal to ${slots.threshold}.`, `Testing ${slots.entries.map(([label, value]) => `${label}=${value}`).join(', ')} against that bound leaves ${joinWithAnd(solution.kept)}; the other categories are removed by the filter.`];
    }
  },
  {
    template: 'Two successive filters on a table',
    type: 'two-successive-filters-on-a-table',
    category: 'no-knowledge',
    parse(statement) {
      const entries = [...statement.matchAll(/(\w+)-(\w+)=(\d+)/g)].map((match) => [match[1], match[2], Number(match[3])]);
      const threshold = statement.match(/at least (\d+)/);
      const color = statement.match(/only (\w+) categories/);
      if (entries.length === 0 || threshold === null || color === null) throw new Error('the table values or one of the two filters is missing');
      return { entries, threshold: Number(threshold[1]), color: color[1] };
    },
    solve(slots) {
      const kept = slots.entries.filter(([, color, value]) => value >= slots.threshold && color === slots.color).map(([label]) => label);
      if (kept.length === 0) throw new Error('the two filters keep no category');
      return { kept };
    },
    render(solution) { return `${joinWithAnd(solution.kept)}.`; },
    compute: jsEval(READ, 'const kept = slots.entries.filter((entry) => entry[2] >= slots.threshold && entry[1] === slots.color).map((entry) => entry[0]);', JOIN_KEPT, 'if (kept.length === 0) { throw new Error("the two filters keep no category"); }', 'return joined + ".";'),
    explain(slots, solution) {
      return ['Two filters applied one after the other keep a category only when it satisfies the value condition and then the colour condition.', `The value filter keeps the categories with at least ${slots.threshold}, and the colour filter then keeps only the ${slots.color} ones, leaving ${joinWithAnd(solution.kept)}.`];
    }
  },
  {
    template: 'A two-way table',
    type: 'a-two-way-table',
    category: 'no-knowledge',
    parse(statement) {
      const cells = cellsIn(statement);
      const query = statement.match(/intersection of (\w+) and (\w+)/);
      if (cells.length === 0 || query === null) throw new Error('the table cells or the requested intersection is missing');
      return { cells, row: query[1], column: query[2] };
    },
    solve(slots) {
      const found = slots.cells.find(([row, column]) => row === slots.row && column === slots.column);
      if (found === undefined) throw new Error('the requested cell is not in the table');
      return { value: found[2], row: slots.row, column: slots.column };
    },
    render(solution) { return `${solution.value}.`; },
    compute: jsEval(READ, 'const found = slots.cells.find((cell) => cell[0] === slots.row && cell[1] === slots.column);', 'if (found === undefined) { throw new Error("the requested cell is not in the table"); }', 'return String(found[2]) + ".";'),
    explain(slots, solution) {
      return ['A two-way table is indexed by two labels, so a question about an intersection is a lookup and not an addition.', `Following row ${slots.row} to column ${slots.column} lands on the single cell ${solution.value}.`];
    }
  },
  {
    template: 'Total by person from a two-way table',
    type: 'total-by-person-from-a-two-way-table',
    category: 'no-knowledge',
    parse(statement) {
      const cells = cellsIn(statement);
      const person = statement.match(/does (\w+) have in total/);
      if (cells.length === 0 || person === null) throw new Error('the table cells or the person is missing');
      return { cells, person: person[1] };
    },
    solve(slots) {
      const total = slots.cells.filter(([row]) => row === slots.person).reduce((sum, cell) => sum + cell[2], 0);
      return { total, person: slots.person };
    },
    render(solution) { return `${solution.total}.`; },
    compute: jsEval(READ, 'let total = 0;', 'for (const cell of slots.cells) { if (cell[0] === slots.person) { total += cell[2]; } }', 'return String(total) + ".";'),
    explain(slots, solution) {
      return [`A row total of a two-way table adds only the cells of that row, so row ${slots.person} is selected first.`, `Its cells are ${slots.cells.filter(([row]) => row === slots.person).map(([, column, value]) => `${column}=${value}`).join(', ')}, which add up to ${solution.total}.`];
    }
  },
  {
    template: 'Total by day from a two-way table',
    type: 'total-by-day-from-a-two-way-table',
    category: 'no-knowledge',
    sharedPremise: 'The table of the previous problem reads Ana-Monday=3, Ana-Tuesday=5, Dan-Monday=4, Dan-Tuesday=2.',
    parse(statement) {
      const cells = cellsIn(statement);
      const day = statement.match(/obtained on (\w+) in total/);
      if (cells.length === 0 || day === null) throw new Error('the referenced table or the requested day is missing');
      return { cells, day: day[1] };
    },
    solve(slots) {
      const column = slots.cells.filter(([, label]) => label === slots.day);
      if (column.length === 0) throw new Error('the requested day is not a column of the table');
      return { total: column.reduce((sum, cell) => sum + cell[2], 0), day: slots.day };
    },
    render(solution) { return `${solution.total}.`; },
    compute: jsEval(READ, 'const column = slots.cells.filter((cell) => cell[1] === slots.day);', 'if (column.length === 0) { throw new Error("the requested day is not a column of the table"); }', 'let total = 0;', 'for (const cell of column) { total += cell[2]; }', 'return String(total) + ".";'),
    explain(slots, solution) {
      return [`A day total of a two-way table adds only the cells of that column, so column ${slots.day} is selected first.`, `Its cells are ${slots.cells.filter(([, label]) => label === slots.day).map(([row, , value]) => `${row}=${value}`).join(', ')}, which add up to ${solution.total}.`];
    }
  },
  {
    template: 'A missing cell from two totals',
    type: 'a-missing-cell-from-two-totals',
    category: 'no-knowledge',
    parse(statement) {
      const cells = [...statement.matchAll(/(\w+)-(\w+)=(\d+|x)/g)].map((match) => [match[1], match[2], match[3] === 'x' ? null : Number(match[3])]);
      const row = statement.match(/Row (\w+) totals (\d+)/);
      const column = statement.match(/total of the (\w+) column/);
      if (cells.length === 0 || row === null || column === null) throw new Error('the table, the stated row total, or the requested column is missing');
      return { cells, row: row[1], column: column[1], rowTotal: Number(row[2]) };
    },
    solve(slots) {
      const known = slots.cells.filter((cell) => cell[0] === slots.row && cell[2] !== null).reduce((sum, cell) => sum + cell[2], 0);
      const value = slots.rowTotal - known;
      const columnTotal = slots.cells.reduce((sum, cell) => sum + (cell[1] === slots.column ? (cell[2] === null ? value : cell[2]) : 0), 0);
      return { value, column: slots.column, columnTotal };
    },
    render(solution) { return `x=${solution.value}; ${solution.column} total=${solution.columnTotal}.`; },
    compute: jsEval(READ, 'let known = 0;', 'for (const cell of slots.cells) { if (cell[0] === slots.row && cell[2] !== null) { known += cell[2]; } }', 'const value = slots.rowTotal - known;', 'let columnTotal = 0;', 'for (const cell of slots.cells) { if (cell[1] === slots.column) { columnTotal += cell[2] === null ? value : cell[2]; } }', 'return "x=" + value + "; " + slots.column + " total=" + columnTotal + ".";'),
    explain(slots, solution) {
      return [`The stated total of row ${slots.row} fixes its unknown cell: the printed cells of the row add up to ${slots.rowTotal - solution.value}.`, `The missing cell is ${slots.rowTotal} minus ${slots.rowTotal - solution.value}, which is ${solution.value}, and the completed ${slots.column} column then adds up to ${solution.columnTotal}.`];
    }
  },
  {
    template: 'Impossible data in a table',
    type: 'impossible-data-in-a-table',
    category: 'no-knowledge',
    parse(statement) {
      const match = statement.match(/contains values (\d+) and (\d+), but its stated total is (\d+)/);
      if (match === null) throw new Error('the row values or the stated total is missing');
      return { values: [Number(match[1]), Number(match[2])], stated: Number(match[3]) };
    },
    solve(slots) {
      const sum = slots.values.reduce((acc, value) => acc + value, 0);
      return { consistent: sum === slots.stated, sum };
    },
    render(solution) { return solution.consistent ? 'Yes.' : 'No.'; },
    compute: jsEval(READ, SUM_VALUES, 'return sum === slots.stated ? "Yes." : "No.";'),
    explain(slots, solution) {
      return ['A row total is determined by its cells, so the cells and the stated total cannot be chosen independently.', `The cells ${slots.values.join(' and ')} add up to ${solution.sum} while the table states ${slots.stated}, and one sum cannot take both values at once.`];
    }
  },
  {
    template: 'Changing a total after correcting one datum',
    type: 'changing-a-total-after-correcting-one-datum',
    category: 'no-knowledge',
    parse(statement) {
      const total = statement.match(/calculated as ([\d+\s]+)=(\d+)/);
      const fix = statement.match(/value (\d+) should have been (\d+)/);
      if (total === null || fix === null) throw new Error('the calculated total or the correction is missing');
      return { stated: Number(total[2]), oldValue: Number(fix[1]), newValue: Number(fix[2]) };
    },
    solve(slots) {
      const delta = slots.newValue - slots.oldValue;
      return { newTotal: slots.stated + delta, delta };
    },
    render(solution) { return `${solution.newTotal}.`; },
    compute: jsEval(READ, 'return String(slots.stated + (slots.newValue - slots.oldValue)) + ".";'),
    explain(slots, solution) {
      return [`Only one term changes, so the total moves by the same amount as that term: ${slots.newValue} minus ${slots.oldValue} is ${solution.delta}.`, `Adding that correction to the calculated total ${slots.stated} gives ${solution.newTotal}, without adding the other terms again.`];
    }
  }
];
