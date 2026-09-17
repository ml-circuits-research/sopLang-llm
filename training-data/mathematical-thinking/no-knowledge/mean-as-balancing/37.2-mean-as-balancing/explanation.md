# Explanation 37.2 — Mean as balancing

## Explanation

1. Redistributing without loss keeps the total of 15 balls unchanged, and "the same number in every box" means sharing it equally among 3 boxes.
2. The equal share is 5 balls, and 5 × 3 returns the original total as a check.

Reference solution as printed in the source (chapter 37, 4 steps):

1. The total is 2+5+8=15.
2. Redistribution preserves the total.
3. Divide equally among 3 boxes.
4. 15÷3=5, which is the mean of the initial values.

## Result

**Answer.** 5 balls.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
