# Explanation 28.13 — Choosing a pair with an incompatibility

## Explanation

1. Every team is a pair of people, and the pair AB is forbidden.
2. Counting all pairs first and then removing the forbidden one is the complement idea.
3. That leaves 5 admissible teams.

Reference solution as printed in the source (chapter 28, 4 steps):

1. List the distinct pairs systematically.
2. There are 6 in total.
3. The rule forbids only AB.
4. 5 teams remain.

## Result

**Answer.** 5 teams.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
