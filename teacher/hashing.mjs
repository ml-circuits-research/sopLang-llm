/**
 * Content hashes of the data pipeline.
 *
 * The dataset report, the manifest rows, and the evaluation holdout all
 * identify content by a short content hash (twelve hexadecimal characters,
 * stable across runs) or by a full order hash used for deterministic
 * ordering. The plan hash names a latent plan: the hash of a family's
 * deterministic content with the instance values excluded, which is what the
 * variants of one template share.
 */

import { sha256 } from '../runtime/hashing.mjs';
import { planFingerprint } from './families/index.mjs';

export function contentHash(text) {
  return sha256(String(text)).slice(0, 12);
}

export function orderHash(text) {
  return sha256(String(text));
}

/**
 * The plan hash of an accepted item: the hash a reader can recompute from the
 * family to identify the latent plan of the example across its variants.
 */
export function planHashOf(item) {
  return contentHash(planFingerprint(item.entry));
}
