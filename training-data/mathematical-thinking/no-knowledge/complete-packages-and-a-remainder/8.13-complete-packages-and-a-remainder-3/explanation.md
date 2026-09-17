# Explanation 8.13 — Complete Packages and a Remainder 3

## Explanation

1. Making as many complete packages as possible means subtracting 6 from 38 until fewer than 6 objects are left.
2. That subtraction succeeds 6 times and leaves 2 objects, since 6×6 = 36.
3. The remainder 2 is smaller than the package size 6, so no further complete package can be formed and 38 = 6×6 + 2.

Reference solution as printed in the source (chapter 8, 3 steps):

1. The largest multiple of 6 that does not exceed 38 is 36=6×6.
2. Therefore we can make 6 packages.
3. The remainder is 38-36=2, which is less than 6.

## Result

**Answer.** 6 packages and remainder 2.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
