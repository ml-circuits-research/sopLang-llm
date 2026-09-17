# Explanation 6.17 — H-T-O Code 2

## Explanation

1. The code fixes the worth of each letter: one hundred is 100 and one ten is 10, and the ones are already counted.
2. The hundreds contribute 100×2 = 200, the tens contribute 10×4 = 40, and the ones contribute 3.
3. Adding the three parts gives 200 + 40 + 3 = 243, which is the number the code represents.

Reference solution as printed in the source (chapter 6, 3 steps):

1. 2 hundreds = 200.
2. 4 tens = 40.
3. Add the ones: 200+40+3=243.

## Result

**Answer.** 243

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
