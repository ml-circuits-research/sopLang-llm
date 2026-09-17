# Explanation 5.4 — Coins with Given Values 4

## Explanation

1. A combination works when some nonnegative number of 2-lei coins plus some nonnegative number of 5-lei coins adds up to exactly 16.
2. Scanning the possible numbers of the larger coin leaves the remainder to be paid with the smaller coin, which is possible only when that remainder is a multiple of 2.
3. The combination that uses the fewest coins is 3 coins worth 2 lei and 2 coins worth 5 lei.
4. Checking the value: 3 × 2 + 2 × 5 = 16.

Reference solution as printed in the source (chapter 5, 4 steps):

1. First try 5-lei coins and see what amount remains for the 2-lei coins.
2. One possible combination uses 2 coins worth 5 lei, for a total of 10 lei.
3. The remainder is 16-10=6, which is made with 3 coins worth 2 lei.
4. Check: 2·3+5·2=16.

## Result

**Answer.** 3 coins worth 2 lei and 2 coins worth 5 lei.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
