#!/usr/bin/env node
/**
 * Four-condition compilation diagnostic (astra_review I1).
 *
 * One checkpoint, one suite, four conditions on the SAME problems:
 *
 *   normal   the statement alone, through the recorded compiled-plan profile.
 *            This is the only condition whose score is a deployable result.
 *   values   the statement plus the correct extracted values and their roles.
 *            Oracle-assisted. If this rescues many failures, reading the
 *            statement or assigning roles to its values is the bottleneck.
 *   plan     the statement plus the correct operator graph, without values.
 *            Oracle-assisted. If this rescues many failures, operator selection
 *            or composition is the bottleneck.
 *   both     values and graph supplied; the model still emits executable SOP.
 *            Oracle-assisted. Failures that survive here concern code emission,
 *            the output protocol, or the supplied representation.
 *
 * Every problem is scored in every condition, so the report can show paired
 * outcomes: which failures the supplied input rescued and which it did not. The
 * first divergence from the latent computation is classified as well, so a
 * diagnosis names a stage rather than a rate.
 *
 * The oracle-assisted conditions are labelled in the manifest and in the report.
 * Their numbers must never be quoted as ordinary task performance.
 *
 * Usage:
 *   node evaluation/run-diagnostic.mjs --experiment diag-009 --best --per-structure 10
 *   node evaluation/run-diagnostic.mjs --experiment diag-009 --gguf <path> --base http://127.0.0.1:8080
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { buildMessages, extractProgram, generate } from './client.mjs';
import { parseCircuit } from '../runtime/parser.mjs';
import { createRuntime } from '../runtime/kernel.mjs';
import { REPOSITORY_ROOT, resolveArtifactPath, withServer } from './server.mjs';
import { bestWinner } from './artifacts.mjs';
import { buildContrastiveSuite } from './diagnostics/pairs.mjs';
import { buildDiagnosticSuite, structureFingerprint } from './diagnostics/suite.mjs';
import { statesValue } from './probes.mjs';

const CONDITIONS = ['normal', 'values', 'plan', 'both'];

function parseArguments(argv) {
  const options = {
    experiment: null,
    gguf: null,
    best: false,
    base: null,
    port: 8087,
    concurrency: 4,
    maxTokens: 2048,
    perStructure: 10,
    pairs: false,
    perPair: 8,
    seed: 20260922,
    structures: null,
    threads: null,
    help: false
  };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = () => {
      const next = argv[index + 1];
      if (next === undefined) throw new Error(`${flag} needs a value`);
      index += 1;
      return next;
    };
    if (flag === '--experiment') options.experiment = value();
    else if (flag === '--gguf') options.gguf = value();
    else if (flag === '--best') options.best = true;
    else if (flag === '--base') options.base = value();
    else if (flag === '--port') options.port = Number(value());
    else if (flag === '--concurrency') options.concurrency = Number(value());
    else if (flag === '--max-tokens') options.maxTokens = Number(value());
    else if (flag === '--per-structure') options.perStructure = Number(value());
    else if (flag === '--pairs') options.pairs = true;
    else if (flag === '--per-pair') options.perPair = Number(value());
    else if (flag === '--seed') options.seed = Number(value());
    else if (flag === '--structures') options.structures = value().split(',').map((name) => name.trim());
    else if (flag === '--threads') options.threads = Number(value());
    else if (flag === '--help' || flag === '-h') options.help = true;
    else throw new Error(`unknown argument: ${flag}`);
  }
  return options;
}

const USAGE = `Usage: node evaluation/run-diagnostic.mjs --experiment <id> (--gguf <path> | --best | --base <url>) [options]

Runs one checkpoint over one diagnostic suite in four conditions: normal (the
statement alone, the deployable score), values (correct extracted values
supplied), plan (the correct operator graph supplied), both. The last three are
oracle-assisted diagnostics and are labelled as such in the manifest.

Options:
  --per-structure N   problems per operator structure (default 10)
  --pairs             contrastive-pair mode: score both members of each pair and
                      report paired accuracy, the count of pairs whose two answers
                      are both correct (astra_review I3)
  --per-pair N        pairs per contrastive kind (default 8)
  --seed N            suite seed (default 20260922)
  --structures a,b    only these structures
  --port N            port for the managed server (default 8087)
  --concurrency N     items generated in parallel (default 4)
  --threads N         CPU threads for llama-server
  --help              print this help
`;

/** The prompt of one condition: what the model receives, and nothing more. */
export function promptOf(problem, condition) {
  if (condition === 'normal') return problem.statement;
  if (condition === 'values') {
    return `${problem.statement}\n\nThe values extracted from this statement, with their roles:\n${problem.valueRecord}\n\nCompile the plan that computes the answer.`;
  }
  if (condition === 'plan') {
    return `${problem.statement}\n\nThe plan this statement calls for, in order:\n${problem.planRecord}\n\nCompile this plan for the values of the statement.`;
  }
  return `${problem.statement}\n\nThe values extracted from this statement, with their roles:\n${problem.valueRecord}\n\nThe plan this statement calls for, in order:\n${problem.planRecord}\n\nCompile this plan with these values.`;
}

function messageOf(failure) {
  return failure instanceof Error ? failure.message : String(failure);
}

/**
 * The first divergence of an executed program from the latent computation.
 *
 * A mismatch alone says only that the answer is wrong. The divergence class
 * names the stage: the program may read the values incorrectly, apply a
 * different operation, drop a stage, or fail structurally. The classification
 * reads the generated program's text and its executed answer, and it is a
 * heuristic on purpose: it is reported next to the raw records, never instead.
 */
export function divergenceOf({ className, program, answer, problem, oracleOfStage }) {
  if (className === 'generation_transport_error') return 'no_completion';
  if (className === 'wrapper_rejected') return 'wrapper_rejected';
  if (className === 'parse_invalid') return 'invalid_syntax';
  if (className === 'graph_invalid') return 'graph_invalid';
  if (className === 'execution_error') {
    // A circuit that fails its own guards most often compiled the wrong values
    // or the wrong threshold, so the statement-reading stage is the suspect.
    return 'runtime_failure';
  }
  if (className === 'answer_match') return 'none';
  const numbers = String(answer ?? '').match(/-?\d+(?:\.\d+)?/g) ?? [];
  const stated = numbers.map(Number);
  // A formatting mismatch states the right answer and nothing else numeric, so
  // it is reported only when the oracle is the sole number. An answer that also
  // states a stage value is a stage error first: the classifier names the
  // earliest stage the program failed to carry, not the last thing it printed.
  if (stated.length > 0 && stated.every((value) => value === problem.oracle)) return 'wrong_formatting';
  if (stated.includes(problem.kept.reduce((sum, value) => sum + value, 0))) return 'stopped_after_filter';
  if (stated.includes(problem.kept.length)) return 'stopped_after_filter';
  if (stated.includes(Math.max(...problem.kept))) return 'missing_final_stage';
  if (oracleOfStage(program, problem).some((value) => stated.includes(value))) return 'wrong_final_operation';
  return 'wrong_values_or_operation';
}

/** The answers every intermediate stage of the latent chain would produce. */
export function stageAnswers(problem) {
  let current = problem.kept;
  const answers = [];
  for (const name of STRUCTURE_OF(problem).chain.slice(1)) {
    current = OPERATOR_OF(name)(current, problem.parameters);
    answers.push(current);
  }
  return answers;
}

// Small local aliases so the divergence heuristic reads clearly above.
import { OPERATORS as OPERATORS_TABLE, STRUCTURES as STRUCTURES_TABLE } from './diagnostics/suite.mjs';
const STRUCTURE_OF = (problem) => STRUCTURES_TABLE.find((structure) => structure.id === problem.structure);
const OPERATOR_OF = (name) => OPERATORS_TABLE[name].steps;

  async function main() {
    const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(USAGE);
    process.exit(0);
  }
  if (options.experiment === null) {
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  const structures = options.structures === null
    ? undefined
    : STRUCTURES_TABLE.filter((structure) => options.structures.includes(structure.id));
  // Two suites share this runner. The structure suite asks one question per problem and
  // counts single answers; the pair suite asks both members of a contrastive pair and
  // counts a pair only when its two answers are both correct, which is the measurement
  // the contrastive arm is built for (astra_review I3).
  const suite = options.pairs
    ? buildContrastiveSuite({ seed: options.seed, perPair: options.perPair })
    : buildDiagnosticSuite({ seed: options.seed, perStructure: options.perStructure, structures });
  const problems = options.pairs
    ? suite.pairs.flatMap((pair) => pair.members.map((member) => ({ ...member, pairId: pair.id })))
    : suite.problems;
  const registryDir = join(REPOSITORY_ROOT, 'evaluation/registry', options.experiment);
  mkdirSync(join(registryDir, 'items'), { recursive: true });

  let artifact = null;
  let artifactLabel = options.base ?? null;
  if (options.gguf !== null) {
    artifact = resolveArtifactPath(options.gguf);
    artifactLabel = artifact.replace(`${REPOSITORY_ROOT}/`, '');
  } else if (options.best) {
    const winner = bestWinner();
    artifact = winner.gguf;
    artifactLabel = `${winner.gguf.replace(`${REPOSITORY_ROOT}/`, '')} (${winner.experiment} ${winner.winner})`;
  } else if (options.base === null) {
    throw new Error('pass --gguf, --best, or --base');
  }

  const runtime = createRuntime();

  async function scoreOne({ problem, condition, base, alias }) {
    const result = await generate({
      base,
      model: alias,
      messages: buildMessages(promptOf(problem, condition)),
      temperature: 0,
      maxTokens: options.maxTokens,
      timeoutMs: 600_000
    });
    const record = {
      item: `${problem.id}/${condition}`,
      problem: problem.id,
      structure: problem.structure,
      split: problem.split ?? 'development',
      pair: problem.pairKind === undefined ? null : { id: problem.pairId, kind: problem.pairKind, role: problem.role },
      fingerprint: structureFingerprint(problem),
      condition,
      oracle: problem.oracle,
      statement: problem.statement,
      valueRecord: condition === 'values' || condition === 'both' ? problem.valueRecord : null,
      planRecord: condition === 'plan' || condition === 'both' ? problem.planRecord : null,
      generated: {
        tokens: result.usage?.completion_tokens ?? null,
        promptTokens: result.usage?.prompt_tokens ?? null,
        attempts: result.attempts,
        latencyMs: result.latencyMs
      }
    };
    if (result.error !== null) {
      return { ...record, class: 'generation_transport_error', detail: result.error.message, answer: null, program: null, divergence: 'no_completion' };
    }
    const extracted = extractProgram(result.completion);
    if (!extracted.ok) {
      return { ...record, class: 'wrapper_rejected', detail: extracted.reason, answer: null, program: null, divergence: 'wrapper_rejected' };
    }
    try {
      parseCircuit(extracted.program, { sourceName: 'completion' });
    } catch (failure) {
      return { ...record, class: 'parse_invalid', detail: messageOf(failure), answer: null, program: extracted.program, divergence: 'invalid_syntax' };
    }
    let outcome;
    try {
      outcome = await runtime.run(extracted.program, { outputs: ['answer'] });
    } catch (failure) {
      return { ...record, class: 'execution_error', detail: `runtime threw: ${messageOf(failure)}`, answer: null, program: extracted.program, divergence: 'runtime_failure' };
    }
    const answer = outcome.status === 'completed' ? String(outcome.outputs.answer) : null;
    const className = outcome.status !== 'completed'
      ? 'execution_error'
      : statesValue(problem.oracle, answer) ? 'answer_match' : 'answer_mismatch';
    return {
      ...record,
      class: className,
      detail: outcome.status === 'completed' ? null : `${outcome.status}:${outcome.code ?? ''}`,
      answer,
      program: extracted.program,
      divergence: divergenceOf({ className, program: extracted.program, answer, problem, oracleOfStage: () => stageAnswers(problem) })
    };
  }

  async function mapWithConcurrency(items, concurrency, mapper) {
    const results = new Array(items.length);
    let cursor = 0;
    const workers = Array.from({ length: Math.max(1, Math.min(concurrency, items.length)) }, async () => {
      while (cursor < items.length) {
        const index = cursor;
        cursor += 1;
        results[index] = await mapper(items[index], index);
      }
    });
    await Promise.all(workers);
    return results;
  }

  const work = [];
  for (const problem of problems) {
    for (const condition of CONDITIONS) work.push({ problem, condition });
  }

  const runAll = async (base, alias) => mapWithConcurrency(work, options.concurrency, ({ problem, condition }) =>
    scoreOne({ problem, condition, base, alias })
  );

  const records = options.base !== null
    ? await runAll(options.base, undefined)
    : await withServer(
        { ggufPath: artifact, port: options.port, logPath: join(registryDir, 'server.log'), threads: options.threads },
        ({ port, alias }) => runAll(`http://127.0.0.1:${port}`, alias)
      );

  writeFileSync(join(registryDir, 'items', 'diagnostic.jsonl'), `${records.map((record) => JSON.stringify(record)).join('\n')}\n`);

  const rate = (condition, className) => {
    const all = records.filter((record) => record.condition === condition);
    const hit = all.filter((record) => record.class === className).length;
    return { hit, total: all.length, percent: all.length === 0 ? 0 : (hit / all.length) * 100 };
  };

  const lines = [
    `# Four-condition diagnostic — ${options.experiment}`,
    '',
    `Artifact: \`${artifactLabel}\`. Suite: ${suite.profile}, seed ${suite.seed}, ${suite.problems.length} problems (${suite.perStructure} per structure).`,
    '',
    'The **normal** condition is the statement alone through the recorded compiled-plan profile: it is the only deployable score here.',
    'The **values**, **plan**, and **both** conditions are oracle-assisted diagnostics — they supply input the deployed system would not have — and their numbers must never be quoted as task performance.',
    '',
    '| condition | oracle-assisted | matched | items | rate | parse valid | executed |',
    '| --- | --- | --- | --- | --- | --- | --- |',
  ];
  for (const condition of CONDITIONS) {
    const matched = rate(condition, 'answer_match');
    const parsed = records.filter((record) => record.condition === condition && ['answer_match', 'answer_mismatch', 'execution_error'].includes(record.class)).length;
    const executed = records.filter((record) => record.condition === condition && record.answer !== null).length;
    lines.push(
      `| ${condition} | ${condition === 'normal' ? 'no' : 'yes'} | ${matched.hit} | ${matched.total} | ${matched.percent.toFixed(1)}% | ${((parsed / matched.total) * 100).toFixed(1)}% | ${((executed / matched.total) * 100).toFixed(1)}% |`
    );
  }

  if (options.pairs) {
    // The contrastive report: a pair passes only when BOTH members answer correctly on
    // the deployable condition, because a model that completes the nearest memorized
    // family can answer one member and not its partner, and two identical wrong answers
    // must never pass.
    const classOf = (pairId, role, condition) =>
      records.find((record) => record.pair === null ? false : record.pair.id === pairId && record.pair.role === role && record.condition === condition)?.class;
    lines.push('', '## Paired accuracy (normal condition: the statement alone)', '',
      'A pair counts only when both of its members answer correctly.', '',
      '| pair kind | pairs | both correct | one correct | neither | paired accuracy |', '| --- | --- | --- | --- | --- | --- |');
    for (const kind of suite.kinds) {
      const kindPairs = suite.pairs.filter((pair) => pair.kind === kind);
      let both = 0;
      let one = 0;
      let neither = 0;
      for (const pair of kindPairs) {
        const hits = pair.members.map((member) => classOf(pair.id, member.role, 'normal') === 'answer_match').filter(Boolean).length;
        if (hits === 2) both += 1;
        else if (hits === 1) one += 1;
        else neither += 1;
      }
      const share = kindPairs.length === 0 ? 0 : (both / kindPairs.length) * 100;
      lines.push(`| ${kind} | ${kindPairs.length} | ${both} | ${one} | ${neither} | ${share.toFixed(1)}% |`);
    }
    const allPairs = suite.pairs.length;
    const allBoth = suite.pairs.filter((pair) => pair.members.every((member) => classOf(pair.id, member.role, 'normal') === 'answer_match')).length;
    lines.push(`| **all** | **${allPairs}** | **${allBoth}** | | | **${((allBoth / Math.max(1, allPairs)) * 100).toFixed(1)}%** |`);
    lines.push('', '## Each pair, both members', '', '| pair | values | oracle | above/left answer | right answer | outcome |', '| --- | --- | --- | --- | --- | --- |');
    for (const pair of suite.pairs) {
      const [left, right] = pair.members;
      const leftRecord = records.find((record) => record.pair?.id === pair.id && record.pair.role === left.role && record.condition === 'normal');
      const rightRecord = records.find((record) => record.pair?.id === pair.id && record.pair.role === right.role && record.condition === 'normal');
      const outcome = leftRecord?.class === 'answer_match' && rightRecord?.class === 'answer_match' ? 'both correct'
        : leftRecord?.class === 'answer_match' || rightRecord?.class === 'answer_match' ? 'one correct' : 'neither';
      const shown = (record) => record === undefined ? '—' : `${record.class === 'answer_match' ? 'correct' : record.class}`;
      lines.push(`| ${pair.id} | ${pair.shared.values.join(', ')} | ${left.oracle} / ${right.oracle} | ${shown(leftRecord)} | ${shown(rightRecord)} | ${outcome} |`);
    }
    lines.push('', '## First divergence (normal condition)', '', '| divergence | items |', '| --- | --- |');
    const pairDivergences = new Map();
    for (const record of records.filter((record) => record.condition === 'normal')) {
      pairDivergences.set(record.divergence, (pairDivergences.get(record.divergence) ?? 0) + 1);
    }
    for (const [divergence, count] of [...pairDivergences.entries()].sort((left, right) => right[1] - left[1])) {
      lines.push(`| ${divergence} | ${count} |`);
    }
    writeFileSync(join(registryDir, 'report.md'), `${lines.join('\n')}\n`);
    writeFileSync(
      join(registryDir, 'run-manifest.json'),
      `${JSON.stringify({
        experiment: options.experiment,
        artifact: artifactLabel,
        suite: { profile: suite.profile, seed: suite.seed, pairs: suite.pairs.length, perPair: suite.perPair, kinds: suite.kinds },
        conditions: CONDITIONS,
        oracleAssisted: CONDITIONS.filter((condition) => condition !== 'normal'),
        pairedAccuracy: { pairs: allPairs, bothCorrect: allBoth },
        generatedAt: new Date().toISOString()
      }, null, 2)}\n`
    );
    process.stdout.write(`paired accuracy (normal): ${allBoth}/${allPairs} pairs with both answers correct\n`);
    process.stdout.write(`${CONDITIONS.map((condition) => {
      const matched = rate(condition, 'answer_match');
      return `${condition}: ${matched.hit}/${matched.total} (${matched.percent.toFixed(1)}%)`;
    }).join('  ')}\n`);
    writeFileSync(join(registryDir, 'items', 'diagnostic.jsonl'), `${records.map((record) => JSON.stringify(record)).join('\n')}\n`);
    process.stdout.write(`wrote ${registryDir}/{items/diagnostic.jsonl,report.md,run-manifest.json}\n`);
    return;
  }

  lines.push('', '## Paired outcome against the normal condition', '', '| structure | problems | normal ok | rescued by values | rescued by plan | rescued by both | still failing |', '| --- | --- | --- | --- | --- | --- | --- |');
  for (const structure of suite.structures) {
    const problems = suite.problems.filter((problem) => problem.structure === structure);
    const classesOf = (problem, condition) => records.find((record) => record.problem === problem.id && record.condition === condition)?.class;
    const normalOk = problems.filter((problem) => classesOf(problem, 'normal') === 'answer_match').length;
    const rescued = (condition) => problems.filter((problem) => classesOf(problem, 'normal') !== 'answer_match' && classesOf(problem, condition) === 'answer_match').length;
    const still = problems.filter((problem) => CONDITIONS.every((condition) => classesOf(problem, condition) !== 'answer_match')).length;
    lines.push(`| ${structure} | ${problems.length} | ${normalOk} | ${rescued('values')} | ${rescued('plan')} | ${rescued('both')} | ${still} |`);
  }

  lines.push('', '## First divergence (normal condition)', '', '| divergence | items |', '| --- | --- |');
  const divergences = new Map();
  for (const record of records.filter((record) => record.condition === 'normal')) {
    divergences.set(record.divergence, (divergences.get(record.divergence) ?? 0) + 1);
  }
  for (const [divergence, count] of [...divergences.entries()].sort((left, right) => right[1] - left[1])) {
    lines.push(`| ${divergence} | ${count} |`);
  }

  writeFileSync(join(registryDir, 'report.md'), `${lines.join('\n')}\n`);
  writeFileSync(
    join(registryDir, 'run-manifest.json'),
    `${JSON.stringify(
      {
        experiment: options.experiment,
        artifact: artifactLabel,
        suite: { profile: suite.profile, seed: suite.seed, perStructure: suite.perStructure, structures: suite.structures, items: suite.problems.length },
        conditions: CONDITIONS,
        oracleAssisted: CONDITIONS.filter((condition) => condition !== 'normal'),
        structureSplit: {
          development: suite.structures.filter((id) => !['filter-total-add-rate', 'filter-count-per-unit'].includes(id)),
          held: ['filter-total-add-rate', 'filter-count-per-unit']
        },
        decoding: { temperature: 0, maxTokens: options.maxTokens, concurrency: options.concurrency, attemptsPerItem: 1, transportRetries: 1 },
        startedAt: new Date().toISOString()
      },
      null,
      2
    )}\n`
  );

  process.stdout.write(
    CONDITIONS.map((condition) => {
      const matched = rate(condition, 'answer_match');
      return `${condition}: ${matched.hit}/${matched.total} (${matched.percent.toFixed(1)}%)`;
    }).join('  ') + `\nwrote ${registryDir}/{items/diagnostic.jsonl,report.md,run-manifest.json}\n`
  );
}

if (process.argv[1] !== undefined && pathToFileURL(process.argv[1]).href === import.meta.url) {
  await main();
}
