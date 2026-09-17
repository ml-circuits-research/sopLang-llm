# Explanation 37.7 — Median with an even number of values

## Explanation

1. The statement defines the median for an even list as the mean of the two central values, so no outside rule is needed.
2. Sorting gives 1, 3, 7, 9 with central values 3 and 7.
3. Their mean is their sum divided by two, so the median is 5.

Reference solution as printed in the source (chapter 37, 4 steps):

1. The list is already sorted.
2. The two central values are 3 and 7.
3. Their mean is (3+7)/2=5.
4. This is the median by the given definition.

## Result

**Answer.** 5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
