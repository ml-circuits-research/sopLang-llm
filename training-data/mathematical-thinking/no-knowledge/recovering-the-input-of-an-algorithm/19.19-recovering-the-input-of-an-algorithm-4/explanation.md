# Explanation 19.19 — Recovering the Input of an Algorithm 4

## Explanation

1. The algorithm turns the input x into y = (x + 2) × 3, given as y = 30.
2. Reversing undoes the last operation first: dividing the output by 3 gives 30 ÷ 3 = 10.
3. Then the earlier addition is undone by subtracting 2, so the input is 8.
4. Checking forward, (8 + 2) × 3 = 30, which confirms the recovered input.

Reference solution as printed in the source (chapter 19, 3 steps):

1. Undo the multiplication: 30÷3=10.
2. Undo the addition: 10-2=8.
3. Check: (8+2)×3=30.

## Result

**Answer.** 8

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
