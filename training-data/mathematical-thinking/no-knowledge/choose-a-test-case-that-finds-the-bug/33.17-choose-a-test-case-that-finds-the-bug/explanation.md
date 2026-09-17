# Explanation 33.17 — Choose a test case that finds the bug

## Explanation

1. A test case reveals a bug only when the correct rule and the faulty program disagree on that input.
2. For this pair of rules the values x=1 and x=5 are tested against both behaviours.
3. Every candidate distinguishes the two, so the answer is: x=1 and x=5.

Reference solution as printed in the source (chapter 33, 4 steps):

1. For x=1, correct 2, incorrect 3.
2. For x=5, correct 10, incorrect 7.
3. Both inputs produce different results under the two rules.
4. So either is a useful test, unlike x=2.

## Result

**Answer.** Both: x=1 and x=5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
