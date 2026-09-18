# Explanation 113 — Two percents that do not add — variant 3

## Explanation

1. The coat is ticketed at 240.00 in Forest Parish, and Ned holds the store card, so the till 2 discount applies after the 12% reduction.
2. The first discount leaves 211.20, and 7% of that reduced price brings the payment to 196.42.
3. Adding the percents treats them as 19% of the original ticket, which gives 194.40 and is not what the notice says.
4. The two methods differ by 2.02 because the second percent is taken on the reduced price, not on the original ticket.

Reference material as printed in the source:

Chain: 240 → minus 12% = 211.20 → minus 7% = 196.42. The second cut sits on a base already cut, so it is smaller than 7% of 240. The notice warned against adding.

## Result

**Answer.** 196.42. Wrong method 194.40, difference 2.02.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
