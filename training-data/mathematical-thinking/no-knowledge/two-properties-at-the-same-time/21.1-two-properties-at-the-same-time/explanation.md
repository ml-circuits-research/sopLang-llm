# Explanation 21.1 — Two Properties at the Same Time

## Explanation

1. The round group has 5 cards and the blue group has 4, and 2 cards satisfy both properties at once.
2. Asking for "round but not blue" removes the shared cards from the round group, so the count is 5 - 2.
3. The remaining 3 cards carry the round property alone.

Reference solution as printed in the source (chapter 21, 4 steps):

1. Of the 5 round cards, 2 are already in the group that is also blue.
2. The round cards that are not blue are those left after removing the 2 common cards.
3. Calculate 5-2=3.
4. Check: 3 round-not-blue + 2 round-blue = 5 round cards.

## Result

**Answer.** 3 cards.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
