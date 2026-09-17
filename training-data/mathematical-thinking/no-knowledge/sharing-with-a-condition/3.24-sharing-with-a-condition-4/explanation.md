# Explanation 3.24 — Sharing with a Condition 4

## Explanation

1. All 15 cards are used, and the first person receives 1 more than the second.
2. Setting aside the extra 1 cards leaves 14 cards to split into two equal shares of 7.
3. Giving the extra cards back to the first person produces 8 and 7, which differ by 1.
4. Checking: 8 + 7 = 15, so all the cards are used.

Reference solution as printed in the source (chapter 3, 4 steps):

1. Because the first person has 1 more, mentally remove that extra card: 15-1=14 cards remain to be divided equally.
2. 14 divides into two equal groups of 7.
3. Give the extra card to the first person: 7+1=8.
4. Check: 8+7=15 and 8-7=1.

## Result

**Answer.** First person: 8; second person: 7.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
