# Explanation 37.12 — Effect of an outlier on the mean

## Explanation

1. The mean is not defined in this statement, so the solution computes the sum divided by the count.
2. The values 4, 5, 6 add to 15; adding the outlier 20 gives 35 over 4 values.
3. The new mean is 8.75, larger than the old mean 5, so the mean increases.

Reference solution as printed in the source (chapter 37, 4 steps):

1. The old sum is 15.
2. With 20, it becomes 35.
3. Divide by 4: 8.75.
4. The very large value raises the mean from 5 to 8.75.

## Result

**Answer.** 8.75; the mean increases.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
