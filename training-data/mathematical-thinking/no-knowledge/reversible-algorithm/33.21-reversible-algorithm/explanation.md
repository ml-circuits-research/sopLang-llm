# Explanation 33.21 — Reversible algorithm

## Explanation

1. Each step of the forward algorithm is undone by the opposite of that step, applied in the reverse order.
2. Starting from the output 20 and dividing before subtracting recovers the intermediate and the input.
3. The recovered input is 6.

Reference solution as printed in the source (chapter 33, 4 steps):

1. The last operation was doubling, so undo it first by dividing by 2.
2. 20/2=10.
3. Before that, 4 was added, so subtract 4.
4. 10-4=6; check: (6+4)×2=20.

## Result

**Answer.** 6.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
