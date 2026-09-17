# Explanation 38.8 — Limitation of parity: two errors can go undetected

## Explanation

1. Parity only reports whether the number of 1-bits is even or odd.
2. The original 1100 has 2 ones and the changed word 0011 has 2, so both have the same parity.
3. The parity test sees no violation and cannot detect the two errors, so the answer is no.

Reference solution as printed in the source (chapter 38, 4 steps):

1. The original message passes the test with 2 one-bits.
2. The changed message 0011 also has 2.
3. The test checks only parity, not the exact identity of the bits.
4. This double error is not detected by parity.

## Result

**Answer.** No.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
