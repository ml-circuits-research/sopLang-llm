# Explanation 4.6 — Alternating Rule 1

## Explanation

1. The rule is a repeating pair: first add 3, then subtract 1, and the order must be preserved.
2. Applying the pair twice to the starting number 5 produces the next four terms.
3. The terms alternate up and down: each addition is followed by a subtraction, so the sequence never drifts by the pair's net change at every step.
4. The four numbers written after 5 are 8, 7, 10, 9.

Reference solution as printed in the source (chapter 4, 4 steps):

1. First step: 5+3=8.
2. Second step: 8-1=7.
3. The third step repeats the first operation: 7+3=10.
4. The fourth step repeats the second operation: 10-1=9.

## Result

**Answer.** 8, 7, 10, 9

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
