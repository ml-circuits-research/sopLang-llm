# Explanation 21.11 — A Two-Question Classification Tree

## Explanation

1. The first question "Is it red?" splits the four pieces into two pairs that share the answer.
2. Inside each pair the pieces differ in exactly one property, so the second question must ask about that property.
3. Both pairs point to the same property "round", so that question identifies the piece with certainty.

Reference solution as printed in the source (chapter 21, 4 steps):

1. If the answer to the first question is “yes,” A and B remain.
2. If it is “no,” C and D remain.
3. In both pairs, the difference is the shape: round or square.
4. The question “Is it round?” separates A from B and C from D.

## Result

**Answer.** The second question can be “Is it round?”.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
