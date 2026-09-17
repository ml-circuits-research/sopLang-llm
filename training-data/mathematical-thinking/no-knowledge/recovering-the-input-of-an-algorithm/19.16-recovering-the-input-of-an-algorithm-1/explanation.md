# Explanation 19.16 — Recovering the Input of an Algorithm 1

## Explanation

1. The algorithm turns the input x into y = (x + 3) × 2, given as y = 16.
2. Reversing undoes the last operation first: dividing the output by 2 gives 16 ÷ 2 = 8.
3. Then the earlier addition is undone by subtracting 3, so the input is 5.
4. Checking forward, (5 + 3) × 2 = 16, which confirms the recovered input.

Reference solution as printed in the source (chapter 19, 3 steps):

1. Undo the multiplication: 16÷2=8.
2. Undo the addition: 8-3=5.
3. Check: (5+3)×2=16.

## Result

**Answer.** 5

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
