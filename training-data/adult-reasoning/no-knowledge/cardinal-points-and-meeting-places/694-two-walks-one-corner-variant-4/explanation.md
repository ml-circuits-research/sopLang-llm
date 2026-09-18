# Explanation 694 — Two walks, one corner — variant 4

## Explanation

1. Mira walks north 230 m and then east 115 m, and Ned walks east 115 m and then north 230 m, both from the post office in Station Quarter.
2. On a rectangular grid without diagonals the two legs stay perpendicular, so going north before east and going east before north both end at the corner with the same northing and the same easting.
3. The two distances are identical in both walks, so the final points coincide: north 230 + east 115 = east 115 + north 230.

Reference material as printed in the source:

Perpendicular segments commute. A one-way street or a diagonal would change the answer; the stem excludes them.

## Result

**Answer.** Yes. On a grid, north 230 + east 115 = east 115 + north 230.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
