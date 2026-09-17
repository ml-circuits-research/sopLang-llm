# Explanation 2.19 — How Many Were Added? 4

## Explanation

1. The problem states that the only action was adding, so the change is exactly the gap between the initial and the final state.
2. Counting the steps from 12 up to 20 is the same as subtracting: 20 - 12 = 8.
3. Checking: 12 + 8 = 20, so 8 elements were added.

Reference solution as printed in the source (chapter 2, 3 steps):

1. Start at 12 and we want to reach 20.
2. The difference is 20-12=8.
3. Check: 12+8=20.

## Result

**Answer.** 8

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
