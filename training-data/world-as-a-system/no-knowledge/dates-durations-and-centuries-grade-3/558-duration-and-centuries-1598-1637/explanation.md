# Explanation 558 — Duration and centuries: 1598–1637

## Explanation

1. Subtracting the earlier date from the later one gives 1637 - 1598 = 39 years.
2. The stated century rule is c(year) = floor((year - 1) / 100) + 1, so c(1598) = 16 and c(1637) = 17.
3. The rule is applied mechanically: 1598 lies in the 16th century and 1637 in the 17th century, which the first two digits of the year would not both give.

Reference solution as printed in the source (family H2, 3 steps):

1. Elapsed time: 1637−1598=39 years.
2. Century(1598)=floor((1598−1)/100)+1=16.
3. Century(1637)=17.

## Result

**Answer.** 39 years; 1598 is in the 16th century and 1637 in the 17th century.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
