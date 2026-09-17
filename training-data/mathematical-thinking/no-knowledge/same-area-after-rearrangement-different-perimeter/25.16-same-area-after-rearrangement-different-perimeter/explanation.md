# Explanation 25.16 — Same area after rearrangement, different perimeter

## Explanation

1. Both arrangements use exactly the same four unit squares, only placed differently, so the area counted in unit squares is identical: 4 and 4.
2. The perimeter is the length of the boundary: a 2×2 square has 8 unit sides around it, while the 1×4 strip has 10.
3. The strip is longer and thinner, so it exposes more boundary for the same area.

Reference solution as printed in the source (chapter 25, 4 steps):

1. The number of unit squares is 4 in both arrangements, so the area is the same.
2. The 2×2 square has perimeter 2+2+2+2=8.
3. The 1×4 strip has perimeter 1+4+1+4=10.
4. Rearrangement preserves area but can change the boundary.

## Result

**Answer.** Same area; perimeters 8 and 10.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
