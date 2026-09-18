# Explanation 117 — Two percents that do not add — variant 7

## Explanation

1. The coat is ticketed at 320.00 in Long Hill, and Jules holds the store card, so the till 2 discount applies after the 16% reduction.
2. The first discount leaves 268.80, and 6% of that reduced price brings the payment to 252.67.
3. Adding the percents treats them as 22% of the original ticket, which gives 249.60 and is not what the notice says.
4. The two methods differ by 3.07 because the second percent is taken on the reduced price, not on the original ticket.

Reference material as printed in the source:

Chain: 320 → minus 16% = 268.80 → minus 6% = 252.67. The second cut sits on a base already cut, so it is smaller than 6% of 320. The notice warned against adding.

## Result

**Answer.** 252.67. Wrong method 249.60, difference 3.07.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
