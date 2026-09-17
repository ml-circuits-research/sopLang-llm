# Explanation 38.9 — Checksum modulo 10

## Explanation

1. The check digit is the last digit of the sum of the data, that is, the sum taken modulo 10.
2. Adding 5 + 8 + 9 gives 22, whose last digit is 2.

Reference solution as printed in the source (chapter 38, 4 steps):

1. Add 5+8+9=22.
2. The rule keeps only the last digit.
3. The last digit of 22 is 2.
4. This is the check digit.

## Result

**Answer.** 2.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
