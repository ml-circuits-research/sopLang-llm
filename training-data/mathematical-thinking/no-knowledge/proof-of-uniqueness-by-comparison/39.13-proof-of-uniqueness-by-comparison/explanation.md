# Explanation 39.13 — Proof of uniqueness by comparison

## Explanation

1. If two values both satisfy the equation, subtracting the same term from both equalities gives the same value for each.
2. That single value satisfies the equation, so the solution exists and is unique.

Reference solution as printed in the source (chapter 39, 4 steps):

1. From a+5=12, subtract 5 and obtain a=7.
2. From b+5=12, obtain b=7.
3. Both supposed solutions are the same value.
4. Therefore the solution is unique.

## Result

**Answer.** The unique solution is 7.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
