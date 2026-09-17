# Explanation 35.24 — Filling time at constant flow

## Explanation

1. The container needs 30 L and the tap supplies 5 L each minute.
2. At a constant flow the time is the volume divided by the rate: 30 / 5.
3. Filling from empty therefore takes 6 minutes.

Reference solution as printed in the source (chapter 35, 4 steps):

1. Each minute adds 5 L.
2. Find how many groups of 5 fit into 30.
3. 30÷5=6.
4. After 6 minutes, we have exactly 30 L.

## Result

**Answer.** 6 minutes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
