# Explanation 25.1 — How many segments does a row of joined squares have?

## Explanation

1. Each of the 2 separate squares contributes 4 sides, so counting them apart gives 8 sides.
2. Two squares that share a complete side turn that side interior: the two counted sides become one shared segment, removing 2 sides at each of the 1 joins.
3. The outer boundary therefore has 6 segments.

Reference solution as printed in the source (chapter 25, 4 steps):

1. Separately there would be 4+4=8 sides.
2. The shared side belongs to both squares, so it was counted twice in the total 8.
3. After joining, that side is no longer part of the outer boundary.
4. Remove the two counted appearances: 8−2=6.

## Result

**Answer.** 6 segments.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
