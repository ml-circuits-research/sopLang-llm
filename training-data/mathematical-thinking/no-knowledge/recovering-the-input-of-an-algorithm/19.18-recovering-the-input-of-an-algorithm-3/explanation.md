# Explanation 19.18 — Recovering the Input of an Algorithm 3

## Explanation

1. The algorithm turns the input x into y = (x + 5) × 3, given as y = 33.
2. Reversing undoes the last operation first: dividing the output by 3 gives 33 ÷ 3 = 11.
3. Then the earlier addition is undone by subtracting 5, so the input is 6.
4. Checking forward, (6 + 5) × 3 = 33, which confirms the recovered input.

Reference solution as printed in the source (chapter 19, 3 steps):

1. Undo the multiplication: 33÷3=11.
2. Undo the addition: 11-5=6.
3. Check: (6+5)×3=33.

## Result

**Answer.** 6

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
