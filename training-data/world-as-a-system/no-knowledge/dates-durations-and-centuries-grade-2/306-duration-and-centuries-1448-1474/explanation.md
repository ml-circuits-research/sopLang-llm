# Explanation 306 — Duration and centuries: 1448–1474

## Explanation

1. Subtracting the earlier date from the later one gives 1474 - 1448 = 26 years.
2. The stated century rule is c(year) = floor((year - 1) / 100) + 1, so c(1448) = 15 and c(1474) = 15.
3. The rule is applied mechanically: 1448 lies in the 15th century and 1474 in the 15th century, which the first two digits of the year would not both give.

Reference solution as printed in the source (family H2, 3 steps):

1. Elapsed time: 1474−1448=26 years.
2. Century(1448)=floor((1448−1)/100)+1=15.
3. Century(1474)=15.

## Result

**Answer.** 26 years; 1448 is in the 15th century and 1474 in the 15th century.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
