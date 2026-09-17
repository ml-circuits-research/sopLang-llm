# Explanation 6.18 — H-T-O Code 3

## Explanation

1. The code fixes the worth of each letter: one hundred is 100 and one ten is 10, and the ones are already counted.
2. The hundreds contribute 100×3 = 300, the tens contribute 10×1 = 10, and the ones contribute 7.
3. Adding the three parts gives 300 + 10 + 7 = 317, which is the number the code represents.

Reference solution as printed in the source (chapter 6, 3 steps):

1. 3 hundreds = 300.
2. 1 ten = 10.
3. Add the ones: 300+10+7=317.

## Result

**Answer.** 317

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
