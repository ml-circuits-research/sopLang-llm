# Explanation 31.24 — Probability conditioned on color

## Explanation

1. Conditioning on the known colour discards every card that does not have that colour and keeps the rest equally likely.
2. Only the 2 blue cards remain possible, and 1 of them is a circle.
3. The conditional probability is 1/2, that is 1/2.

Reference solution as printed in the source (chapter 31, 4 steps):

1. Eliminate the two red cards.
2. Blue-circle and blue-triangle remain.
3. One of the two has circle shape.
4. The conditional probability is 1/2.

## Result

**Answer.** 1/2.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
