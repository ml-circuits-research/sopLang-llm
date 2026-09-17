# Explanation 39.16 — The pigeonhole principle as a proof

## Explanation

1. If each color were used at most once, at most as many objects as colors could be colored.
2. There are more objects than colors, so that assumption fails and two objects must share a color.

Reference solution as printed in the source (chapter 39, 4 steps):

1. Assume all objects have different colors.
2. With only 4 colors, we could then have at most 4 objects.
3. But there are 5.
4. The contradiction shows that one color must be repeated.

## Result

**Answer.** Yes, at least two have the same color.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
