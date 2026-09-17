# Explanation 31.9 — Two different results

## Explanation

1. Tossing an idealized coin twice makes the four listed sequences equally likely, so each sequence is a single outcome.
2. The results differ when the two letters are not the same, which happens in 2 of the 4 sequences.
3. The probability is 1/2.

Reference solution as printed in the source (chapter 31, 4 steps):

1. The sequences with different results are AB and BA.
2. AA and BB have equal results.
3. There are 2 favorable outcomes out of 4.
4. The probability is 1/2.

## Result

**Answer.** 1/2.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
