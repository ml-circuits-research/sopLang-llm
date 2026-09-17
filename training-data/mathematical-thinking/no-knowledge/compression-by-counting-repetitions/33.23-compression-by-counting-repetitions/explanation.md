# Explanation 33.23 — Compression by counting repetitions

## Explanation

1. The encoder splits the text into maximal runs of one symbol, because a run of length one must also be written explicitly.
2. The text XXXYYZ becomes the groups 3X, 2Y, 1Z.
3. Writing each group as its count followed by the symbol gives 3X2Y1Z.

Reference solution as printed in the source (chapter 33, 4 steps):

1. XXX has 3 occurrences → 3X.
2. YY has 2 → 2Y.
3. Z has 1 → 1Z.
4. Concatenate the groups: 3X2Y1Z.

## Result

**Answer.** 3X2Y1Z.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
