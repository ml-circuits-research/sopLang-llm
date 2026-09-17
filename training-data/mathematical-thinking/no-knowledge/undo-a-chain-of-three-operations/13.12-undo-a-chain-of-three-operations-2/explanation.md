# Explanation 13.12 — Undo a Chain of Three Operations 2

## Explanation

1. The number starts unknown and the chain applies +8, then -4, then +7 to reach 29.
2. Working backward means undoing the operations from right to left, each with its opposite operation.
3. Undoing the chain one step at a time brings 29 back to the starting value 18.
4. Checking forward, applying the chain to 18 ends exactly at 29.

Reference solution as printed in the source (chapter 13, 4 steps):

1. Undo +7: 29-7=22.
2. Undo −4 by applying +4: 22+4=26.
3. Undo +8 by applying −8: 26-8=18.
4. Forward check: 18+8-4+7=29.

## Result

**Answer.** 18

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
