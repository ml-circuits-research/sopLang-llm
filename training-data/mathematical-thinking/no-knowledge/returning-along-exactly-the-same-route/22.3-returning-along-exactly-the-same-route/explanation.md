# Explanation 22.3 — Returning along exactly the same route

## Explanation

1. To retrace a route exactly, the walker must undo the last move first and walk its opposite: reversing the list and swapping east↔west and north↔south.
2. The return list therefore starts with the opposite of the last leg (west) and ends with the opposite of the first leg (east).

Reference solution as printed in the source (chapter 22, 4 steps):

1. The last move was 2 steps west, so on the way back she first walks 2 steps east.
2. Before that she walked 3 steps north, so she now walks 3 steps south.
3. The first move was 4 steps east, so the last return move is 4 steps west.
4. Each segment is canceled in reverse order.

## Result

**Answer.** 2 steps east, 3 south, 4 west.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
