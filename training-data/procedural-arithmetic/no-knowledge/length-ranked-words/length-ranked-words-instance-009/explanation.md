# Explanation length-ranked-words-9 — Length Ranked Words

## Explanation

1. The label lists five words: tulip, eel, ocean, melon, azalea.
2. The ordered stage sorts them by length and keeps the order shown for equal lengths, and the extremes stage reads the length of its first and last entry: 3 and 6.
3. The answer prints the ordered words, eel, tulip, ocean, melon, azalea, and the longest length, 6.

**Generator provenance.** arithmetic.mjs 1.3.0, family length-ranked-words, instance 9, sampled with seed 20260921 from the latent plan `length-ranked-words`; this example carries no source span because its statement was generated.

## Result

**Answer.** From shortest to longest: eel, tulip, ocean, melon, azalea; the longest word has 6 letters.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
