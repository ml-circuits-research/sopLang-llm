# Explanation 515 — Spatial relationships and orientation

## Explanation

1. Placing "the pile of leaves" at the coordinate (0,0), the route the question describes is followed one relation at a time.
2. After 3 elementary moves the walk reaches "the layer of soil" at the offset (0,-1).
3. Therefore "the layer of soil" is south of "the pile of leaves", and the route uses 3 moves.
4. The map also states a relation the route never follows, so it does not shift the asked place.

Reference solution as printed in the source (form 25, 4 steps):

1. We place “the pile of leaves” in the coordinate (0,0).
2. We apply successively the spatial relations, adding the vectors for east/north/west/south.
3. after the three moves we locate “the layer of soil” at (0,-1).
4. Therefore “the layer of soil” is south of “the pile of leaves”, while the route described has 3 elementary moves.

## Result

**Answer.** “the layer of soil” is south of “the pile of leaves”; the given route has 3 steps.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
