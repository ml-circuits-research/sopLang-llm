# Explanation 37.21 — Original total from a percentage

## Explanation

1. The problem supplies the conversion locally: 25% is the same as 1/4.
2. So 1/4 of the total is 10, which means the total is 10 × 4/1 = 40.

Reference solution as printed in the source (chapter 37, 4 steps):

1. If one quarter is 10, the whole has 4 such parts.
2. 10×4=40.
3. Check: one quarter of 40 is 10.
4. The total is 40.

## Result

**Answer.** 40.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
