# Explanation 33.11 — Loop until a threshold is reached

## Explanation

1. The condition x<10 is checked before every repetition, so the loop runs while the value is still below the threshold.
2. The running values are 2 → 5 → 8 → 11, and the update is applied at each step.
3. The first value that is not below the threshold is 11, and the condition is then false, so the loop stops there.

Reference solution as printed in the source (chapter 33, 4 steps):

1. 2<10, so x becomes 5.
2. 5<10 → 8.
3. 8<10 → 11.
4. 11<10 is false, so the loop stops at 11.

## Result

**Answer.** It stops at 11.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
