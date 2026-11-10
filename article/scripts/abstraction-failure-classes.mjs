// The prompt-only abstraction comparison (Informatica, Section 6): how each form failed, what the references
// look like, what the larger models wrote where their correct answers differed from the reference, and two
// CPU-only sensitivity re-executions of stored outputs (no new generations).
// Inputs: evaluation/registry/e8-*-paired/items.jsonl (untuned small models), m-{haiku,sonnet}-e8-*/items.jsonl
// (larger models), evaluation/registry/items-e2/paired/L{0,2}.jsonl (statements), and the judge verdicts in
// article/evidence/comparison/judge-{A,B}.jsonl. Usage: node article/scripts/abstraction-failure-classes.mjs
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { executePlan, OPS_EXAMPLES } from '../../evaluation/operator-plans.mjs';
import { valueMatches } from '../../evaluation/run-items.mjs';
import { answerMatches } from '../../teacher/naming.mjs';
import { parseCircuit } from '../../runtime/parser.mjs';
import { createRuntime } from '../../runtime/kernel.mjs';
import { OPERATORS } from '../../teacher/procedural/compositions.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = (path) => readFileSync(resolve(root, path), 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
const judge = (letter) => new Map(read(`article/evidence/comparison/judge-${letter}.jsonl`).map((row) => [row.jid, row.verdict]));
const A = judge('A'), B = judge('B');
const jidOf = (directory, row) => createHash('sha256').update(`${directory}::${row.item}#${row.sample ?? 0}`).digest('hex').slice(0, 12);
const solved = (directory, row) => row.class === 'answer_match' || (A.get(jidOf(directory, row)) === 'same' && B.get(jidOf(directory, row)) === 'same');
const heldOut = (directory) => read(`evaluation/registry/${directory}/items.jsonl`).filter((row) => row.split === 'held-out');
const pct = (count, n) => `${Math.floor((100 * count) / n + 0.5)}%`; // half-up from counts
const statements = Object.fromEntries(['L0', 'L2'].map((rung) => [rung, new Map(read(`evaluation/registry/items-e2/paired/${rung}.jsonl`)
  .map((item) => [`${item.book}/${item.folder}`, item])) ]));

function fisher(a, b, c, d) { // two-sided Fisher exact test on [[a, b], [c, d]]; orientation only
  const lf = (n) => { let s = 0; for (let k = 2; k <= n; k++) s += Math.log(k); return s; };
  const r1 = a + b, r2 = c + d, c1 = a + c, n = r1 + r2;
  const p = (x) => Math.exp(lf(r1) + lf(r2) + lf(c1) + lf(n - c1) - lf(n) - lf(x) - lf(r1 - x) - lf(c1 - x) - lf(r2 - c1 + x));
  const observed = p(a); let sum = 0;
  for (let x = Math.max(0, c1 - r2); x <= Math.min(r1, c1); x++) { const px = p(x); if (px <= observed * (1 + 1e-9)) sum += px; }
  return Math.min(1, sum);
}

// 0. Consistency check: the correct plan of every generator-wording problem of the rewording set (520 items)
// reproduces its reference, because plans run on the generator's own operators and report templates.
{
  const PARAMS = { keepAbove: ['threshold'], keepBelow: ['threshold'], double: ['multiplier'], addRate: ['rate'], subtractRate: ['rate'], perUnit: ['perUnit'],
    keepDivisibleBy: ['divisor'], modulo: ['divisor'], percentOf: ['pct'], ratioPer: ['divisor'], discount: ['pct'], nthLargest: ['nth'], elapsed: ['per', 'label'],
    neighbourCount: ['edges'], pathExists: ['edges', 'target'], probability: ['favourableDivisor'], rectangleArea: ['width'] };
  const all = read('evaluation/registry/items-e2/L0.jsonl');
  let reproduced = 0;
  for (const item of all) {
    const steps = item.chain.map((op) => Object.fromEntries([['op', op], ...(PARAMS[op] ?? []).map((key) => [key, item.slots[key]])]));
    const result = executePlan('```json\n' + JSON.stringify({ values: item.slots.values, unit: item.slots.unit, steps }) + '\n```');
    if (result.className === 'executed' && answerMatches(item.oracle, result.answer)) reproduced++;
  }
  console.log(`Correct plans reproduce ${reproduced} of ${all.length} generator-wording references (catalogue: ${Object.keys(OPERATORS).length} operations)`);
}

// 1. The references of the 33 held-out problems.
const items = [...statements.L0.values()].filter((item) => item.split === 'held-out');
const forms = {};
for (const item of items) { const key = item.oracle.replace(/\d+(\/\d+)?/g, 'N'); forms[key] = (forms[key] ?? 0) + 1; }
const askedUnit = items.filter((item) => /Report the result in ([a-z]+)\./.test(item.statement) && item.oracle.endsWith(' units.')).length;
console.log(`Held-out problems per wording: ${items.length}; reference forms ${JSON.stringify(forms)}; statement asks for a named unit while the reference says "units": ${askedUnit}`);
console.log(`Worked examples: operator plans ${OPS_EXAMPLES.length} (${OPS_EXAMPLES.map((example) => JSON.parse(example.plan).steps.map((step) => step.op).join('>')).join('; ')}), JavaScript 1, SOP Lang 3 (one composition)`);

// 2. Failure classes by form, model and wording (small models).
const MODELS = [['coder05', '0.5B'], ['coder15', '1.5B'], ['qwen3-17', '1.7B']];
const WORDINGS = [['l0', 'generator'], ['l2', 'narrative']];
const table = {};
for (const [model, size] of MODELS) for (const [wording, label] of WORDINGS) {
  const cell = (form) => `e8-${form}-${wording}-${model}-paired`;
  // Operator plans.
  const opsDir = cell('ops3');
  const plans = heldOut(opsDir);
  const unknownNames = {};
  const ops = { n: plans.length, solved: 0, exact: 0, malformed: 0, missingBrace: 0, unknownOp: 0, executionError: 0, wrong: 0,
    wellFormed: 0, wellFormedSolved: 0, braceRescued: 0, renameRescued: 0, unitLenient: 0 };
  for (const row of plans) {
    const ok = solved(opsDir, row);
    if (ok) ops.solved++;
    if (row.class === 'answer_match') ops.exact++;
    if (ok && row.class !== 'answer_match') ops.unitLenient++;
    if (row.class === 'parse_invalid') {
      ops.malformed++;
      const fence = /```(?:json)?\s*\n([\s\S]*?)```/.exec(row.completion ?? '');
      const text = fence ? fence[1] : row.completion ?? '';
      let repaired = null; try { JSON.parse(text.trim() + '}'); repaired = '```json\n' + text.trim() + '}\n```'; } catch { /* not a missing brace */ }
      if (repaired) { ops.missingBrace++; const again = executePlan(repaired); if (again.className === 'executed' && answerMatches(row.oracle, again.answer)) ops.braceRescued++; }
    } else if (row.class === 'graph_invalid') {
      ops.unknownOp++;
      const name = /unknown operation (\S+)/.exec(row.detail ?? '')?.[1] ?? '?';
      unknownNames[name] = (unknownNames[name] ?? 0) + 1;
      if (name === 'multiply') {
        const renamed = (row.completion ?? '').replace(/"op"\s*:\s*"multiply"/g, '"op":"double"');
        const again = executePlan(renamed);
        if (again.className === 'executed' && answerMatches(row.oracle, again.answer)) ops.renameRescued++;
      }
    } else {
      ops.wellFormed++;
      if (ok) ops.wellFormedSolved++;
      if (row.class === 'execution_error') ops.executionError++;
      else if (!ok) ops.wrong++;
    }
  }
  ops.unknownNames = unknownNames;
  // Plain JavaScript and SOP Lang.
  const summarize = (directory) => {
    const rows = heldOut(directory);
    const out = { n: rows.length, solved: 0, exact: 0, notExecuted: 0, missingAnswerWire: 0 };
    for (const row of rows) {
      if (solved(directory, row)) out.solved++;
      if (row.class === 'answer_match') out.exact++;
      if (row.class !== 'answer_match' && row.class !== 'answer_mismatch') out.notExecuted++;
      if (/Requested wire .answer. does not exist/.test(row.detail ?? '')) out.missingAnswerWire++;
    }
    return { rows, ...out };
  };
  const js = summarize(cell('js1'));
  const sop = summarize(cell('sopicl3'));
  table[`${size} ${label}`] = { ops, js, sop };
  console.log(`\n== ${size}, ${label} wording (33 held-out problems)`);
  console.log(`  operator plan: solved ${ops.solved} (${pct(ops.solved, 33)}), exact ${ops.exact}; malformed JSON ${ops.malformed} (missing final brace ${ops.missingBrace}), unknown operation ${ops.unknownOp} ${JSON.stringify(unknownNames)}, execution error ${ops.executionError}, well-formed ${ops.wellFormed} of which solved ${ops.wellFormedSolved} and wrong ${ops.wrong}; accepted by the judges but not exact ${ops.unitLenient}`);
  console.log(`    sensitivity: appending the brace makes ${ops.braceRescued} of ${ops.missingBrace} exact; renaming multiply->double makes ${ops.renameRescued} of ${unknownNames.multiply ?? 0} exact`);
  console.log(`  plain JavaScript: solved ${js.solved} (${pct(js.solved, 33)}), exact ${js.exact}, not executed ${js.notExecuted}`);
  console.log(`  SOP Lang in the prompt: solved ${sop.solved} (${pct(sop.solved, 33)}), exact ${sop.exact}, not executed ${sop.notExecuted}, of which no wire named answer ${sop.missingAnswerWire}`);
  console.log(`  Fisher p, well-formed plans solved ${ops.wellFormedSolved}/${ops.wellFormed} against JavaScript ${js.solved}/33: ${fisher(ops.wellFormedSolved, ops.wellFormed - ops.wellFormedSolved, js.solved, 33 - js.solved).toFixed(2)}`);
  console.log(`  Fisher p, all plans ${ops.solved}/33 against JavaScript ${js.solved}/33: ${fisher(ops.solved, 33 - ops.solved, js.solved, 33 - js.solved).toFixed(2)}`);
}

// 3. SOP Lang programs that computed a value but named no wire "answer": re-executed with their last wire as the output.
const runtime = createRuntime();
console.log('\n== SOP Lang in the prompt, programs without an answer wire, re-executed with the last wire as output');
for (const [model, size] of MODELS) for (const [wording, label] of WORDINGS) {
  const directory = `e8-sopicl3-${wording}-${model}-paired`;
  const rows = heldOut(directory).filter((row) => /Requested wire .answer. does not exist/.test(row.detail ?? ''));
  let exact = 0, value = 0, ran = 0; const names = {};
  for (const row of rows) {
    const fence = /```(?:sop)?\s*\n([\s\S]*?)```/.exec(row.completion ?? '');
    const program = fence ? fence[1] : (row.completion ?? '').slice(Math.max(0, (row.completion ?? '').search(/^@\w+ \w+/m)));
    let wires; try { wires = parseCircuit(program).wires; } catch { continue; }
    const last = wires.at(-1).name; names[last] = (names[last] ?? 0) + 1;
    let result; try { result = await runtime.run(program, { outputs: [last] }); } catch { continue; }
    if (result?.status !== 'completed' || result.outputs?.[last] === undefined) continue;
    ran++;
    const answer = String(result.outputs[last]);
    if (answerMatches(row.oracle, answer)) exact++;
    if (valueMatches(row.oracle, answer)) value++;
  }
  if (rows.length) console.log(`  ${size}, ${label}: ${rows.length} programs; ${ran} ran; ${value} state the reference value (strict value check), ${exact} exact; last-wire names ${JSON.stringify(names)}`);
}

// 4. Where correct answers differed from the reference string: the unit word.
const unitOf = (text) => /\d+(?:\.\d+)?\s+([a-z]+)\.?\s*$/i.exec(text ?? '')?.[1]?.toLowerCase() ?? null;
console.log('\n== Correct but not exact: unit word printed against the unit the statement asked for');
const unitRows = [];
for (const [prefix, label] of [['e8-js1', 'JavaScript'], ['e8-sopicl3', 'SOP Lang']]) for (const [model, size] of MODELS) for (const [wording, wlabel] of WORDINGS) unitRows.push([`${prefix}-${wording}-${model}-paired`, `${size} ${label}, ${wlabel}`, wording]);
for (const model of ['haiku', 'sonnet']) for (const form of ['js', 'sop', 'ops']) for (const [wording, wlabel] of WORDINGS) unitRows.push([`m-${model}-e8-${wording}-${form}`, `${model} ${form}, ${wlabel}`, wording]);
for (const [directory, label, wording] of unitRows) {
  const rows = heldOut(directory);
  const correct = rows.filter((row) => solved(directory, row));
  const inexact = correct.filter((row) => row.class !== 'answer_match');
  let statedUnit = 0, genericUnits = 0, otherForm = 0;
  for (const row of inexact) {
    const item = statements[wording.toUpperCase()].get(row.item);
    const asked = item?.slots?.unit ?? null;
    const printed = unitOf(row.answer);
    if (asked && printed === asked) statedUnit++; else if (printed === 'units') genericUnits++; else otherForm++;
  }
  console.log(`  ${label.padEnd(26)} solved ${String(correct.length).padStart(2)}/33, exact ${String(correct.length - inexact.length).padStart(2)}; of the ${inexact.length} inexact correct answers: printed the unit the statement asked for ${statedUnit}, other form ${otherForm}${genericUnits ? `, "units" ${genericUnits}` : ''}`);
}
