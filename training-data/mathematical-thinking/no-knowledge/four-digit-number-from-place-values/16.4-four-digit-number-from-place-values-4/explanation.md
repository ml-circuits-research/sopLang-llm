# Explanation 16.4 — Four-Digit Number from Place Values 4

## Explanation

1. The statement fixes the place values explicitly: one thousand is 1000, one hundred is 100, and one ten is 10.
2. Writing the counts into those places gives 8 thousands, 4 hundreds, 1 tens, and 6 ones.
3. The decomposition 1000×8+100×4+10×1+6 collapses to the single number 8416.

Reference solution as printed in the source (chapter 16, 4 steps):

1. The thousands contribute 8000.
2. The hundreds contribute 400.
3. The tens contribute 10.
4. Adding the ones as well: 8000+400+10+6=8416.

## Result

**Answer.** 8416

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
