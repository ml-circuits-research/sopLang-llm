# Explanation 29.8 — An intuitive contrapositive in a universal rule

## Explanation

1. The universal rule says every golden piece is metallic, that is "golden" implies "metallic".
2. The piece we found fails the consequent: it is not metallic.
3. By the contrapositive the antecedent must fail too, so the piece cannot be golden.

Reference solution as printed in the source (chapter 29, 4 steps):

1. If it were golden, the rule would require it to be metallic.
2. The observation says it is not metallic.
3. Those facts would contradict each other.
4. Therefore the piece cannot be golden.

## Result

**Answer.** No, it cannot be golden.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
