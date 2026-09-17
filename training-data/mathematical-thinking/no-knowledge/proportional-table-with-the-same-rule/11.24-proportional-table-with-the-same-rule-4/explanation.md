# Explanation 11.24 — Proportional Table with the Same Rule 4

## Explanation

1. The table rule is constant: B is always 5 times A, so for A = 7 the value of B is fixed.
2. Applying the rule gives 5 · 7 = 35.
3. Testing the candidates 28, 35, 42 against that value leaves exactly 35.

Reference solution as printed in the source (chapter 11, 3 steps):

1. Apply the rule: 5×7=35.
2. Among the candidates, only 35 matches the result.
3. The others are one group of 7 less or more.

## Result

**Answer.** 35

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
