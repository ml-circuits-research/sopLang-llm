# Explanation 22.13 — An ambiguous map instruction

## Explanation

1. A relative instruction such as "to the right" is interpreted using the traveler's facing direction, so it only names a destination once that direction is fixed.
2. The note never states the starting orientation, so different orientations send the traveler to different places.
3. Because the outcome depends on a state that is missing, the note does not determine a unique destination.

Reference solution as printed in the source (chapter 22, 4 steps):

1. If the traveler starts facing north, “right” means east.
2. If the traveler starts facing south, “right” means west.
3. The same wording can therefore lead to different destinations.
4. Without the starting orientation, the destination is not unique.

## Result

**Answer.** No; the starting orientation is missing.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
