/**
 * English-only gate for generated dataset artifacts.
 *
 * The repository rule reserves Romanian for spoken communication: everything
 * written to disk is English, and the only permitted non-English text is
 * verbatim source material quoted for provenance. This module is the
 * enforcement half of that rule for the data pipeline. It detects the two
 * defect classes the seed books actually exhibit:
 *
 * - Romanian diacritics in any generated file, which indicate untranslated
 *   source prose that leaked through a family renderer.
 * - The Romanian polarity tokens "Da" and "Nu" as standalone answer tokens,
 *   which the source book prints instead of "Yes" and "No" in one chapter.
 *
 * Rejection records are exempt because they quote the printed answer of a
 * rejected candidate verbatim as provenance; the pilot applies the gate to
 * every other generated file before anything is written.
 */

// The diacritic class is Romanian-specific (ă â î ș ț and the cedilla forms)
// because the repository's non-English policy targets Romanian, and a general
// Latin-diacritic class would flag English loanwords such as "café".
const DIACRITIC_PATTERN = /[ĂÂÎȘȚăâîșțŞŢşţ]/g;
const POLARITY_PATTERN = /(^|[\s(„"'])(DA|Da|NU|Nu)\b\.?(?=$|[\s).,;:!?"'”])/gm;

/**
 * Returns the non-English tokens found in a generated text, or an empty array
 * when the text is clean. Diacritic occurrences are reported per character so
 * a leak is visible even when the offending word is not a known token.
 */
export function findNonEnglishTokens(text) {
  const source = String(text ?? '');
  const tokens = new Set();
  for (const match of source.matchAll(DIACRITIC_PATTERN)) {
    tokens.add(`diacritic ${match[0]} (U+${match[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0')})`);
  }
  for (const match of source.matchAll(POLARITY_PATTERN)) {
    tokens.add(match[2]);
  }
  return [...tokens];
}

/**
 * Throws when generated content violates the English-only policy. `where`
 * names the artifact under inspection so the error is actionable without a
 * re-run.
 */
export function assertEnglishContent(text, where) {
  const tokens = findNonEnglishTokens(text);
  if (tokens.length > 0) {
    throw new Error(`non-English content in ${where}: ${tokens.join(', ')}`);
  }
}
