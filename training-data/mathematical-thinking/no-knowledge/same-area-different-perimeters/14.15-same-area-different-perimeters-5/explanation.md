# Explanation 14.15 — Same Area, Different Perimeters 5

## Explanation

1. The two definitions in the statement give the two measurements that must be compared: area = product of the side lengths and perimeter = twice the sum of the side lengths.
2. R1 covers 84 square units and R2 covers 84, so the areas agree even though the side pairs differ.
3. The perimeters are the sums doubled: 2×(14+6) = 40 and 2×(12+7) = 38.
4. Decomposing the same area into a longer, thinner rectangle therefore lengthens the boundary, which is what the comparison shows.

Reference solution as printed in the source (chapter 14, 4 steps):

1. A1=84, A2=84; therefore the areas are equal.
2. P1=2×(20)=40.
3. P2=2×(19)=38.
4. Comparing 40 and 38, the smaller perimeter belongs to the al second rectangle.

## Result

**Answer.** Equal areas; P1=40, P2=38.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
