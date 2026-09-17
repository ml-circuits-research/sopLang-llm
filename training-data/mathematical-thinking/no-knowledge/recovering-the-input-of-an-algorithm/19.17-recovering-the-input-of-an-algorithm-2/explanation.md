# Explanation 19.17 — Recovering the Input of an Algorithm 2

## Explanation

1. The algorithm turns the input x into y = (x + 4) × 2, given as y = 22.
2. Reversing undoes the last operation first: dividing the output by 2 gives 22 ÷ 2 = 11.
3. Then the earlier addition is undone by subtracting 4, so the input is 7.
4. Checking forward, (7 + 4) × 2 = 22, which confirms the recovered input.

Reference solution as printed in the source (chapter 19, 3 steps):

1. Undo the multiplication: 22÷2=11.
2. Undo the addition: 11-4=7.
3. Check: (7+4)×2=22.

## Result

**Answer.** 7

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
