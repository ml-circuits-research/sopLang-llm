# Explanation 4.9 — Alternating Rule 4

## Explanation

1. The rule is a repeating pair: first add 6, then subtract 2, and the order must be preserved.
2. Applying the pair twice to the starting number 8 produces the next four terms.
3. The terms alternate up and down: each addition is followed by a subtraction, so the sequence never drifts by the pair's net change at every step.
4. The four numbers written after 8 are 14, 12, 18, 16.

Reference solution as printed in the source (chapter 4, 4 steps):

1. First step: 8+6=14.
2. Second step: 14-2=12.
3. The third step repeats the first operation: 12+6=18.
4. The fourth step repeats the second operation: 18-2=16.

## Result

**Answer.** 14, 12, 18, 16

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
