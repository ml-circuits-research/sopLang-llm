# Explanation 8.6.7 — Mean versus median

## Explanation

1. The mean includes every observation, so the total is 30 + 45 + 25 + 45 + 45 + 50 + 40 + 45 + 160 = 485 and the mean is 485/9 = 53.89.
2. Ordering the nine observations puts the fifth, middle value at 45, and that position is the median: four of the observations are listed before it and four after it, so the last value 160 cannot move it.
3. The first eight observations average 40.62, so including the extreme value raises the mean by 13.27; the mean keeps the total honest while the median describes a typical observation.
4. Both statistics are reported because they answer different questions: the extreme value is genuine and belongs in the total, so the mean is the right figure for an average amount per observation, and the median is the more robust description of what is typical.
5. Use the mean for total amount per observation and the median for a more robust 'typical' value.

Reference solution as printed in the source (template 16, 4 steps):

1. The total is 485, so mean = 485/9 = 53.89.
2. After ordering the 9 observations, the middle value is 45, so that is the median.
3. Without the extreme last value, the mean of the first 8 observations is 40.62. Including 160 moves the mean by 13.26 units.
4. A genuine extreme value belongs in totals, but it need not define what is typical; the two statistics answer different questions.

**Source answer.** Mean = 53.89; median = 45. Use the mean for total amount per observation and the median for a more robust 'typical' value. — the source prints the answer in a prose sentence; the shipped answer keeps only the value-bearing tokens, and the removed prose moves into the explanation. The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** Mean = 53.89; median = 45.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
