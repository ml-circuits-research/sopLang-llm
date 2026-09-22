# Explanation length-ranked-words-37 — Length Ranked Words

## Explanation

1. The label lists five words: meadow, apricot, azalea, lilac, elm.
2. The ordered stage sorts them by length and keeps the order shown for equal lengths, and the extremes stage reads the length of its first and last entry: 3 and 7.
3. The answer prints the ordered words, elm, lilac, meadow, azalea, apricot, and the longest length, 7.

**Generator provenance.** arithmetic.mjs 1.2.0, family length-ranked-words, instance 37, sampled with seed 20260921 from the latent plan `length-ranked-words`; this example carries no source span because its statement was generated.

## Result

**Answer.** From shortest to longest: elm, lilac, meadow, azalea, apricot; the longest word has 7 letters.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
