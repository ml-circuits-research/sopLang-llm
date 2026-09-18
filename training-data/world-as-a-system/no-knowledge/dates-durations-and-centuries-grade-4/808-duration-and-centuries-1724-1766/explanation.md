# Explanation 808 — Duration and centuries: 1724–1766

## Explanation

1. Subtracting the earlier date from the later one gives 1766 - 1724 = 42 years.
2. The stated century rule is c(year) = floor((year - 1) / 100) + 1, so c(1724) = 18 and c(1766) = 18.
3. The rule is applied mechanically: 1724 lies in the 18th century and 1766 in the 18th century, which the first two digits of the year would not both give.

Reference solution as printed in the source (family H2, 3 steps):

1. Elapsed time: 1766−1724=42 years.
2. Century(1724)=floor((1724−1)/100)+1=18.
3. Century(1766)=18.

## Result

**Answer.** 42 years; 1724 is in the 18th century and 1766 in the 18th century.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
