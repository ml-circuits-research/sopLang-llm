# Explanation 6.16 — H-T-O Code 1

## Explanation

1. The code fixes the worth of each letter: one hundred is 100 and one ten is 10, and the ones are already counted.
2. The hundreds contribute 100×1 = 100, the tens contribute 10×2 = 20, and the ones contribute 5.
3. Adding the three parts gives 100 + 20 + 5 = 125, which is the number the code represents.

Reference solution as printed in the source (chapter 6, 3 steps):

1. 1 hundred = 100.
2. 2 tens = 20.
3. Add the ones: 100+20+5=125.

## Result

**Answer.** 125

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
