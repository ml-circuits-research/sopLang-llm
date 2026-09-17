# Explanation 39.8 — Impossibility by parity

## Explanation

1. Every step changes the value by a multiple of the step size, so all reached values keep the same remainder modulo that step.
2. The target does not differ from the start by a multiple of the step, so parity rules it out and the answer is no.

Reference solution as printed in the source (chapter 39, 4 steps):

1. The starting value 0 is even.
2. Adding or subtracting 2 turns an even number into another even number.
3. Repeating this, every reachable state is even.
4. 7 is odd, so it cannot be reached.

## Result

**Answer.** No.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
