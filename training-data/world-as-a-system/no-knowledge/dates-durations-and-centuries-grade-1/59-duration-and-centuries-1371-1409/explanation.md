# Explanation 59 — Duration and centuries: 1371–1409

## Explanation

1. Subtracting the earlier date from the later one gives 1409 - 1371 = 38 years.
2. The stated century rule is c(year) = floor((year - 1) / 100) + 1, so c(1371) = 14 and c(1409) = 15.
3. The rule is applied mechanically: 1371 lies in the 14th century and 1409 in the 15th century, which the first two digits of the year would not both give.

Reference solution as printed in the source (family H2, 3 steps):

1. Elapsed time: 1409−1371=38 years.
2. Century(1371)=floor((1371−1)/100)+1=14.
3. Century(1409)=15.

## Result

**Answer.** 38 years; 1371 is in the 14th century and 1409 in the 15th century.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
