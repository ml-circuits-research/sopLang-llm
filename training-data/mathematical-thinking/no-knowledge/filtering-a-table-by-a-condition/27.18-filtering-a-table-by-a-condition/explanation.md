# Explanation 27.18 — Filtering a table by a condition

## Explanation

1. The condition "at least 6" keeps a category only when its value is greater than or equal to 6.
2. Testing A=4, B=7, C=9, D=5 against that bound leaves B and C; the other categories are removed by the filter.

Reference solution as printed in the source (chapter 27, 4 steps):

1. A=4 is below 6, so eliminate it.
2. B=7 satisfies the condition.
3. C=9 satisfies the condition.
4. D=5 is below 6.

## Result

**Answer.** B and C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
