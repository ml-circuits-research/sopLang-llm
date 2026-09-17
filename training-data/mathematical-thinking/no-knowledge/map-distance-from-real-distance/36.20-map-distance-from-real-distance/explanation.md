# Explanation 36.20 — Map distance from real distance

## Explanation

1. The same scale gives 5 km for each 1 cm of map.
2. The real distance of 40 km is 8 groups of 5 km, and each group occupies 1 cm, so the map distance is 8 cm.

Reference solution as printed in the source (chapter 36, 4 steps):

1. Find how many groups of 5 km are in 40.
2. 40÷5=8.
3. Each group becomes 1 cm.
4. The map distance is 8 cm.

## Result

**Answer.** 8 cm.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
