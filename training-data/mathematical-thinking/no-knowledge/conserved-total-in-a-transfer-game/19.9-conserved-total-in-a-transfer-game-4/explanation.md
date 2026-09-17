# Explanation 19.9 — Conserved Total in a Transfer Game 4

## Explanation

1. A transfer move removes tokens from one box and puts exactly the same number into the other box, so nothing is created and nothing disappears.
2. The total is an invariant of the game: the boxes start with 28 + 17 = 45 tokens.
3. The proposed state holds 25 + 21 = 46 tokens.
4. The two totals differ, so the proposed distribution cannot be reached by any sequence of transfers.

Reference solution as printed in the source (chapter 19, 4 steps):

1. Initial total: 28+17=45.
2. Proposed total: 25+21=46.
3. The totals are different.
4. Therefore, the state is impossible.

## Result

**Answer.** Impossible.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
