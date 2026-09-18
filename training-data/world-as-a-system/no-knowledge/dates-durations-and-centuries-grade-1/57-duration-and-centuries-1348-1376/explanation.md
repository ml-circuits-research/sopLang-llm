# Explanation 57 — Duration and centuries: 1348–1376

## Explanation

1. Subtracting the earlier date from the later one gives 1376 - 1348 = 28 years.
2. The stated century rule is c(year) = floor((year - 1) / 100) + 1, so c(1348) = 14 and c(1376) = 14.
3. The rule is applied mechanically: 1348 lies in the 14th century and 1376 in the 14th century, which the first two digits of the year would not both give.

Reference solution as printed in the source (family H2, 3 steps):

1. Elapsed time: 1376−1348=28 years.
2. Century(1348)=floor((1348−1)/100)+1=14.
3. Century(1376)=14.

## Result

**Answer.** 28 years; 1348 is in the 14th century and 1376 in the 14th century.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
