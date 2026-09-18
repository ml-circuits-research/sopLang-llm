# Explanation 556 — Duration and centuries: 1560–1589

## Explanation

1. Subtracting the earlier date from the later one gives 1589 - 1560 = 29 years.
2. The stated century rule is c(year) = floor((year - 1) / 100) + 1, so c(1560) = 16 and c(1589) = 16.
3. The rule is applied mechanically: 1560 lies in the 16th century and 1589 in the 16th century, which the first two digits of the year would not both give.

Reference solution as printed in the source (family H2, 3 steps):

1. Elapsed time: 1589−1560=29 years.
2. Century(1560)=floor((1560−1)/100)+1=16.
3. Century(1589)=16.

## Result

**Answer.** 29 years; 1560 is in the 16th century and 1589 in the 16th century.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
