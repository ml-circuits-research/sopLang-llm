import assert from 'node:assert/strict';

export function auditTableValues(name, tables, results, baselines) {
  const arm = prefix => results.arms.find(row => row.id.startsWith(prefix));
  const rate = (n, d) => (100 * n / d).toFixed(1) + '%';
  const check = (row, values) => assert.deepEqual(row.map(value => Number.parseFloat(value)), values.map(value => Number.parseFloat(value)), `${name}: table values`);
  let checked = 0;
  for (const { rows } of tables) {
    const heading = rows[0].join('|');
    if (heading.startsWith('Base model|Base content match')) {
      for (const row of rows.slice(1)) {
        const base = baselines.comparisons.find(value => value.name.startsWith(row[0]));
        assert.ok(base);
        check(row.slice(1), [base.baseContent, base.tunedContent, base.baseExact, base.tunedExact].map(n => rate(n, base.items))); checked++;
      }
    } else if (heading.startsWith('Experiment|Condition|Match')) {
      const lookup = { 'General code': 'exp-014', 'Specialized wires': 'exp-016', 'Compact targets': 'exp-021', 'Split targets': 'exp-022', '0.5B model': 'exp-026', '1.7B model': 'exp-027' };
      for (const row of rows.slice(1)) {
        const value = arm(lookup[row[1]]);
        check(row.slice(2), ['answer_match', 'answer_mismatch', 'execution_error'].map(key => rate(value.classes[key], value.items))); checked++;
      }
    } else if (heading === 'Measure|General code|Specialized wires') {
      const values = [arm('exp-014'), arm('exp-016')];
      for (const row of rows.slice(1)) {
        const groups = values.map(value => row[0].startsWith('Overall') ? value : value.books['procedural-arithmetic']);
        const key = row[0].includes('failure') ? 'execution_error' : 'answer_match';
        check(row.slice(1), groups.map(value => rate(value.classes[key], value.items))); checked++;
      }
    } else if (heading === 'Targets|Match|Mismatch|Failure') {
      for (const row of rows.slice(1)) {
        const value = arm(row[0] === 'Compact targets' ? 'exp-021' : 'exp-022');
        check(row.slice(1), ['answer_match', 'answer_mismatch', 'execution_error'].map(key => rate(value.classes[key], value.items))); checked++;
      }
    } else if (heading.startsWith('Adapted model|Syntax')) {
      for (const row of rows.slice(1)) {
        const value = arm(row[0].includes('0.5B') ? 'exp-026' : 'exp-027');
        check(row.slice(1), ['100%', rate(value.completed, value.items), rate(value.classes.answer_match, value.items)]); checked++;
      }
    } else if (heading.startsWith('Family|Problems|0.5B')) {
      const groups = { 'Procedural computations': ['procedural-arithmetic'], 'Dependency joins': ['decompose-to-solve'], 'Coalition enumeration': ['world-as-a-system'], 'Other book-derived tasks': ['adult-reasoning', 'common-sense', 'logical-reasoning', 'mathematical-thinking', 'scientific-reasoning'] };
      for (const row of rows.slice(1)) {
        const values = ['exp-026', 'exp-027'].map(prefix => {
          const sum = { n: 0, match: 0, fail: 0 };
          for (const key of groups[row[0]]) { const b = arm(prefix).books[key]; sum.n += b.items; sum.match += b.classes.answer_match; sum.fail += b.classes.execution_error; }
          return sum;
        });
        check(row.slice(1), [values[0].n, rate(values[0].match, values[0].n), rate(values[1].match, values[1].n), rate(values[0].fail, values[0].n), rate(values[1].fail, values[1].n)]); checked++;
      }
    } else if (heading === 'Evaluation outcome|Coalition outputs|Scheduling outputs') {
      const definitions = [['exp-027', 'world-as-a-system'], ['exp-021', 'decompose-to-solve']];
      const keys = { 'Restricted match': 'restricted_match', 'Parsed disagreement': 'restricted_mismatch', Unclassified: 'outside_grammar', 'Execution failure': 'execution_failure' };
      for (const row of rows.slice(1)) {
        check(row.slice(1), definitions.map(([prefix, book]) => {
          if (row[0] === 'Original exact match') { const group = arm(prefix).books[book]; return rate(group.classes.answer_match, group.items); }
          const group = results.diagnostics.find(value => value.id.startsWith(prefix) && value.book === book);
          return rate(group.counts[keys[row[0]]] ?? 0, group.items);
        })); checked++;
      }
    }
  }
  return checked;
}
