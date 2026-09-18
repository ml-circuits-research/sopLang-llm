# Explanation 700 — Two walks, one corner — variant 10

## Explanation

1. Rita walks north 290 m and then east 145 m, and Sam walks east 145 m and then north 290 m, both from the post office in Stadium District.
2. On a rectangular grid without diagonals the two legs stay perpendicular, so going north before east and going east before north both end at the corner with the same northing and the same easting.
3. The two distances are identical in both walks, so the final points coincide: north 290 + east 145 = east 145 + north 290.

Reference material as printed in the source:

Perpendicular segments commute. A one-way street or a diagonal would change the answer; the stem excludes them.

## Result

**Answer.** Yes. On a grid, north 290 + east 145 = east 145 + north 290.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
