# Explanation 36.4 — Two segments with different speeds

## Explanation

1. Each stage is a constant-speed stretch, so its distance is its speed times its duration.
2. The stages give 2 × 40 and 1 × 60 km.
3. Adding the segment distances gives the total of 140 km.

Reference solution as printed in the source (chapter 36, 4 steps):

1. First segment: 2×40=80 km.
2. Second: 1×60=60 km.
3. Consecutive distances add.
4. 80+60=140 km.

## Result

**Answer.** 140 km.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
