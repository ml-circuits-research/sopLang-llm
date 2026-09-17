# Explanation 28.19 — Distributing two distinct objects into two boxes

## Explanation

1. Each of the 2 distinct balls independently chooses one of the 2 boxes.
2. The choices are independent, so the distributions are counted by a power.
3. 2^2 = 4 distributions, including the ones that empty a box.

Reference solution as printed in the source (chapter 28, 4 steps):

1. The red ball has 2 choices.
2. Independently, the blue ball has 2 choices.
3. The results are AA, AB, BA, BB according to the boxes containing the two balls.
4. There are 4 distributions.

## Result

**Answer.** 4 distributions.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
