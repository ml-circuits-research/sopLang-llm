# Explanation 29.1 — The “and” condition requires both rules

## Explanation

1. The badge rule is a conjunction: a number must be greater than 3 and at the same time less than 8.
2. Testing each candidate against both conditions leaves only the numbers in the open interval between 3 and 8.
3. The boundaries themselves are excluded because the comparisons are strict, and that is why 8 does not receive the badge.

Reference solution as printed in the source (chapter 29, 4 steps):

1. 2 fails the first condition.
2. 4 satisfies both.
3. 7 satisfies both.
4. 9 fails the condition x<8.

## Result

**Answer.** 4 and 7.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
