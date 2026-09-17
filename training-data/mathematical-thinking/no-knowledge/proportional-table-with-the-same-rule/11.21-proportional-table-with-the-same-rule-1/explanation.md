# Explanation 11.21 — Proportional Table with the Same Rule 1

## Explanation

1. The table rule is constant: B is always 6 times A, so for A = 4 the value of B is fixed.
2. Applying the rule gives 6 · 4 = 24.
3. Testing the candidates 20, 24, 28 against that value leaves exactly 24.

Reference solution as printed in the source (chapter 11, 3 steps):

1. Apply the rule: 6×4=24.
2. Among the candidates, only 24 matches the result.
3. The others are one group of 4 less or more.

## Result

**Answer.** 24

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
