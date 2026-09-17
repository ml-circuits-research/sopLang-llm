# Explanation 3.21 — Sharing with a Condition 1

## Explanation

1. All 9 cards are used, and the first person receives 1 more than the second.
2. Setting aside the extra 1 cards leaves 8 cards to split into two equal shares of 4.
3. Giving the extra cards back to the first person produces 5 and 4, which differ by 1.
4. Checking: 5 + 4 = 9, so all the cards are used.

Reference solution as printed in the source (chapter 3, 4 steps):

1. Because the first person has 1 more, mentally remove that extra card: 9-1=8 cards remain to be divided equally.
2. 8 divides into two equal groups of 4.
3. Give the extra card to the first person: 4+1=5.
4. Check: 5+4=9 and 5-4=1.

## Result

**Answer.** First person: 5; second person: 4.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
