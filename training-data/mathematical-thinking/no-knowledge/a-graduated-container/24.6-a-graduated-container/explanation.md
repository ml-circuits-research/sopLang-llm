# Explanation 24.6 — A graduated container

## Explanation

1. The level lies exactly halfway between the 200 ml and 300 ml marks, and the problem states that halfway between equally spaced values is their average.
2. The gap is 100 ml and half of it is 50 ml, so the level reads 250 ml.

Reference solution as printed in the source (chapter 24, 4 steps):

1. The difference between 200 and 300 is 100 ml.
2. Half of 100 is 50 ml.
3. Starting from 200, add 50.
4. The level is 250 ml.

## Result

**Answer.** 250 ml.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
