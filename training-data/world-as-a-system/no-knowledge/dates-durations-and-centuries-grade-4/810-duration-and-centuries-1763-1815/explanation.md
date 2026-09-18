# Explanation 810 — Duration and centuries: 1763–1815

## Explanation

1. Subtracting the earlier date from the later one gives 1815 - 1763 = 52 years.
2. The stated century rule is c(year) = floor((year - 1) / 100) + 1, so c(1763) = 18 and c(1815) = 19.
3. The rule is applied mechanically: 1763 lies in the 18th century and 1815 in the 19th century, which the first two digits of the year would not both give.

Reference solution as printed in the source (family H2, 3 steps):

1. Elapsed time: 1815−1763=52 years.
2. Century(1763)=floor((1763−1)/100)+1=18.
3. Century(1815)=19.

## Result

**Answer.** 52 years; 1763 is in the 18th century and 1815 in the 19th century.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
