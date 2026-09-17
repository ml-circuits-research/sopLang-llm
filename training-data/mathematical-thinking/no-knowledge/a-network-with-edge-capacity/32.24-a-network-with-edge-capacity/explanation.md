# Explanation 32.24 — A network with edge capacity

## Explanation

1. Each trip carries at most 5 boxes, so the boxes divide into groups of that size.
2. 12 boxes need 3 trips, because the boxes left over after full trips still need one more trip.

Reference solution as printed in the source (chapter 32, 4 steps):

1. Two trips could carry at most 10 boxes.
2. 12>10, so two are not enough.
3. Three trips can carry up to 15.
4. We can carry 5+5+2, so 3 trips are sufficient and minimal.

## Result

**Answer.** 3 trips.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
