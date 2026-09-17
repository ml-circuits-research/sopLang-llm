# Explanation 31.19 — Making the better choice in a game

## Explanation

1. Each bag wins in a fraction of its equally likely balls, so the better bag is the one with the larger fraction of winning balls.
2. Bag A wins with probability 1/2 and bag B with probability 2/5.
3. 1/2 is the greater chance, so bag A maximizes the chance of winning.

Reference solution as printed in the source (chapter 31, 4 steps):

1. A offers winning outcomes half the time.
2. B offers 4 out of10, or 2/5.
3. Compare 1/2 with2/5: cross-products give 5>4.
4. A has the greater chance.

## Result

**Answer.** Bag A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
