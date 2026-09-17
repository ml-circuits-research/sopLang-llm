# Explanation 39.5 — Proof by two cases: even or odd

## Explanation

1. The given rule says every integer is even or odd and never both, so parity gives a complete two-case split.
2. Advancing by an odd number of steps swaps the case, so the two compared integers can never share a parity.

Reference solution as printed in the source (chapter 39, 4 steps):

1. If n is even, the given alternation rule says that n+1 is odd.
2. If n is odd, n+1 is even.
3. The two cases cover all integers.
4. In both cases the parities are different.

## Result

**Answer.** Yes, two consecutive integers have different parity.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
