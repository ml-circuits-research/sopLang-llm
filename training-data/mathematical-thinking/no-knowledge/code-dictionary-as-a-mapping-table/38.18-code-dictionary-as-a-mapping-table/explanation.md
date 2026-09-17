# Explanation 38.18 — Code dictionary as a mapping table

## Explanation

1. A dictionary is a table that assigns a code to each name, so encoding means looking up every name in order.
2. Reading the table for red, blue, green gives 2, 7, 5.
3. Written as a sequence, the message is 2-7-5.

Reference solution as printed in the source (chapter 38, 4 steps):

1. Red maps to 2.
2. Blue maps to 7.
3. Green maps to 5.
4. Preserve the order of the message: 2-7-5.

## Result

**Answer.** 2-7-5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
