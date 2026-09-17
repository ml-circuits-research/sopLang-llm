# Explanation 16.3 — Four-Digit Number from Place Values 3

## Explanation

1. The statement fixes the place values explicitly: one thousand is 1000, one hundred is 100, and one ten is 10.
2. Writing the counts into those places gives 7 thousands, 2 hundreds, 9 tens, and 1 ones.
3. The decomposition 1000×7+100×2+10×9+1 collapses to the single number 7291.

Reference solution as printed in the source (chapter 16, 4 steps):

1. The thousands contribute 7000.
2. The hundreds contribute 200.
3. The tens contribute 90.
4. Adding the ones as well: 7000+200+90+1=7291.

## Result

**Answer.** 7291

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
