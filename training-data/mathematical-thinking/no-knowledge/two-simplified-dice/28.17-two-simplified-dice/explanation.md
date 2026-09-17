# Explanation 28.17 — Two simplified dice

## Explanation

1. Each of the 2 cubes shows one of 2 faces.
2. The cubes are independent, so each cube multiplies the number of pairs by its face count.
3. 2^2 = 4 distinct ordered results.

Reference solution as printed in the source (chapter 28, 4 steps):

1. The first cube has 2 outcomes.
2. For each, the second has 2.
3. The order of the cubes is preserved in the pair.
4. 2×2=4.

## Result

**Answer.** 4 results.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
