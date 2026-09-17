# Explanation 21.10 — The Label That Separates Two Objects

## Explanation

1. A yes/no question tells the two objects apart only if the two objects answer differently.
2. Comparing red, round, small with red, square, small shows that the red and small properties are shared.
3. The property "round" is the only one whose value differs, so that question identifies the piece with certainty.

Reference solution as printed in the source (chapter 21, 4 steps):

1. “Is it red?” receives the answer “yes” for both, so it does not distinguish them.
2. “Is it small?” also receives “yes” for both.
3. “Is it round?” is “yes” for A and “no” for B.
4. A property with different values distinguishes the two objects.

## Result

**Answer.** “Is it round?”

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
