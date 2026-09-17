# Explanation 5.17 — Classify by Number of Sides 2

## Explanation

1. The definition fixes the required number of sides at 4, so it acts as a test for each candidate shape.
2. Testing the candidates 3, 4, 5 against that number leaves exactly one match.
3. The shape with 4 sides satisfies the definition, and the other candidates have too few or too many sides.

Reference solution as printed in the source (chapter 5, 3 steps):

1. The definition requires exactly 4 sides.
2. The shape with 3 has too few, and the shape with 5 has too many.
3. The shape with 4 sides is the only one that satisfies the definition.

## Result

**Answer.** The shape with 4 sides.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
