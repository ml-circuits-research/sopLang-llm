# Explanation 806 — Duration and centuries: 1699–1731

## Explanation

1. Subtracting the earlier date from the later one gives 1731 - 1699 = 32 years.
2. The stated century rule is c(year) = floor((year - 1) / 100) + 1, so c(1699) = 17 and c(1731) = 18.
3. The rule is applied mechanically: 1699 lies in the 17th century and 1731 in the 18th century, which the first two digits of the year would not both give.

Reference solution as printed in the source (family H2, 3 steps):

1. Elapsed time: 1731−1699=32 years.
2. Century(1699)=floor((1699−1)/100)+1=17.
3. Century(1731)=18.

## Result

**Answer.** 32 years; 1699 is in the 17th century and 1731 in the 18th century.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
