# Explanation 697 — Two walks, one corner — variant 7

## Explanation

1. Elena walks north 260 m and then east 130 m, and Farid walks east 130 m and then north 260 m, both from the post office in Bridge City.
2. On a rectangular grid without diagonals the two legs stay perpendicular, so going north before east and going east before north both end at the corner with the same northing and the same easting.
3. The two distances are identical in both walks, so the final points coincide: north 260 + east 130 = east 130 + north 260.

Reference material as printed in the source:

Perpendicular segments commute. A one-way street or a diagonal would change the answer; the stem excludes them.

## Result

**Answer.** Yes. On a grid, north 260 + east 130 = east 130 + north 260.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
