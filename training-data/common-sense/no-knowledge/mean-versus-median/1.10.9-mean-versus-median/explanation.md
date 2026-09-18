# Explanation 1.10.9 — Mean versus median

## Explanation

1. The mean includes every observation, so the total is 25 + 40 + 45 + 55 + 50 + 35 + 55 + 50 + 120 = 475 and the mean is 475/9 = 52.78.
2. Ordering the nine observations puts the fifth, middle value at 50, and that position is the median: four of the observations are listed before it and four after it, so the last value 120 cannot move it.
3. The first eight observations average 44.38, so including the extreme value raises the mean by 8.4; the mean keeps the total honest while the median describes a typical observation.
4. Both statistics are reported because they answer different questions: the extreme value is genuine and belongs in the total, so the mean is the right figure for an average amount per observation, and the median is the more robust description of what is typical.

Reference solution as printed in the source (template 16, 4 steps):

1. The total is 475, so mean = 475/9 = 52.78.
2. After ordering the 9 observations, the middle value is 50, so that is the median.
3. Without the extreme last value, the mean of the first 8 observations is 44.38. Including 120 moves the mean by 8.4 units.
4. A genuine extreme value belongs in totals, but it need not define what is typical; the two statistics answer different questions.

## Result

**Answer.** Mean = 52.78; median = 50. Use the mean for total amount per observation and the median for a more robust 'typical' value.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
