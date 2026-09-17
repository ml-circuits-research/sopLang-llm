# Explanation 23.14 — A message with extra information

## Explanation

1. Only the starting number 8 and the number given away 3 enter the calculation, which is a subtraction.
2. The colour of the bag and the weather do not change the number of marbles, so they are ignored as extra information.

Reference solution as printed in the source (chapter 23, 4 steps):

1. The initial quantity, 8, matters for the number of marbles.
2. The number he gives away, 3, also matters.
3. The color of the bag does not change the number of marbles.
4. The weather also does not change the transfer; the calculation is 8−3=5.

## Result

**Answer.** 5 marbles; only 8 and 3 are relevant.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
