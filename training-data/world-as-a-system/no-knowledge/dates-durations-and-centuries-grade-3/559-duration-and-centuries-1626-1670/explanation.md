# Explanation 559 — Duration and centuries: 1626–1670

## Explanation

1. Subtracting the earlier date from the later one gives 1670 - 1626 = 44 years.
2. The stated century rule is c(year) = floor((year - 1) / 100) + 1, so c(1626) = 17 and c(1670) = 17.
3. The rule is applied mechanically: 1626 lies in the 17th century and 1670 in the 17th century, which the first two digits of the year would not both give.

Reference solution as printed in the source (family H2, 3 steps):

1. Elapsed time: 1670−1626=44 years.
2. Century(1626)=floor((1626−1)/100)+1=17.
3. Century(1670)=17.

## Result

**Answer.** 44 years; 1626 is in the 17th century and 1670 in the 17th century.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
