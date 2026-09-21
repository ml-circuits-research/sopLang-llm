// Artifact discovery for the evaluation tools: which checkpoint should a session
// or a probe run put on the GPU, and where does its file live. Kept apart from
// the CLIs so importing it never starts a server or a chat.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { REPOSITORY_ROOT, resolveArtifactPath } from './server.mjs';

export const REGISTRY = join(REPOSITORY_ROOT, 'evaluation/registry');
export const BASE_GGUF = join(REPOSITORY_ROOT, 'training/checkpoints/base-f16.gguf');

/**
 * The best measured checkpoint: among every experiment with a selection run, the
 * winner with the highest oracle match on the (shared) validation slice, ties
 * broken by parse validity and then by recency. Recency alone would hand a
 * session a weaker arm, because the arm that ran last is not the arm that
 * scored best; a named artifact always overrides the choice.
 */
export function bestWinner() {
  if (!existsSync(REGISTRY)) return null;
  const candidates = readdirSync(REGISTRY)
    .map((name) => join(REGISTRY, name, 'selection.json'))
    .filter((path) => existsSync(path))
    .map((path) => ({ path, mtime: statSync(path).mtimeMs }));
  const ranked = [];
  for (const candidate of candidates) {
    const selection = JSON.parse(readFileSync(candidate.path, 'utf8'));
    const row = selection.rows.find((entry) => entry.checkpoint === selection.winner);
    if (row === undefined) continue;
    const gguf = resolveArtifactPath(row.gguf);
    if (!existsSync(gguf)) continue;
    ranked.push({
      experiment: selection.experiment,
      winner: selection.winner,
      gguf,
      oracle: row.metrics?.rates?.oracle_match ?? -1,
      parse: row.metrics?.rates?.parse_validity ?? -1,
      mtime: candidate.mtime,
    });
  }
  ranked.sort((left, right) => (right.oracle - left.oracle) || (right.parse - left.parse) || (right.mtime - left.mtime));
  return ranked[0] ?? null;
}

/**
 * The artifact of a request: an explicit `--gguf`, the winner of a named
 * experiment's selection run, the best measured winner, or the untuned base.
 */
export function artifactFor({ gguf = null, experiment = null } = {}) {
  if (gguf !== null) {
    const path = resolveArtifactPath(gguf);
    if (!existsSync(path)) throw new Error(`the artifact ${path} does not exist`);
    return { experiment: 'explicit --gguf', winner: null, gguf: path };
  }
  if (experiment !== null) {
    const selectionPath = join(REGISTRY, experiment, 'selection.json');
    if (!existsSync(selectionPath)) throw new Error(`${selectionPath} does not exist`);
    const selection = JSON.parse(readFileSync(selectionPath, 'utf8'));
    const row = selection.rows.find((entry) => entry.checkpoint === selection.winner);
    if (row === undefined) throw new Error(`selection.json of ${experiment} has no row for its winner`);
    return { experiment: selection.experiment, winner: selection.winner, gguf: resolveArtifactPath(row.gguf) };
  }
  const best = bestWinner();
  if (best !== null) return best;
  if (existsSync(BASE_GGUF)) return { experiment: 'base model (no fine-tuned selection found)', winner: 'base', gguf: BASE_GGUF };
  throw new Error('no artifact found: pass --gguf, or run an evaluation that writes a selection.json');
}
