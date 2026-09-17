# Explanation 19.25 — Shortest Path in a State Space 5

## Explanation

1. Each move adds either 2 or 5, and the token must grow from 4 to 23, so the total increase is 23 − 4 = 19.
2. For a fixed number of moves m with k of the larger moves, the total increase is m×2 + k×3, which pins k down as soon as m is fixed.
3. The search takes the smallest m for which that equation has a whole solution with 0 ≤ k ≤ m, which gives 5 moves.
4. One sequence achieving it is [2, 2, 5, 5, 5], and no sequence with fewer moves can reach the same total because the equation has no such solution.

Reference solution as printed in the source (chapter 19, 4 steps):

1. One sequence found is: 4 → 6 → 8 → 13 → 18 → 23, using steps [2, 2, 5, 5, 5].
2. This has 5 moves and increases the value by 19.
3. With only 4 moves, the possible increases are [8, 11, 14, 17, 20]; 19 does not appear in the list.
4. With even fewer moves, the maximum increase is at most 15, so we cannot reach the difference 19. Therefore 5 is minimal.

## Result

**Answer.** 5 moves; one example of steps: [2, 2, 5, 5, 5].

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
