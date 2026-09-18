# Explanation 56 — Duration and centuries: 1334–1357

## Explanation

1. Subtracting the earlier date from the later one gives 1357 - 1334 = 23 years.
2. The stated century rule is c(year) = floor((year - 1) / 100) + 1, so c(1334) = 14 and c(1357) = 14.
3. The rule is applied mechanically: 1334 lies in the 14th century and 1357 in the 14th century, which the first two digits of the year would not both give.

Reference solution as printed in the source (family H2, 3 steps):

1. Elapsed time: 1357−1334=23 years.
2. Century(1334)=floor((1334−1)/100)+1=14.
3. Century(1357)=14.

## Result

**Answer.** 23 years; 1334 is in the 14th century and 1357 in the 14th century.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
