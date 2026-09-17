# Explanation 26.25 — Reconstructing the start of a cycle

## Explanation

1. The cycle written as A, B, C has length 3, so position 8 uses the same symbol as position 2 of the cycle.
2. The text says that position 8 is B, and position 2 of the written cycle is indeed B, so the written order is consistent.
3. Position 1 of the cycle, which is also position 1 of the pattern, is therefore A.

Reference solution as printed in the source (chapter 26, 4 steps):

1. Positions 2,5,8 are all the second positions of successive cycles.
2. The second position of the cycle is stated to be B.
3. In the given cycle A,B,C, the first position is A.
4. Therefore position 1 is A.

## Result

**Answer.** A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
