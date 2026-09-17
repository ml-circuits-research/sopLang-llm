# Explanation 27.2 — Half a symbol in a pictogram

## Explanation

1. The legend gives two values: a complete ● is worth 4 apples and half of one is worth 2.
2. The row has 2 complete symbols and 1 half symbol, so each kind is scaled by its own legend value and the results are added to 10 apples.

Reference solution as printed in the source (chapter 27, 4 steps):

1. Two complete symbols represent 2×4=8 apples.
2. The half-symbol represents 2 apples.
3. 8+2=10.
4. The legend removes any ambiguity.

## Result

**Answer.** 10 apples.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
