# Explanation 2.17 — How Many Were Added? 2

## Explanation

1. The problem states that the only action was adding, so the change is exactly the gap between the initial and the final state.
2. Counting the steps from 8 up to 14 is the same as subtracting: 14 - 8 = 6.
3. Checking: 8 + 6 = 14, so 6 elements were added.

Reference solution as printed in the source (chapter 2, 3 steps):

1. Start at 8 and we want to reach 14.
2. The difference is 14-8=6.
3. Check: 8+6=14.

## Result

**Answer.** 6

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
