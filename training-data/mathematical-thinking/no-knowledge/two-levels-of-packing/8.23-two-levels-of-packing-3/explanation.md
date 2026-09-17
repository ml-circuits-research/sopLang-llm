# Explanation 8.23 — Two Levels of Packing 3

## Explanation

1. Each box holds 5 bags and each bag holds 3 beads, so one box holds 5×3 = 15 beads.
2. There are 4 identical boxes, so the beads are counted once per box.
3. Multiplying the three levels gives 4×5×3 = 60 beads in total.

Reference solution as printed in the source (chapter 8, 3 steps):

1. One box contains 5×3=15 beads.
2. There are 4 boxes: 4×15=60.
3. We can also check by viewing them as 20 bags of 3 each: 20×3=60.

## Result

**Answer.** 60

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
