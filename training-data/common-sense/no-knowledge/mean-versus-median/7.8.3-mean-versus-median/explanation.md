# Explanation 7.8.3 — Mean versus median

## Explanation

1. The mean includes every observation, so the total is 20 + 50 + 35 + 60 + 40 + 55 + 35 + 35 + 160 = 490 and the mean is 490/9 = 54.44.
2. Ordering the nine observations puts the fifth, middle value at 40, and that position is the median: four of the observations are listed before it and four after it, so the last value 160 cannot move it.
3. The first eight observations average 41.25, so including the extreme value raises the mean by 13.19; the mean keeps the total honest while the median describes a typical observation.
4. Both statistics are reported because they answer different questions: the extreme value is genuine and belongs in the total, so the mean is the right figure for an average amount per observation, and the median is the more robust description of what is typical.

Reference solution as printed in the source (template 16, 4 steps):

1. The total is 490, so mean = 490/9 = 54.44.
2. After ordering the 9 observations, the middle value is 40, so that is the median.
3. Without the extreme last value, the mean of the first 8 observations is 41.25. Including 160 moves the mean by 13.19 units.
4. A genuine extreme value belongs in totals, but it need not define what is typical; the two statistics answer different questions.

## Result

**Answer.** Mean = 54.44; median = 40. Use the mean for total amount per observation and the median for a more robust 'typical' value.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
