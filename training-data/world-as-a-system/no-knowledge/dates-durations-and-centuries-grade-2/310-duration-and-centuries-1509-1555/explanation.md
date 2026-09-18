# Explanation 310 — Duration and centuries: 1509–1555

## Explanation

1. Subtracting the earlier date from the later one gives 1555 - 1509 = 46 years.
2. The stated century rule is c(year) = floor((year - 1) / 100) + 1, so c(1509) = 16 and c(1555) = 16.
3. The rule is applied mechanically: 1509 lies in the 16th century and 1555 in the 16th century, which the first two digits of the year would not both give.

Reference solution as printed in the source (family H2, 3 steps):

1. Elapsed time: 1555−1509=46 years.
2. Century(1509)=floor((1509−1)/100)+1=16.
3. Century(1555)=16.

## Result

**Answer.** 46 years; 1509 is in the 16th century and 1555 in the 16th century.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
