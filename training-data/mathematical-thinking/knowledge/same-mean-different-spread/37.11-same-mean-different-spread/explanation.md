# Explanation 37.11 — Same mean, different spread

## Explanation

1. The two statistics are not defined here, so the solution uses the mean as sum divided by count and the range as maximum minus minimum.
2. Both sets have mean 5 = 5, so the means agree.
3. The ranges are 0 and 8, so the spreads differ.

Reference solution as printed in the source (chapter 37, 4 steps):

1. A has sum 15 and mean 5.
2. B also has sum 15 and mean 5.
3. In A, maximum=minimum=5, so range 0.
4. In B, 9-1=8. Equal means do not imply equal spread.

## Result

**Answer.** The mean is the same; the range is not.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
