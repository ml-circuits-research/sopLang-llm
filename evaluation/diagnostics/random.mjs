/**
 * Shared random draws and the subject vocabulary of the diagnostic suites.
 *
 * Both the structure suite and the pair suite render from this one lexicon, so a
 * statement's wording does not identify which suite produced it, and both draw
 * from the same seeded generator, so a suite reproduces from its seed alone.
 */

/** Turn a stream key into a 32-bit seed, so a named stream is reproducible. */
export function seedForStream(key) {
  let hash = 2166136261;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick(random, values) {
  return values[Math.min(values.length - 1, Math.floor(random() * values.length))];
}

export const SUBJECTS = ['the workshop', 'the depot', 'the clinic', 'the print shop', 'the laboratory'];
export const UNITS = ['units', 'parts', 'crates', 'litres', 'tickets'];
export const TIMES = ['this morning', 'on Monday', 'after the audit', 'before lunch', 'last week'];
