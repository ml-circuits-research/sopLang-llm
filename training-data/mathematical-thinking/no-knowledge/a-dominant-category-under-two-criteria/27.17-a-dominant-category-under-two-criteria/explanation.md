# Explanation 27.17 — A dominant category under two criteria

## Explanation

1. The ranking rule has two stages applied in the stated order: the score decides first, and penalties decide only a tie.
2. Reading the teams as A: 8 points, 2 penalties; B: 8 points, 1 penalties; C: 7 points, 0 penalties shows that the highest score is shared, and the tie is broken by the smaller penalty count.
3. Team B wins with 1 penalties.

Reference solution as printed in the source (chapter 27, 4 steps):

1. A and B have 8 points, more than C with 7.
2. C is eliminated by the first criterion.
3. A and B are tied on points.
4. B has 1 penalty versus A's 2, so B wins.

## Result

**Answer.** Team B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
