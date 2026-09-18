# Explanation 807 — Duration and centuries: 1713–1750

## Explanation

1. Subtracting the earlier date from the later one gives 1750 - 1713 = 37 years.
2. The stated century rule is c(year) = floor((year - 1) / 100) + 1, so c(1713) = 18 and c(1750) = 18.
3. The rule is applied mechanically: 1713 lies in the 18th century and 1750 in the 18th century, which the first two digits of the year would not both give.

Reference solution as printed in the source (family H2, 3 steps):

1. Elapsed time: 1750−1713=37 years.
2. Century(1713)=floor((1713−1)/100)+1=18.
3. Century(1750)=18.

## Result

**Answer.** 37 years; 1713 is in the 18th century and 1750 in the 18th century.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
