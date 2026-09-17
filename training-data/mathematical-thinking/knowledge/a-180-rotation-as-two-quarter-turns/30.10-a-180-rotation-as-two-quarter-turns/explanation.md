# Explanation 30.10 — A 180° rotation as two quarter-turns

## Explanation

1. The arrow starts pointing north and is rotated 2 times by 90° clockwise, which is two quarter-turns.
2. A clockwise quarter-turn sends north to east, east to south, south to west, and west to north, the cycle the circuit reads from its fact wire.
3. Applying that cycle twice from north gives south.

Reference solution as printed in the source (chapter 30, 4 steps):

1. First rotation: north→east.
2. Second: east→south.
3. Two 90° rotations give 180°.
4. The direction opposite north is south.

## Result

**Answer.** South.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
