# Explanation 160 — The fund that is subtracted first — variant 10

## Explanation

1. The sheet takes the emergency fund first, so 10% of the net income 4800 is 480 before any fixed line is paid.
2. The fixed lines of rent, food, and transport take 2460 in total, and the income minus the fund and those lines leaves 1860 for variables.
3. The coat costs 700 and the fund is not touched, so the test is the remainder alone against that price.
4. The remainder covers the coat, so Ben can buy it without spending any unit twice.

Reference material as printed in the source:

The order is written: fund before variables. 700 is compared with the remainder, not with gross income. Double counting is forbidden by the last sentence.

## Result

**Answer.** Fund 480. Remainder 1860. The coat fits.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
