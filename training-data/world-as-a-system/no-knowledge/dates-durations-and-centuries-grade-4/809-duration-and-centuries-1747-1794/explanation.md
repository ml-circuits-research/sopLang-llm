# Explanation 809 — Duration and centuries: 1747–1794

## Explanation

1. Subtracting the earlier date from the later one gives 1794 - 1747 = 47 years.
2. The stated century rule is c(year) = floor((year - 1) / 100) + 1, so c(1747) = 18 and c(1794) = 18.
3. The rule is applied mechanically: 1747 lies in the 18th century and 1794 in the 18th century, which the first two digits of the year would not both give.

Reference solution as printed in the source (family H2, 3 steps):

1. Elapsed time: 1794−1747=47 years.
2. Century(1747)=floor((1747−1)/100)+1=18.
3. Century(1794)=18.

## Result

**Answer.** 47 years; 1747 is in the 18th century and 1794 in the 18th century.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
