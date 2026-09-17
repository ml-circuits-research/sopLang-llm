# Explanation 34.19 — Order with minimum lot sizes

## Explanation

1. Screws come only in whole bags of 8, so the order must be a multiple of 8 at least 18.
2. One bag short leaves 18 − 16 screws still missing, so 3 bags are needed.
3. Those bags bring 24 screws, leaving 6 extra.

Reference solution as printed in the source (chapter 34, 4 steps):

1. Two bags give 16<18.
2. Three give 24≥18.
3. So three is the minimum.
4. The surplus is 24-18=6.

## Result

**Answer.** 3 bags; 6 extra screws.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
