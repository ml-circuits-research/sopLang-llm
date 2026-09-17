# Explanation 4.10 — Alternating Rule 5

## Explanation

1. The rule is a repeating pair: first add 7, then subtract 1, and the order must be preserved.
2. Applying the pair twice to the starting number 9 produces the next four terms.
3. The terms alternate up and down: each addition is followed by a subtraction, so the sequence never drifts by the pair's net change at every step.
4. The four numbers written after 9 are 16, 15, 22, 21.

Reference solution as printed in the source (chapter 4, 4 steps):

1. First step: 9+7=16.
2. Second step: 16-1=15.
3. The third step repeats the first operation: 15+7=22.
4. The fourth step repeats the second operation: 22-1=21.

## Result

**Answer.** 16, 15, 22, 21

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
