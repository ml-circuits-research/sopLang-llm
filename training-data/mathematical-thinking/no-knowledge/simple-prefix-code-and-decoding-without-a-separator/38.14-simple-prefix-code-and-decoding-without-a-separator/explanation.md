# Explanation 38.14 — Simple prefix code and decoding without a separator

## Explanation

1. Because no codeword is the beginning of another, reading from left to right never leaves a choice: exactly one codeword can start at each position.
2. Matching the codewords against 01011 step by step isolates the symbols in order.
3. The decoded text is ABC.

Reference solution as printed in the source (chapter 38, 4 steps):

1. The first bit 0 corresponds directly to A.
2. 1011 remains; the first two bits 10 correspond to B.
3. 11 remains, which is C.
4. The decoding is ABC.

## Result

**Answer.** ABC.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
