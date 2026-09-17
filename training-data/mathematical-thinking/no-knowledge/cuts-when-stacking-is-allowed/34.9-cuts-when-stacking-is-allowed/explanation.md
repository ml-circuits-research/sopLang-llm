# Explanation 34.9 — Cuts when stacking is allowed

## Explanation

1. Cutting one sheet into 2 pieces needs 1 cuts if it is cut alone.
2. Because the 2 sheets are perfectly stacked, one cutting motion passes through all of them at once.
3. So the 1 cut is done in a single motion, and no motion can be saved further.

Reference solution as printed in the source (chapter 34, 4 steps):

1. Without stacking, two motions would be needed.
2. The problem allows perfect stacking.
3. One cut passes through both sheets at the same time.
4. Therefore one motion is enough.

## Result

**Answer.** 1 motion.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
