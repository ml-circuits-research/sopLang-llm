# Explanation 19.22 — Shortest Path in a State Space 2

## Explanation

1. Each move adds either 2 or 5, and the token must grow from 1 to 16, so the total increase is 16 − 1 = 15.
2. For a fixed number of moves m with k of the larger moves, the total increase is m×2 + k×3, which pins k down as soon as m is fixed.
3. The search takes the smallest m for which that equation has a whole solution with 0 ≤ k ≤ m, which gives 3 moves.
4. One sequence achieving it is [5, 5, 5], and no sequence with fewer moves can reach the same total because the equation has no such solution.

Reference solution as printed in the source (chapter 19, 4 steps):

1. One sequence found is: 1 → 6 → 11 → 16, using steps [5, 5, 5].
2. This has 3 moves and increases the value by 15.
3. With only 2 moves, the possible increases are [4, 7, 10]; 15 does not appear in the list.
4. With even fewer moves, the maximum increase is at most 5, so we cannot reach the difference 15. Therefore 3 is minimal.

## Result

**Answer.** 3 moves; one example of steps: [5, 5, 5].

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
