# Explanation 24.22 — An upper bound from an object that does not fit

## Explanation

1. The 18 cm stick fits, so the interior length L is at least 18 cm, and the 20 cm stick does not fit, so L is strictly less than 20 cm.
2. Both conditions hold at once, which gives 18 cm ≤ L < 20 cm as everything the two tests prove.

Reference solution as printed in the source (chapter 24, 4 steps):

1. The fact that the 18 cm stick fits shows L≥18.
2. The fact that the 20 cm stick does not fit shows L<20.
3. Both conditions must be true at the same time.
4. Therefore 18≤L<20.

## Result

**Answer.** 18 cm ≤ L < 20 cm.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
