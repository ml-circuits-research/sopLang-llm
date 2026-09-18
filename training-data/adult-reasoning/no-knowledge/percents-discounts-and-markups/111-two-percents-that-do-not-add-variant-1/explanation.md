# Explanation 111 — Two percents that do not add — variant 1

## Explanation

1. The coat is ticketed at 200.00 in Wells Village, and Farid holds the store card, so the till 2 discount applies after the 10% reduction.
2. The first discount leaves 180.00, and 5% of that reduced price brings the payment to 171.00.
3. Adding the percents treats them as 15% of the original ticket, which gives 170.00 and is not what the notice says.
4. The two methods differ by 1.00 because the second percent is taken on the reduced price, not on the original ticket.

Reference material as printed in the source:

Chain: 200 → minus 10% = 180.00 → minus 5% = 171.00. The second cut sits on a base already cut, so it is smaller than 5% of 200. The notice warned against adding.

## Result

**Answer.** 171.00. Wrong method 170.00, difference 1.00.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
