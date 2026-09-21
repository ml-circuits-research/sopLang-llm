# Explanation vowel-richest-word-2 — Vowel Richest Word

## Explanation

1. The chalkboard lists four words: iris, guitar, mint, trout.
2. The perWord stage counts the vowels of every word, and the ranked stage orders those records by their count: guitar comes first.
3. The answer prints the richest word, guitar, with its 3 vowels.

**Generator provenance.** arithmetic.mjs 1.1.0, family vowel-richest-word, instance 2, sampled with seed 20260921 from the latent plan `vowel-richest-word`; this example carries no source span because its statement was generated.

## Result

**Answer.** The word "guitar" carries 3 vowels.

**Verification.** constructed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
