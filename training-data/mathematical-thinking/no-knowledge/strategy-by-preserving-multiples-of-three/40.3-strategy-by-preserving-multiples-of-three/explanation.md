# Explanation 40.3 — Strategy by preserving multiples of three

## Explanation

1. The target is to hand the opponent a multiple of 3, because from a multiple of 3 every pair of moves can be answered so that the pair totals 3.
2. Starting from 8, only one removal of 1 or 2 leaves a multiple of 3: taking 2 leaves 6.
3. Therefore the first move is to take 2.

Reference solution as printed in the source (chapter 40, 4 steps):

1. The nearest multiple of 3 below 8 is 6.
2. To leave 6, take 2.
3. Then, if the opponent takes 1, respond with 2; if the opponent takes 2, respond with 1.
4. Each pair of moves removes 3 and again leaves the opponent a multiple of 3.

## Result

**Answer.** Take 2.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
