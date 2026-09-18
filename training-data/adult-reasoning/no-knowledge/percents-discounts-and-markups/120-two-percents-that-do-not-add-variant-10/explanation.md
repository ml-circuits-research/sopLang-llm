# Explanation 120 — Two percents that do not add — variant 10

## Explanation

1. The coat is ticketed at 380.00 in Mill Hamlet, and Ben holds the store card, so the till 2 discount applies after the 19% reduction.
2. The first discount leaves 307.80, and 9% of that reduced price brings the payment to 280.10.
3. Adding the percents treats them as 28% of the original ticket, which gives 273.60 and is not what the notice says.
4. The two methods differ by 6.50 because the second percent is taken on the reduced price, not on the original ticket.

Reference material as printed in the source:

Chain: 380 → minus 19% = 307.80 → minus 9% = 280.10. The second cut sits on a base already cut, so it is smaller than 9% of 380. The notice warned against adding.

## Result

**Answer.** 280.10. Wrong method 273.60, difference 6.50.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
