# Explanation 13.10 — Total and a Multiplicative Relationship 5

## Explanation

1. The two boxes hold 40 pieces together, and A holds 3 times B plus 4 extra pieces.
2. Setting the extra pieces aside leaves 40 − 4 = 36 pieces shared by B and the 3 copies of B.
3. That is 4 equal groups, so B holds 36 ÷ 4 = 9 pieces.
4. Then A holds 3 · 9 + 4 = 31 pieces, and 31 + 9 = 40 confirms the total.

Reference solution as printed in the source (chapter 13, 4 steps):

1. If B=9, the 3-times part is 3×9=27.
2. Adding 4 gives A=31.
3. The total becomes 31+9=40, exactly the required value.
4. Therefore the pair satisfies both conditions.

## Result

**Answer.** A=31, B=9.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
