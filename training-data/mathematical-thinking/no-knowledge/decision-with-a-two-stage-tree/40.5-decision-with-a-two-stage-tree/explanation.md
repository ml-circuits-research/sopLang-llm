# Explanation 40.5 — Decision with a two-stage tree

## Explanation

1. Maximizing the worst possible result means replacing each option by its smallest payoff and then choosing the largest of those minima.
2. A guarantees 2, so the guaranteed values differ.
3. The option with the best guaranteed value is A, so it is the maximin choice.

Reference solution as printed in the source (chapter 40, 4 steps):

1. For A, the worse outcome between 4 and 2 is 2.
2. For B, the worse outcome between 5 and 0 is 0.
3. The criterion tells us to compare these minima.
4. 2>0, so A is more robust.

## Result

**Answer.** A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
