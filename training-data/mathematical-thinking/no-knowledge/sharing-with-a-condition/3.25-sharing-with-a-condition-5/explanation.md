# Explanation 3.25 — Sharing with a Condition 5

## Explanation

1. All 17 cards are used, and the first person receives 1 more than the second.
2. Setting aside the extra 1 cards leaves 16 cards to split into two equal shares of 8.
3. Giving the extra cards back to the first person produces 9 and 8, which differ by 1.
4. Checking: 9 + 8 = 17, so all the cards are used.

Reference solution as printed in the source (chapter 3, 4 steps):

1. Because the first person has 1 more, mentally remove that extra card: 17-1=16 cards remain to be divided equally.
2. 16 divides into two equal groups of 8.
3. Give the extra card to the first person: 8+1=9.
4. Check: 9+8=17 and 9-8=1.

## Result

**Answer.** First person: 9; second person: 8.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
