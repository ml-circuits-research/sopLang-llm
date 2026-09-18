# Explanation 112 — Two percents that do not add — variant 2

## Explanation

1. The coat is ticketed at 220.00 in Long Hill, and Jules holds the store card, so the till 2 discount applies after the 11% reduction.
2. The first discount leaves 195.80, and 6% of that reduced price brings the payment to 184.05.
3. Adding the percents treats them as 17% of the original ticket, which gives 182.60 and is not what the notice says.
4. The two methods differ by 1.45 because the second percent is taken on the reduced price, not on the original ticket.

Reference material as printed in the source:

Chain: 220 → minus 11% = 195.80 → minus 6% = 184.05. The second cut sits on a base already cut, so it is smaller than 6% of 220. The notice warned against adding.

## Result

**Answer.** 184.05. Wrong method 182.60, difference 1.45.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
