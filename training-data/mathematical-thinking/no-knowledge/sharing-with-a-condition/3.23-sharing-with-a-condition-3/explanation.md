# Explanation 3.23 — Sharing with a Condition 3

## Explanation

1. All 13 cards are used, and the first person receives 1 more than the second.
2. Setting aside the extra 1 cards leaves 12 cards to split into two equal shares of 6.
3. Giving the extra cards back to the first person produces 7 and 6, which differ by 1.
4. Checking: 7 + 6 = 13, so all the cards are used.

Reference solution as printed in the source (chapter 3, 4 steps):

1. Because the first person has 1 more, mentally remove that extra card: 13-1=12 cards remain to be divided equally.
2. 12 divides into two equal groups of 6.
3. Give the extra card to the first person: 6+1=7.
4. Check: 7+6=13 and 7-6=1.

## Result

**Answer.** First person: 7; second person: 6.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
