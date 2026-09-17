# Explanation 4.7 — Alternating Rule 2

## Explanation

1. The rule is a repeating pair: first add 4, then subtract 2, and the order must be preserved.
2. Applying the pair twice to the starting number 6 produces the next four terms.
3. The terms alternate up and down: each addition is followed by a subtraction, so the sequence never drifts by the pair's net change at every step.
4. The four numbers written after 6 are 10, 8, 12, 10.

Reference solution as printed in the source (chapter 4, 4 steps):

1. First step: 6+4=10.
2. Second step: 10-2=8.
3. The third step repeats the first operation: 8+4=12.
4. The fourth step repeats the second operation: 12-2=10.

## Result

**Answer.** 10, 8, 12, 10

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
