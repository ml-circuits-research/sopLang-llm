# Explanation 25.2 — Three squares in a row

## Explanation

1. A row of 3 squares has 2 contacts where neighbours share a full side.
2. Counting every square alone gives 12 unit sides; each shared side is counted twice and becomes interior, so subtract 2 per contact.
3. The outer boundary keeps 8 unit sides.

Reference solution as printed in the source (chapter 25, 4 steps):

1. Three separate squares would have 12 sides.
2. There are two contacts between squares.
3. Each contact removes from the boundary two sides that were counted separately.
4. 12−4=8.

## Result

**Answer.** 8 unit sides.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
