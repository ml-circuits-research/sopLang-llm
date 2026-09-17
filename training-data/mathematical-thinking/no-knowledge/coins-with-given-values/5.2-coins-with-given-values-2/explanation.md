# Explanation 5.2 — Coins with Given Values 2

## Explanation

1. A combination works when some nonnegative number of 2-lei coins plus some nonnegative number of 5-lei coins adds up to exactly 12.
2. Scanning the possible numbers of the larger coin leaves the remainder to be paid with the smaller coin, which is possible only when that remainder is a multiple of 2.
3. The combination that uses the fewest coins is 1 coins worth 2 lei and 2 coins worth 5 lei.
4. Checking the value: 1 × 2 + 2 × 5 = 12.

Reference solution as printed in the source (chapter 5, 4 steps):

1. First try 5-lei coins and see what amount remains for the 2-lei coins.
2. One possible combination uses 2 coins worth 5 lei, for a total of 10 lei.
3. The remainder is 12-10=2, which is made with 1 coin worth 2 lei.
4. Check: 2·1+5·2=12.

## Result

**Answer.** 1 coin worth 2 lei and 2 coins worth 5 lei.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
