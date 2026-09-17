# Explanation 19.6 — Conserved Total in a Transfer Game 1

## Explanation

1. A transfer move removes tokens from one box and puts exactly the same number into the other box, so nothing is created and nothing disappears.
2. The total is an invariant of the game: the boxes start with 20 + 15 = 35 tokens.
3. The proposed state holds 18 + 17 = 35 tokens.
4. The two totals agree, so the proposed distribution is not excluded by the conservation law.

Reference solution as printed in the source (chapter 19, 4 steps):

1. Initial total: 20+15=35.
2. Proposed total: 18+17=35.
3. The totals are equal.
4. Therefore, the state is compatible with the invariant (although a concrete sequence of moves would still need to be checked).

## Result

**Answer.** Possible from the standpoint of the total.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
