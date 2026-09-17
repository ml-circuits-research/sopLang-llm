# Explanation 37.13 — Effect of an outlier on the median

## Explanation

1. The statement asks for the median rule for four values, which it assumes but does not restate, so the solution uses the mean of the two central values.
2. After adding 20 the ordered list is 4, 5, 6, 20, whose central values are 5 and 6.
3. Their mean is 5.5, which is the new median.

Reference solution as printed in the source (chapter 37, 4 steps):

1. The ordered list is 4,5,6,20.
2. The central values are 5 and 6.
3. Their mean is 5.5.
4. The change is small compared with the change in the arithmetic mean.

## Result

**Answer.** 5.5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
