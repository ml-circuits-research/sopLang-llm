# Explanation 1.15 — The Hidden Number Between Two Bounds 5

## Explanation

1. The rule is a conjunction: a candidate counts only if it satisfies both comparisons at once (greater than 11 and less than 15).
2. Testing the list 2, 12, 17, 20 against both comparisons leaves exactly one number.
3. That number is 12; every other candidate fails at least one of the two comparisons.

Reference solution as printed in the source (chapter 1, 4 steps):

1. Eliminate the numbers that are not greater than 11.
2. Among those that remain, eliminate the numbers that are not less than 15.
3. Only one candidate remains: 12.
4. Check: it satisfies both inequalities at the same time.

## Result

**Answer.** 12

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
