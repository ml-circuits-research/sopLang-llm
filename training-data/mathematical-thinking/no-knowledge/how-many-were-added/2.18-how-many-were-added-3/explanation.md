# Explanation 2.18 — How Many Were Added? 3

## Explanation

1. The problem states that the only action was adding, so the change is exactly the gap between the initial and the final state.
2. Counting the steps from 10 up to 17 is the same as subtracting: 17 - 10 = 7.
3. Checking: 10 + 7 = 17, so 7 elements were added.

Reference solution as printed in the source (chapter 2, 3 steps):

1. Start at 10 and we want to reach 17.
2. The difference is 17-10=7.
3. Check: 10+7=17.

## Result

**Answer.** 7

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
