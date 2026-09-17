# Explanation 19.20 — Recovering the Input of an Algorithm 5

## Explanation

1. The algorithm turns the input x into y = (x + 4) × 2, given as y = 26.
2. Reversing undoes the last operation first: dividing the output by 2 gives 26 ÷ 2 = 13.
3. Then the earlier addition is undone by subtracting 4, so the input is 9.
4. Checking forward, (9 + 4) × 2 = 26, which confirms the recovered input.

Reference solution as printed in the source (chapter 19, 3 steps):

1. Undo the multiplication: 26÷2=13.
2. Undo the addition: 13-4=9.
3. Check: (9+4)×2=26.

## Result

**Answer.** 9

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
