# Explanation 1.11 — The Hidden Number Between Two Bounds 1

## Explanation

1. The rule is a conjunction: a candidate counts only if it satisfies both comparisons at once (greater than 6 and less than 8).
2. Testing the list 4, 7, 9, 12 against both comparisons leaves exactly one number.
3. That number is 7; every other candidate fails at least one of the two comparisons.

Reference solution as printed in the source (chapter 1, 4 steps):

1. Eliminate the numbers that are not greater than 6.
2. Among those that remain, eliminate the numbers that are not less than 8.
3. Only one candidate remains: 7.
4. Check: it satisfies both inequalities at the same time.

## Result

**Answer.** 7

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
