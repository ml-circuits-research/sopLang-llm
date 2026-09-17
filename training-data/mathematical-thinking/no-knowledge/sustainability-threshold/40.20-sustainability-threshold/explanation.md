# Explanation 40.20 — Sustainability threshold

## Explanation

1. The stock changes by the regeneration minus the use, that is 5 - 5 = 0 units per day.
2. A net change of zero means the stock returns to the same level each day.
3. So from one day to the next the stock remains constant, which is the exact sustainability threshold.

Reference solution as printed in the source (chapter 40, 4 steps):

1. Regeneration adds 5.
2. Consumption removes 5.
3. The net change is 0.
4. The stock remains constant in the model.

## Result

**Answer.** It remains constant.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
