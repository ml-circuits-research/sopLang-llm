# Explanation 13.11 — Undo a Chain of Three Operations 1

## Explanation

1. The number starts unknown and the chain applies +6, then -3, then +5 to reach 22.
2. Working backward means undoing the operations from right to left, each with its opposite operation.
3. Undoing the chain one step at a time brings 22 back to the starting value 14.
4. Checking forward, applying the chain to 14 ends exactly at 22.

Reference solution as printed in the source (chapter 13, 4 steps):

1. Undo +5: 22-5=17.
2. Undo −3 by applying +3: 17+3=20.
3. Undo +6 by applying −6: 20-6=14.
4. Forward check: 14+6-3+5=22.

## Result

**Answer.** 14

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
