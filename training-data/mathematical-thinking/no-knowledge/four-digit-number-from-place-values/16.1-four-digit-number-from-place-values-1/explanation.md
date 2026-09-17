# Explanation 16.1 — Four-Digit Number from Place Values 1

## Explanation

1. The statement fixes the place values explicitly: one thousand is 1000, one hundred is 100, and one ten is 10.
2. Writing the counts into those places gives 4 thousands, 3 hundreds, 2 tens, and 7 ones.
3. The decomposition 1000×4+100×3+10×2+7 collapses to the single number 4327.

Reference solution as printed in the source (chapter 16, 4 steps):

1. The thousands contribute 4000.
2. The hundreds contribute 300.
3. The tens contribute 20.
4. Adding the ones as well: 4000+300+20+7=4327.

## Result

**Answer.** 4327

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
