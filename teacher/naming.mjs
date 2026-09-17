/**
 * Shared naming helpers for the data pipeline.
 *
 * Folder and identifier names must be stable across runs and readable in a
 * terminal, so they are derived from source text with one function instead of
 * ad-hoc string surgery at each call site.
 */

export function slugify(text) {
  return String(text ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/["'“”„‘’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Answer comparison for verification. The printed answer and the computed
 * answer are compared after a canonical normalization that removes the
 * formatting the source varies (case, quotes, dashes, spacing, a trailing
 * period) while keeping the value-bearing tokens.
 */
export function normalizeAnswer(text) {
  return String(text ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[“”„‘’]/g, '"')
    .replace(/[–—−]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.;]+$/g, '')
    .replace(/^(the answer is|answer)\s*:?\s*/i, '')
    .trim();
}

export function answerMatches(printed, computed) {
  return normalizeAnswer(printed) === normalizeAnswer(computed);
}
