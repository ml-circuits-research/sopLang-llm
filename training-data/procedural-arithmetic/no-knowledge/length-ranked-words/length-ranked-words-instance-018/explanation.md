# Explanation length-ranked-words-18 — Length Ranked Words

## Explanation

1. The label lists five words: birch, emu, ash, iris, ocean.
2. The ordered stage sorts them by length and keeps the order shown for equal lengths, and the extremes stage reads the length of its first and last entry: 3 and 5.
3. The answer prints the ordered words, emu, ash, iris, birch, ocean, and the longest length, 5.

**Generator provenance.** arithmetic.mjs 1.2.0, family length-ranked-words, instance 18, sampled with seed 20260921 from the latent plan `length-ranked-words`; this example carries no source span because its statement was generated.

## Result

**Answer.** From shortest to longest: emu, ash, iris, birch, ocean; the longest word has 5 letters.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
