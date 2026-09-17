# Explanation 13.7 — Total and a Multiplicative Relationship 2

## Explanation

1. The two boxes hold 30 pieces together, and A holds 3 times B plus 2 extra pieces.
2. Setting the extra pieces aside leaves 30 − 2 = 28 pieces shared by B and the 3 copies of B.
3. That is 4 equal groups, so B holds 28 ÷ 4 = 7 pieces.
4. Then A holds 3 · 7 + 2 = 23 pieces, and 23 + 7 = 30 confirms the total.

Reference solution as printed in the source (chapter 13, 4 steps):

1. If B=7, the 3-times part is 3×7=21.
2. Adding 2 gives A=23.
3. The total becomes 23+7=30, exactly the required value.
4. Therefore the pair satisfies both conditions.

## Result

**Answer.** A=23, B=7.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
