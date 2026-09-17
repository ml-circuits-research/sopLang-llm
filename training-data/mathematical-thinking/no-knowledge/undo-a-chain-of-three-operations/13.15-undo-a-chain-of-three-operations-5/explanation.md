# Explanation 13.15 — Undo a Chain of Three Operations 5

## Explanation

1. The number starts unknown and the chain applies +9, then -3, then +6 to reach 37.
2. Working backward means undoing the operations from right to left, each with its opposite operation.
3. Undoing the chain one step at a time brings 37 back to the starting value 25.
4. Checking forward, applying the chain to 25 ends exactly at 37.

Reference solution as printed in the source (chapter 13, 4 steps):

1. Undo +6: 37-6=31.
2. Undo −3 by applying +3: 31+3=34.
3. Undo +9 by applying −9: 34-9=25.
4. Forward check: 25+9-3+6=37.

## Result

**Answer.** 25

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
