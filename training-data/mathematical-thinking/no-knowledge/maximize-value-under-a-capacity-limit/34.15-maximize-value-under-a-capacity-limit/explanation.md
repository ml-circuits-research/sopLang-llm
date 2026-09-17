# Explanation 34.15 — Maximize value under a capacity limit

## Explanation

1. Each object is either taken or left, so the search tries every combination and discards the ones heavier than 6 kg.
2. Comparing the allowed combinations by total value leaves A and C at value 11.
3. No other allowed combination reaches a larger value, so A+C is optimal.

Reference solution as printed in the source (chapter 34, 5 steps):

1. List the allowed combinations.
2. A+C has weight 6 and value 11.
3. B+C has weight 5 and value 10.
4. A+B and all three exceed 6; single objects have lower values.
5. The maximum is 11.

## Result

**Answer.** A+C, value 11.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
