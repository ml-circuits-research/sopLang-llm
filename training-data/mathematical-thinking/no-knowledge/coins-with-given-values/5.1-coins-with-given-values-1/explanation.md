# Explanation 5.1 — Coins with Given Values 1

## Explanation

1. A combination works when some nonnegative number of 2-lei coins plus some nonnegative number of 5-lei coins adds up to exactly 9.
2. Scanning the possible numbers of the larger coin leaves the remainder to be paid with the smaller coin, which is possible only when that remainder is a multiple of 2.
3. The combination that uses the fewest coins is 2 coins worth 2 lei and 1 coins worth 5 lei.
4. Checking the value: 2 × 2 + 1 × 5 = 9.

Reference solution as printed in the source (chapter 5, 4 steps):

1. First try 5-lei coins and see what amount remains for the 2-lei coins.
2. One possible combination uses 1 coin worth 5 lei, for a total of 5 lei.
3. The remainder is 9-5=4, which is made with 2 coins worth 2 lei.
4. Check: 2·2+5·1=9.

## Result

**Answer.** 2 coins worth 2 lei and 1 coin worth 5 lei.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
