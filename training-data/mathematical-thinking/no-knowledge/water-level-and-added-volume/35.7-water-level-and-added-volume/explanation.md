# Explanation 35.7 — Water level and added volume

## Explanation

1. The container reads 300 ml before the liquid is poured in.
2. After pouring it reads 500 ml, so the added liquid is exactly the increase of the reading.
3. The added volume is 500 - 300 = 200 ml.

Reference solution as printed in the source (chapter 35, 4 steps):

1. The initial reading is 300.
2. The final reading is 500.
3. The difference is 200.
4. The model assumes no losses.

## Result

**Answer.** 200 ml.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
