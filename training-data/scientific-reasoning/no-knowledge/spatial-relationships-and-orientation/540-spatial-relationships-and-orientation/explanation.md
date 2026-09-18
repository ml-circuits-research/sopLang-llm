# Explanation 540 — Spatial relationships and orientation

## Explanation

1. Placing "the starting point" at the coordinate (0,0), the route the question describes is followed one relation at a time.
2. After 3 elementary moves the walk reaches "rest zone" at the offset (-1,0).
3. Therefore "rest zone" is west of "the starting point", and the route uses 3 moves.
4. The map also states a relation the route never follows, so it does not shift the asked place.

Reference solution as printed in the source (form 25, 4 steps):

1. We place “the starting point” in the coordinate (0,0).
2. We apply successively the spatial relations, adding the vectors for east/north/west/south.
3. after the three moves we locate “rest zone” at (-1,0).
4. Therefore “rest zone” is west of “the starting point”, while the route described has 3 elementary moves.

## Result

**Answer.** “rest zone” is west of “the starting point”; the given route has 3 steps.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
