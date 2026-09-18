# Explanation 115 — Two percents that do not add — variant 5

## Explanation

1. The coat is ticketed at 280.00 in Mill Hamlet, and Ben holds the store card, so the till 2 discount applies after the 14% reduction.
2. The first discount leaves 240.80, and 9% of that reduced price brings the payment to 219.13.
3. Adding the percents treats them as 23% of the original ticket, which gives 215.60 and is not what the notice says.
4. The two methods differ by 3.53 because the second percent is taken on the reduced price, not on the original ticket.

Reference material as printed in the source:

Chain: 280 → minus 14% = 240.80 → minus 9% = 219.13. The second cut sits on a base already cut, so it is smaller than 9% of 280. The notice warned against adding.

## Result

**Answer.** 219.13. Wrong method 215.60, difference 3.53.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
