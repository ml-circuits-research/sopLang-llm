# Explanation 39.9 — Proof by preserving a remainder

## Explanation

1. Adding a multiple of the modulus never changes the remainder, and the text states this invariant explicitly.
2. The start and the target leave different remainders, so the invariant is broken and the target can never be reached.

Reference solution as printed in the source (chapter 39, 4 steps):

1. The starting value has remainder 1 when divided by 3.
2. Every move preserves remainder 1.
3. 8=3×2+2 has remainder 2.
4. The target has a different remainder, so it is unreachable.

## Result

**Answer.** No.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
