# Explanation 37.18 — Reconstruct a missing frequency

## Explanation

1. The frequencies of one table must add up to the stated total, so the unknown frequency is what remains.
2. The known frequencies A=4, C=3 add to 7.
3. The frequency of B is 10 − 7 = 3.

Reference solution as printed in the source (chapter 37, 4 steps):

1. The known frequencies sum to 7.
2. The total is 10.
3. B=10-7=3.
4. Check: 4+3+3=10.

## Result

**Answer.** 3.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
