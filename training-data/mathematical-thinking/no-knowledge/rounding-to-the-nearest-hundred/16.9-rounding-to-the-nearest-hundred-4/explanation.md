# Explanation 16.9 — Rounding to the Nearest Hundred 4

## Explanation

1. The statement gives the rule: measure the distance to each neighbouring hundred and keep the closer one; a value exactly halfway is assigned to the upper hundred.
2. 4899 is 99 above 4800 and 1 below 4900.
3. The smaller distance is 1, so the nearest hundred is 4900.

Reference solution as printed in the source (chapter 16, 3 steps):

1. Distance to 4800: 4899-4800=99.
2. Distance to 4900: 4900-4899=1.
3. Since 1<99, choose 4900.

## Result

**Answer.** 4900

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
