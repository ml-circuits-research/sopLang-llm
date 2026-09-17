# Explanation 6.19 — H-T-O Code 4

## Explanation

1. The code fixes the worth of each letter: one hundred is 100 and one ten is 10, and the ones are already counted.
2. The hundreds contribute 100×4 = 400, the tens contribute 10×0 = 0, and the ones contribute 8.
3. Adding the three parts gives 400 + 0 + 8 = 408, which is the number the code represents.

Reference solution as printed in the source (chapter 6, 3 steps):

1. 4 hundreds = 400.
2. 0 tens = 0.
3. Add the ones: 400+0+8=408.

## Result

**Answer.** 408

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
