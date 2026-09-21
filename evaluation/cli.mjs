#!/usr/bin/env node
/**
 * Minimal command-line interface: the evaluation loop runs a whole slice, the
 * report renders a finished one. Keeping the flags here leaves `run-eval.mjs`
 * (the loop, the classification, and the writers) inside the DS001 module size
 * rule, and it means the CLI surface is one file to read when an argument is in
 * question.
 *
 * Usage:
 *   node evaluation/cli.mjs --experiment <id> --slice <holdout|validation|file:<path>>
 *                           [--gguf <path>] [--books a,b] [--limit N] [--base url]
 *                           [--model alias] [--max-tokens N] [--concurrency N]
 *                           [--out dir] [--log] [--probes]
 *   node evaluation/cli.mjs render <experiment-directory>
 *
 * The flags of the loop are unchanged (`evaluation/README` prose lives in
 * `docs/`): a missing argument is a usage error with exit code 2, a failing run
 * exits 1, and a successful run prints the four rates of the slice it scored.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { renderReport } from './run-eval.mjs';

class UsageError extends Error {}

function positiveInt(text, flag) {
  const value = Number(text);
  if (!Number.isInteger(value) || value < 1) {
    throw new UsageError(`${flag} needs a positive integer, got "${text}"`);
  }
  return value;
}

export function parseArgs(argv, { base, maxTokens, out = 'evaluation/registry' }) {
  const options = {
    experiment: null,
    slice: null,
    gguf: null,
    books: null,
    limit: null,
    base,
    model: null,
    maxTokens,
    concurrency: 1,
    out,
    log: false,
    probes: false,
    help: false
  };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = () => {
      const next = argv[index + 1];
      if (next === undefined) throw new UsageError(`${flag} needs a value`);
      index += 1;
      return next;
    };
    switch (flag) {
      case '--experiment':
        options.experiment = value();
        break;
      case '--slice': {
        const spec = value();
        if (spec !== 'holdout' && spec !== 'validation' && !(spec.startsWith('file:') && spec.length > 'file:'.length)) {
          throw new UsageError(`--slice must be holdout, validation, or file:<path>, got "${spec}"`);
        }
        options.slice = spec;
        break;
      }
      case '--gguf':
        options.gguf = value();
        break;
      case '--books': {
        const list = value().split(',').map((book) => book.trim()).filter((book) => book !== '');
        options.books = list.length > 0 ? list : null;
        break;
      }
      case '--limit':
        options.limit = positiveInt(value(), flag);
        break;
      case '--base':
        options.base = value();
        break;
      case '--model':
        options.model = value();
        break;
      case '--max-tokens':
        options.maxTokens = positiveInt(value(), flag);
        break;
      case '--concurrency':
        options.concurrency = positiveInt(value(), flag);
        break;
      case '--out':
        options.out = value();
        break;
      case '--log':
        options.log = true;
        break;
      case '--probes':
        options.probes = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        throw new UsageError(`unknown argument "${flag}"`);
    }
  }
  return options;
}

/** Renders the report of a finished run from its manifest and metrics, and nothing else. */
export function renderExperiment(directory) {
  const manifestPath = join(directory, 'run-manifest.json');
  const metricsPath = join(directory, 'metrics.json');
  if (!existsSync(manifestPath) || !existsSync(metricsPath)) {
    throw new UsageError(`${directory} holds no run-manifest.json and metrics.json pair`);
  }
  return renderReport({
    manifest: JSON.parse(readFileSync(manifestPath, 'utf8')),
    metrics: JSON.parse(readFileSync(metricsPath, 'utf8'))
  });
}

export { UsageError };
