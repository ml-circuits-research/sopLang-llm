# Explanation 31.20 — A fair game under the given definition

## Explanation

1. The definition given in the statement calls a game fair when winning and losing have the same probability, so the two counts must be compared over the same total.
2. Winning happens on 3 of the 6 faces and losing on 3 of them.
3. 3/6 equals 3/6, so the game is fair.

Reference solution as printed in the source (chapter 31, 4 steps):

1. There are 3 winning faces.
2. There are 3 losing faces.
3. All 6 faces are equally likely.
4. The two probabilities are equal.

## Result

**Answer.** Yes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
