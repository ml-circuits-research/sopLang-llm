# Explanation 2.20 — How Many Were Added? 5

## Explanation

1. The problem states that the only action was adding, so the change is exactly the gap between the initial and the final state.
2. Counting the steps from 14 up to 23 is the same as subtracting: 23 - 14 = 9.
3. Checking: 14 + 9 = 23, so 9 elements were added.

Reference solution as printed in the source (chapter 2, 3 steps):

1. Start at 14 and we want to reach 23.
2. The difference is 23-14=9.
3. Check: 14+9=23.

## Result

**Answer.** 9

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
