# Explanation 31.10 — At least one success

## Explanation

1. "At least one success" is easier to count through its complement: the sequences that contain no A at all.
2. Only one of the 4 equally likely sequences has no A, so 3 sequences contain at least one.
3. The favorable count is 3 out of 4, giving 3/4.

Reference solution as printed in the source (chapter 31, 4 steps):

1. “At least one A” includes AA,AB,BA.
2. The only case without A is BB.
3. Of 4 outcomes, 3 are favorable.
4. The probability is 3/4.

## Result

**Answer.** 3/4.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
