# Explanation 557 — Duration and centuries: 1586–1620

## Explanation

1. Subtracting the earlier date from the later one gives 1620 - 1586 = 34 years.
2. The stated century rule is c(year) = floor((year - 1) / 100) + 1, so c(1586) = 16 and c(1620) = 17.
3. The rule is applied mechanically: 1586 lies in the 16th century and 1620 in the 17th century, which the first two digits of the year would not both give.

Reference solution as printed in the source (family H2, 3 steps):

1. Elapsed time: 1620−1586=34 years.
2. Century(1586)=floor((1586−1)/100)+1=16.
3. Century(1620)=17.

## Result

**Answer.** 34 years; 1586 is in the 16th century and 1620 in the 17th century.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
