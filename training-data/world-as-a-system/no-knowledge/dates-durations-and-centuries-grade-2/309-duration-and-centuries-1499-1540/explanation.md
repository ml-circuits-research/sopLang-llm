# Explanation 309 — Duration and centuries: 1499–1540

## Explanation

1. Subtracting the earlier date from the later one gives 1540 - 1499 = 41 years.
2. The stated century rule is c(year) = floor((year - 1) / 100) + 1, so c(1499) = 15 and c(1540) = 16.
3. The rule is applied mechanically: 1499 lies in the 15th century and 1540 in the 16th century, which the first two digits of the year would not both give.

Reference solution as printed in the source (family H2, 3 steps):

1. Elapsed time: 1540−1499=41 years.
2. Century(1499)=floor((1499−1)/100)+1=15.
3. Century(1540)=16.

## Result

**Answer.** 41 years; 1499 is in the 15th century and 1540 in the 16th century.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
