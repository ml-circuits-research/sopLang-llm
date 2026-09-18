# Explanation 118 — Two percents that do not add — variant 8

## Explanation

1. The coat is ticketed at 340.00 in Forest Parish, and Ned holds the store card, so the till 2 discount applies after the 17% reduction.
2. The first discount leaves 282.20, and 7% of that reduced price brings the payment to 262.45.
3. Adding the percents treats them as 24% of the original ticket, which gives 258.40 and is not what the notice says.
4. The two methods differ by 4.05 because the second percent is taken on the reduced price, not on the original ticket.

Reference material as printed in the source:

Chain: 340 → minus 17% = 282.20 → minus 7% = 262.45. The second cut sits on a base already cut, so it is smaller than 7% of 340. The notice warned against adding.

## Result

**Answer.** 262.45. Wrong method 258.40, difference 4.05.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
