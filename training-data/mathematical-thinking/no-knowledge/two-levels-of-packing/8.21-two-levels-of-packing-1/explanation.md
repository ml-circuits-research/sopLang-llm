# Explanation 8.21 — Two Levels of Packing 1

## Explanation

1. Each box holds 3 bags and each bag holds 4 beads, so one box holds 3×4 = 12 beads.
2. There are 2 identical boxes, so the beads are counted once per box.
3. Multiplying the three levels gives 2×3×4 = 24 beads in total.

Reference solution as printed in the source (chapter 8, 3 steps):

1. One box contains 3×4=12 beads.
2. There are 2 boxes: 2×12=24.
3. We can also check by viewing them as 6 bags of 4 each: 6×4=24.

## Result

**Answer.** 24

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
