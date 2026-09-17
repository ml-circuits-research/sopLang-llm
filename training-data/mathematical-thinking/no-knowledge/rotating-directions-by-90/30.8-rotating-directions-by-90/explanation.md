# Explanation 30.8 — Rotating directions by 90°

## Explanation

1. The problem states the 90° clockwise mapping as north→east, east→south, south→west, west→north.
2. Following that mapping once from south gives west, so the arrow points west.

Reference solution as printed in the source (chapter 30, 4 steps):

1. Read the rule directly for south.
2. One clockwise quarter-turn moves south to west.
3. It is one rotation, not two.
4. The final direction is west.

## Result

**Answer.** West.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
