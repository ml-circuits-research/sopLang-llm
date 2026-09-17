# Explanation 11.25 — Proportional Table with the Same Rule 5

## Explanation

1. The table rule is constant: B is always 4 times A, so for A = 8 the value of B is fixed.
2. Applying the rule gives 4 · 8 = 32.
3. Testing the candidates 24, 32, 40 against that value leaves exactly 32.

Reference solution as printed in the source (chapter 11, 3 steps):

1. Apply the rule: 4×8=32.
2. Among the candidates, only 32 matches the result.
3. The others are one group of 8 less or more.

## Result

**Answer.** 32

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
