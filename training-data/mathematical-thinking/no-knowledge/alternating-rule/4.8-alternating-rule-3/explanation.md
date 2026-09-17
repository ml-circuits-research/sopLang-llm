# Explanation 4.8 — Alternating Rule 3

## Explanation

1. The rule is a repeating pair: first add 5, then subtract 1, and the order must be preserved.
2. Applying the pair twice to the starting number 7 produces the next four terms.
3. The terms alternate up and down: each addition is followed by a subtraction, so the sequence never drifts by the pair's net change at every step.
4. The four numbers written after 7 are 12, 11, 16, 15.

Reference solution as printed in the source (chapter 4, 4 steps):

1. First step: 7+5=12.
2. Second step: 12-1=11.
3. The third step repeats the first operation: 11+5=16.
4. The fourth step repeats the second operation: 16-1=15.

## Result

**Answer.** 12, 11, 16, 15

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
