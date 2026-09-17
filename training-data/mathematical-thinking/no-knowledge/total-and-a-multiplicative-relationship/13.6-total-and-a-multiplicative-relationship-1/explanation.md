# Explanation 13.6 — Total and a Multiplicative Relationship 1

## Explanation

1. The two boxes hold 27 pieces together, and A holds 2 times B plus 3 extra pieces.
2. Setting the extra pieces aside leaves 27 − 3 = 24 pieces shared by B and the 2 copies of B.
3. That is 3 equal groups, so B holds 24 ÷ 3 = 8 pieces.
4. Then A holds 2 · 8 + 3 = 19 pieces, and 19 + 8 = 27 confirms the total.

Reference solution as printed in the source (chapter 13, 4 steps):

1. If B=8, the 2-times part is 2×8=16.
2. Adding 3 gives A=19.
3. The total becomes 19+8=27, exactly the required value.
4. Therefore the pair satisfies both conditions.

## Result

**Answer.** A=19, B=8.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
