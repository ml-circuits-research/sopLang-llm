# Explanation 34.6 — Coins: minimum number of pieces

## Explanation

1. Making 8 is searched coin by coin, keeping the smallest number of pieces for every intermediate amount.
2. The table starts at 0 pieces for amount 0 and grows to 8, so each amount reuses the best solution of a smaller amount.
3. The reconstruction takes 5 + 3 = 8 with 2 coins, and no other choice uses fewer pieces.

Reference solution as printed in the source (chapter 34, 4 steps):

1. One coin cannot make 8 because the largest value is 5.
2. With two coins, 5+3=8.
3. So two coins are sufficient.
4. Since one is impossible, 2 is the minimum.

## Result

**Answer.** 2 coins: 5+3.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
