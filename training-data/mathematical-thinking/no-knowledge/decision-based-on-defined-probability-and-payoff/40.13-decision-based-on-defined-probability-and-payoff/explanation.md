# Explanation 40.13 — Decision based on defined probability and payoff

## Explanation

1. The average value of a game with equally likely outcomes is the mean of its payoffs.
2. A averages 5 and B averages 4, so the means differ.
3. The higher average belongs to game A, which is therefore the choice.

Reference solution as printed in the source (chapter 40, 4 steps):

1. A has mean 5.
2. B has mean 4.
3. By the average-value criterion, 5>4.
4. This criterion says nothing about risk; it only compares averages.

## Result

**Answer.** Game A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
