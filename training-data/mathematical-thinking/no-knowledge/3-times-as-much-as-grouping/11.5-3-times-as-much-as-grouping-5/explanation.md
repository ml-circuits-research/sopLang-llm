# Explanation 11.5 — “3 Times as Much” as Grouping 5

## Explanation

1. Matei has 12 tokens, and Radu has 3 times as many.
2. The statement defines "3 times as many" as 3 equal groups of the base quantity, so Radu's tokens form 3 groups of 12.
3. Multiplying the base by the number of groups, 12 · 3 = 36, gives the second child's tokens.

Reference solution as printed in the source (chapter 11, 3 steps):

1. One group has 12.
2. We have 3 such groups: 12 repeated 3 times.
3. 3×12=36.

## Result

**Answer.** 36

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
