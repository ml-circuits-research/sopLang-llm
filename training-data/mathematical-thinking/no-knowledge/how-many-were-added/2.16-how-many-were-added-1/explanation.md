# Explanation 2.16 — How Many Were Added? 1

## Explanation

1. The problem states that the only action was adding, so the change is exactly the gap between the initial and the final state.
2. Counting the steps from 6 up to 11 is the same as subtracting: 11 - 6 = 5.
3. Checking: 6 + 5 = 11, so 5 elements were added.

Reference solution as printed in the source (chapter 2, 3 steps):

1. Start at 6 and we want to reach 11.
2. The difference is 11-6=5.
3. Check: 6+5=11.

## Result

**Answer.** 5

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
