# Explanation 8.11 — Complete Packages and a Remainder 1

## Explanation

1. Making as many complete packages as possible means subtracting 4 from 26 until fewer than 4 objects are left.
2. That subtraction succeeds 6 times and leaves 2 objects, since 4×6 = 24.
3. The remainder 2 is smaller than the package size 4, so no further complete package can be formed and 26 = 4×6 + 2.

Reference solution as printed in the source (chapter 8, 3 steps):

1. The largest multiple of 4 that does not exceed 26 is 24=4×6.
2. Therefore we can make 6 packages.
3. The remainder is 26-24=2, which is less than 4.

## Result

**Answer.** 6 packages and remainder 2.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
