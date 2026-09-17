# Explanation 13.8 — Total and a Multiplicative Relationship 3

## Explanation

1. The two boxes hold 35 pieces together, and A holds 2 times B plus 5 extra pieces.
2. Setting the extra pieces aside leaves 35 − 5 = 30 pieces shared by B and the 2 copies of B.
3. That is 3 equal groups, so B holds 30 ÷ 3 = 10 pieces.
4. Then A holds 2 · 10 + 5 = 25 pieces, and 25 + 10 = 35 confirms the total.

Reference solution as printed in the source (chapter 13, 4 steps):

1. If B=10, the 2-times part is 2×10=20.
2. Adding 5 gives A=25.
3. The total becomes 25+10=35, exactly the required value.
4. Therefore the pair satisfies both conditions.

## Result

**Answer.** A=25, B=10.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
