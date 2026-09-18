# Explanation 692 — Two walks, one corner — variant 2

## Explanation

1. Elena walks north 210 m and then east 105 m, and Farid walks east 105 m and then north 210 m, both from the post office in Bridge City.
2. On a rectangular grid without diagonals the two legs stay perpendicular, so going north before east and going east before north both end at the corner with the same northing and the same easting.
3. The two distances are identical in both walks, so the final points coincide: north 210 + east 105 = east 105 + north 210.

Reference material as printed in the source:

Perpendicular segments commute. A one-way street or a diagonal would change the answer; the stem excludes them.

## Result

**Answer.** Yes. On a grid, north 210 + east 105 = east 105 + north 210.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
