# Explanation 60 — Duration and centuries: 1399–1442

## Explanation

1. Subtracting the earlier date from the later one gives 1442 - 1399 = 43 years.
2. The stated century rule is c(year) = floor((year - 1) / 100) + 1, so c(1399) = 14 and c(1442) = 15.
3. The rule is applied mechanically: 1399 lies in the 14th century and 1442 in the 15th century, which the first two digits of the year would not both give.

Reference solution as printed in the source (family H2, 3 steps):

1. Elapsed time: 1442−1399=43 years.
2. Century(1399)=floor((1399−1)/100)+1=14.
3. Century(1442)=15.

## Result

**Answer.** 43 years; 1399 is in the 14th century and 1442 in the 15th century.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
