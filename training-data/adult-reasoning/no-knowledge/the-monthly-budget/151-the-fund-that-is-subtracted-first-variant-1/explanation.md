# Explanation 151 — The fund that is subtracted first — variant 1

## Explanation

1. The sheet takes the emergency fund first, so 10% of the net income 3000 is 300 before any fixed line is paid.
2. The fixed lines of rent, food, and transport take 2100 in total, and the income minus the fund and those lines leaves 600 for variables.
3. The coat costs 700 and the fund is not touched, so the test is the remainder alone against that price.
4. The remainder is below the coat price, so Farid cannot buy it without touching the fund.

Reference material as printed in the source:

The order is written: fund before variables. 700 is compared with the remainder, not with gross income. Double counting is forbidden by the last sentence.

## Result

**Answer.** Fund 300. Remainder 600. The coat does not fit.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
