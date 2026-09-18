# Explanation 699 — Two walks, one corner — variant 9

## Explanation

1. Mira walks north 280 m and then east 140 m, and Ned walks east 140 m and then north 280 m, both from the post office in Station Quarter.
2. On a rectangular grid without diagonals the two legs stay perpendicular, so going north before east and going east before north both end at the corner with the same northing and the same easting.
3. The two distances are identical in both walks, so the final points coincide: north 280 + east 140 = east 140 + north 280.

Reference material as printed in the source:

Perpendicular segments commute. A one-way street or a diagonal would change the answer; the stem excludes them.

## Result

**Answer.** Yes. On a grid, north 280 + east 140 = east 140 + north 280.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
