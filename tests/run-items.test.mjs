import test from 'node:test';
import assert from 'node:assert/strict';
import { classify, javascriptBodyOf, valueMatches } from '../evaluation/run-items.mjs';
import { createRuntime } from '../runtime/kernel.mjs';

test('a JavaScript reply runs in the sandbox as one jsEval wire and is classified', async () => {
  const runtime = createRuntime();
  const reply = 'Here is the code:\n```javascript\nconst kept = [30, 25, 41].filter((v) => v > 20);\nreturn kept.reduce((a, b) => a + b, 0) + 5 + " units.";\n```';
  const verdict = await classify('js', reply, '101 units.', runtime);
  assert.equal(verdict.className, 'answer_match');
  assert.equal(verdict.answer, '101 units.');
});

test('a named function without a top-level return is called', () => {
  assert.match(javascriptBodyOf('```js\nfunction solve() { return "7 units."; }\n```'), /return solve\(\);$/);
});

test('the value check requires every reference number and an agreeing verdict', () => {
  assert.equal(valueMatches('46 minutes: not feasible.', 'The earliest safe completion time is 46 minutes, so the plan does not meet the limit.'), true);
  assert.equal(valueMatches('46 minutes: not feasible.', '46 minutes: feasible.'), false);
  assert.equal(valueMatches('20.9 useful cases.', '20.9 cases.'), true);
  assert.equal(valueMatches('22 units.', '21 units.'), false);
  assert.equal(valueMatches('8 units.', 'The depot recorded 8 parts above 19, and the count is 4.'), false);
  assert.equal(valueMatches('10 units.', 'The number of records above 19 is 5, and the doubled count is 10.'), true);
  assert.equal(valueMatches('AB with 8 seats; AC with 8 seats.', 'AB with 8 seats, AC with 8 seats, BC with 6 seats.'), false);
});

test('an in-context SOP reply with prose around the fenced program is still executed', async () => {
  const runtime = createRuntime();
  const reply = 'Sure, here is the program.\n```sop\n@slots literal\n{"a": 2, "b": 5}\n\n@answer jsEval\nreturn ($slots.a * $slots.b) + " units.";\n```\nHope this helps.';
  const verdict = await classify('sop-icl', reply, '10 units.', runtime);
  assert.equal(verdict.className, 'answer_match');
  assert.equal(verdict.lenient, true);
});

test('the stratified sample keeps every group, caps its size, and is identical across calls', async () => {
  const { stratifiedSample } = await import('../evaluation/run-items.mjs');
  const items = [];
  for (const family of ['a', 'b']) for (let n = 0; n < 30; n++) items.push({ id: `book/eval/x/${family}/${n}`, book: 'book', folder: `eval/x/${family}/${n}` });
  items.push({ id: 'book/eval/x/c/0', book: 'book', folder: 'eval/x/c/0' });
  const first = stratifiedSample(items, 10, 1), second = stratifiedSample(items, 10, 1);
  assert.equal(first.length, 21);
  assert.deepEqual(first.map((item) => item.id), second.map((item) => item.id));
});

test('an operator plan is executed with the inventory operators and formatted by the terminal report', async () => {
  const { classify } = await import('../evaluation/run-items.mjs');
  const reply = '```json\n{"values": [26, 30, 33, 30, 9, 5], "unit": "tickets", "steps": [{"op": "keepAbove", "threshold": 20}, {"op": "nthLargest", "nth": 3}, {"op": "percentOf", "pct": 50}]}\n```';
  const verdict = await classify('ops', reply, '15 units.', createRuntime());
  assert.equal(verdict.className, 'answer_match');
  assert.equal((await classify('ops', '```json\n{"values": [1], "steps": [{"op": "invent"}]}\n```', '1 units.', createRuntime())).className, 'graph_invalid');
});

test('programBodyOf runs a printing async program as a jsEval body and returns its last line', async () => {
  const { programBodyOf } = await import('../evaluation/run-items.mjs');
  const body = programBodyOf('<think>\n\n</think>\n\n(async () => {\n  const w_answer = await (async () => { return 6 * 7; })();\n  console.log(String(w_answer));\n})();');
  const run = new Function(`return (async () => {\n${body}\n})();`);
  assert.equal(await run(), '42');
});
