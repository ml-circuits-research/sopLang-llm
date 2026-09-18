# Explanation 570 — Spatial relationships and orientation

## Explanation

1. Placing "the air chamber" at the coordinate (0,0), the route the question describes is followed one relation at a time.
2. After 3 elementary moves the walk reaches "the side tube" at the offset (1,0).
3. Therefore "the side tube" is east of "the air chamber", and the route uses 3 moves.
4. The map also states a relation the route never follows, so it does not shift the asked place.

Reference solution as printed in the source (form 25, 4 steps):

1. We place “the air chamber” in the coordinate (0,0).
2. We apply successively the spatial relations, adding the vectors for east/north/west/south.
3. after the three moves we locate “the side tube” at (1,0).
4. Therefore “the side tube” is east of “the air chamber”, while the route described has 3 elementary moves.

## Result

**Answer.** “the side tube” is east of “the air chamber”; the given route has 3 steps.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
