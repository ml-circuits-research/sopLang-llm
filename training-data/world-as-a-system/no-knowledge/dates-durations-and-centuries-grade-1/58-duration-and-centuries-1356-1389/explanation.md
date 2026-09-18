# Explanation 58 — Duration and centuries: 1356–1389

## Explanation

1. Subtracting the earlier date from the later one gives 1389 - 1356 = 33 years.
2. The stated century rule is c(year) = floor((year - 1) / 100) + 1, so c(1356) = 14 and c(1389) = 14.
3. The rule is applied mechanically: 1356 lies in the 14th century and 1389 in the 14th century, which the first two digits of the year would not both give.

Reference solution as printed in the source (family H2, 3 steps):

1. Elapsed time: 1389−1356=33 years.
2. Century(1356)=floor((1356−1)/100)+1=14.
3. Century(1389)=14.

## Result

**Answer.** 33 years; 1356 is in the 14th century and 1389 in the 14th century.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
