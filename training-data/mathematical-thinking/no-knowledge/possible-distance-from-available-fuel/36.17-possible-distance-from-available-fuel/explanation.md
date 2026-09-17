# Explanation 36.17 — Possible distance from available fuel

## Explanation

1. Every 100 km costs 6 L at the constant-rate model.
2. The 24 L available pay for 4 such groups of 100 km.
3. The reachable distance is 400 km.

Reference solution as printed in the source (chapter 36, 4 steps):

1. 24 L contains 4 groups of 6 L.
2. Each group permits 100 km.
3. 4×100=400 km.
4. We assume exactly the given rate.

## Result

**Answer.** 400 km.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
