# Explanation 24.17 — Pouring with no loss

## Explanation

1. The first container starts with 600 ml and loses the 200 ml that is poured out, leaving 600 - 200 = 400 ml.
2. Because nothing is spilled the volume is conserved, so the 200 ml that left the first container is exactly the 200 ml that arrives in the second.

Reference solution as printed in the source (chapter 24, 4 steps):

1. The amount removed from the first container is 200 ml.
2. It has 600−200=400 ml left.
3. With no loss, exactly those 200 ml appear in the second container.
4. The total 400+200=600 confirms conservation.

## Result

**Answer.** 400 ml in the first; 200 ml transferred.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
