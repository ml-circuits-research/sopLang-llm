# Explanation 116 — Two percents that do not add — variant 6

## Explanation

1. The coat is ticketed at 300.00 in Wells Village, and Farid holds the store card, so the till 2 discount applies after the 15% reduction.
2. The first discount leaves 255.00, and 5% of that reduced price brings the payment to 242.25.
3. Adding the percents treats them as 20% of the original ticket, which gives 240.00 and is not what the notice says.
4. The two methods differ by 2.25 because the second percent is taken on the reduced price, not on the original ticket.

Reference material as printed in the source:

Chain: 300 → minus 15% = 255.00 → minus 5% = 242.25. The second cut sits on a base already cut, so it is smaller than 5% of 300. The notice warned against adding.

## Result

**Answer.** 242.25. Wrong method 240.00, difference 2.25.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
