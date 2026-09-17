# Explanation 40.1 — The 1-or-2 game: a small winning position

## Explanation

1. With removals of 1 or 2, the losing positions for the player to move are the multiples of 3, because every pair of replies can be forced to total 3.
2. Taking 1 from 4 leaves 3, which is a multiple of 3.
3. Whatever the opponent takes, the complementary amount restores a multiple of 3, so the same reply keeps working until the opponent takes the last token from a losing position.
4. So the forced winning move is to take 1.

Reference solution as printed in the source (chapter 40, 4 steps):

1. If you take 1, 3 remain.
2. If the opponent takes 1, 2 remain and you take both.
3. If the opponent takes 2, 1 remains and you take it.
4. In both responses, you take the last token.

## Result

**Answer.** Take 1 token.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
