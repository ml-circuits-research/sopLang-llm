# Explanation 14.11 — Same Area, Different Perimeters 1

## Explanation

1. The two definitions in the statement give the two measurements that must be compared: area = product of the side lengths and perimeter = twice the sum of the side lengths.
2. R1 covers 36 square units and R2 covers 36, so the areas agree even though the side pairs differ.
3. The perimeters are the sums doubled: 2×(6+6) = 24 and 2×(9+4) = 26.
4. Decomposing the same area into a longer, thinner rectangle therefore lengthens the boundary, which is what the comparison shows.

Reference solution as printed in the source (chapter 14, 4 steps):

1. A1=36, A2=36; therefore the areas are equal.
2. P1=2×(12)=24.
3. P2=2×(13)=26.
4. Comparing 24 and 26, the smaller perimeter belongs to the first rectangle.

## Result

**Answer.** Equal areas; P1=24, P2=26.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
