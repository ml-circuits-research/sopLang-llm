# Explanation 119 — Two percents that do not add — variant 9

## Explanation

1. The coat is ticketed at 360.00 in Little River, and Sam holds the store card, so the till 2 discount applies after the 18% reduction.
2. The first discount leaves 295.20, and 8% of that reduced price brings the payment to 271.58.
3. Adding the percents treats them as 26% of the original ticket, which gives 266.40 and is not what the notice says.
4. The two methods differ by 5.18 because the second percent is taken on the reduced price, not on the original ticket.

Reference material as printed in the source:

Chain: 360 → minus 18% = 295.20 → minus 8% = 271.58. The second cut sits on a base already cut, so it is smaller than 8% of 360. The notice warned against adding.

## Result

**Answer.** 271.58. Wrong method 266.40, difference 5.18.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
