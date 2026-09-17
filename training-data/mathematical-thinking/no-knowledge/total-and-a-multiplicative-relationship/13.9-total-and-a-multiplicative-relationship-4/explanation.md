# Explanation 13.9 — Total and a Multiplicative Relationship 4

## Explanation

1. The two boxes hold 31 pieces together, and A holds 4 times B plus 1 extra pieces.
2. Setting the extra pieces aside leaves 31 − 1 = 30 pieces shared by B and the 4 copies of B.
3. That is 5 equal groups, so B holds 30 ÷ 5 = 6 pieces.
4. Then A holds 4 · 6 + 1 = 25 pieces, and 25 + 6 = 31 confirms the total.

Reference solution as printed in the source (chapter 13, 4 steps):

1. If B=6, the 4-times part is 4×6=24.
2. Adding 1 gives A=25.
3. The total becomes 25+6=31, exactly the required value.
4. Therefore the pair satisfies both conditions.

## Result

**Answer.** A=25, B=6.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
