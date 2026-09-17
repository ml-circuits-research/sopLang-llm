# Explanation 11.4 — “5 Times as Much” as Grouping 4

## Explanation

1. Luca has 7 tokens, and Matei has 5 times as many.
2. The statement defines "5 times as many" as 5 equal groups of the base quantity, so Matei's tokens form 5 groups of 7.
3. Multiplying the base by the number of groups, 7 · 5 = 35, gives the second child's tokens.

Reference solution as printed in the source (chapter 11, 3 steps):

1. One group has 7.
2. We have 5 such groups: 7 repeated 5 times.
3. 5×7=35.

## Result

**Answer.** 35

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
