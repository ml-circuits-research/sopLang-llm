# Explanation 5.19 — Classify by Number of Sides 4

## Explanation

1. The definition fixes the required number of sides at 6, so it acts as a test for each candidate shape.
2. Testing the candidates 5, 6, 7 against that number leaves exactly one match.
3. The shape with 6 sides satisfies the definition, and the other candidates have too few or too many sides.

Reference solution as printed in the source (chapter 5, 3 steps):

1. The definition requires exactly 6 sides.
2. The shape with 5 has too few, and the shape with 7 has too many.
3. The shape with 6 sides is the only one that satisfies the definition.

## Result

**Answer.** The shape with 6 sides.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
