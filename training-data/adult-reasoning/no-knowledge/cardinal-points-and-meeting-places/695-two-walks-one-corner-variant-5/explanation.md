# Explanation 695 — Two walks, one corner — variant 5

## Explanation

1. Rita walks north 240 m and then east 120 m, and Sam walks east 120 m and then north 240 m, both from the post office in Stadium District.
2. On a rectangular grid without diagonals the two legs stay perpendicular, so going north before east and going east before north both end at the corner with the same northing and the same easting.
3. The two distances are identical in both walks, so the final points coincide: north 240 + east 120 = east 120 + north 240.

Reference material as printed in the source:

Perpendicular segments commute. A one-way street or a diagonal would change the answer; the stem excludes them.

## Result

**Answer.** Yes. On a grid, north 240 + east 120 = east 120 + north 240.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
