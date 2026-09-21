/**
 * Deterministic sampling helpers for procedural sources.
 *
 * A procedural source must be able to reproduce its instances from a recorded
 * seed, because the seed is the provenance record a generated example carries
 * in place of a source span (DS008, "Procedural source families"). The
 * generator here is mulberry32: tiny, dependency-free, and stable across Node
 * versions, which matters more than statistical quality for sampling parameter
 * values and entity names.
 */

/** A seeded generator returning floats in [0, 1). */
export function seededRandom(seed) {
  let state = (Number(seed) >>> 0) || 1;
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** An integer in [low, high], both inclusive. */
export function intBetween(random, low, high) {
  return low + Math.floor(random() * (high - low + 1));
}

/** One element of a non-empty list. */
export function pick(random, values) {
  return values[Math.min(values.length - 1, Math.floor(random() * values.length))];
}

/** `count` distinct elements of a list, in the order they were drawn. */
export function pickDistinct(random, values, count) {
  const pool = [...values];
  const drawn = [];
  while (drawn.length < count && pool.length > 0) {
    const index = Math.min(pool.length - 1, Math.floor(random() * pool.length));
    drawn.push(pool[index]);
    pool.splice(index, 1);
  }
  return drawn;
}

/** A stable 32-bit hash of a text seed, so a family's stream does not depend on string parsing. */
export function seedOf(text) {
  let hash = 0x811c9dc5;
  for (const character of String(text)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/** A seeded stream of `count` instances: the same seed and family reproduce them exactly. */
export function sampleInstances({ family, seed, count }) {
  const random = seededRandom(seedOf(`${seed}:${family.id}`));
  const instances = [];
  const seen = new Set();
  let attempt = 0;
  while (instances.length < count && attempt < count * 50) {
    attempt += 1;
    const slots = family.sample(random);
    const statement = family.statement(slots);
    const key = statement;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    instances.push({ index: instances.length, statement, slots });
  }
  return instances;
}
