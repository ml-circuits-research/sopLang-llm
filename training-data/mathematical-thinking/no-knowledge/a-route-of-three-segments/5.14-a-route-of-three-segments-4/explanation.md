# Explanation 5.14 — A Route of Three Segments 4

## Explanation

1. A route made of consecutive segments with no overlaps has a length equal to the sum of the segment lengths, as the given rule states.
2. The three segments measure 9, 3, 5 in the same unit, so they can be added directly without any conversion.
3. The total is 9 + 3 + 5 = 17, reported in cm.

Reference solution as printed in the source (chapter 5, 3 steps):

1. Add the first two segments: 9+3=12 cm.
2. Add the third: 12+5=17 cm.
3. Therefore the complete route measures 17 cm.

## Result

**Answer.** 17 cm

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
