# Explanation 8.22 — Two Levels of Packing 2

## Explanation

1. Each box holds 4 bags and each bag holds 5 beads, so one box holds 4×5 = 20 beads.
2. There are 3 identical boxes, so the beads are counted once per box.
3. Multiplying the three levels gives 3×4×5 = 60 beads in total.

Reference solution as printed in the source (chapter 8, 3 steps):

1. One box contains 4×5=20 beads.
2. There are 3 boxes: 3×20=60.
3. We can also check by viewing them as 12 bags of 5 each: 12×5=60.

## Result

**Answer.** 60

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
