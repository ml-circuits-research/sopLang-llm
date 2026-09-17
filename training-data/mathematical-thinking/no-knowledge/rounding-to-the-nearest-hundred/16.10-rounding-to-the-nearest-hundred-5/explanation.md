# Explanation 16.10 — Rounding to the Nearest Hundred 5

## Explanation

1. The statement gives the rule: measure the distance to each neighbouring hundred and keep the closer one; a value exactly halfway is assigned to the upper hundred.
2. 6249 is 49 above 6200 and 51 below 6300.
3. The smaller distance is 49, so the nearest hundred is 6200.

Reference solution as printed in the source (chapter 16, 3 steps):

1. Distance to 6200: 6249-6200=49.
2. Distance to 6300: 6300-6249=51.
3. Since 49<51, choose 6200.

## Result

**Answer.** 6200

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
