# Explanation 36.16 — Consumption per 100 km explicitly defined

## Explanation

1. The stated rate is 6 L for every 100 km, so consumption is tied to whole groups of 100 km.
2. The distance of 300 km contains 3 such groups.
3. Each group costs 6 L, giving 18 L in total.

Reference solution as printed in the source (chapter 36, 4 steps):

1. 300 km contains 3 groups of 100 km.
2. Each group consumes 6 L.
3. 3×6=18.
4. The rate is applied proportionally.

## Result

**Answer.** 18 L.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
