# Explanation 114 — Two percents that do not add — variant 4

## Explanation

1. The coat is ticketed at 260.00 in Little River, and Sam holds the store card, so the till 2 discount applies after the 13% reduction.
2. The first discount leaves 226.20, and 8% of that reduced price brings the payment to 208.10.
3. Adding the percents treats them as 21% of the original ticket, which gives 205.40 and is not what the notice says.
4. The two methods differ by 2.70 because the second percent is taken on the reduced price, not on the original ticket.

Reference material as printed in the source:

Chain: 260 → minus 13% = 226.20 → minus 8% = 208.10. The second cut sits on a base already cut, so it is smaller than 8% of 260. The notice warned against adding.

## Result

**Answer.** 208.10. Wrong method 205.40, difference 2.70.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
