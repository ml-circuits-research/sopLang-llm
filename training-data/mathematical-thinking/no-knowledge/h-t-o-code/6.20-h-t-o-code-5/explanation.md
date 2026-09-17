# Explanation 6.20 — H-T-O Code 5

## Explanation

1. The code fixes the worth of each letter: one hundred is 100 and one ten is 10, and the ones are already counted.
2. The hundreds contribute 100×5 = 500, the tens contribute 10×3 = 30, and the ones contribute 2.
3. Adding the three parts gives 500 + 30 + 2 = 532, which is the number the code represents.

Reference solution as printed in the source (chapter 6, 3 steps):

1. 5 hundreds = 500.
2. 3 tens = 30.
3. Add the ones: 500+30+2=532.

## Result

**Answer.** 532

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
