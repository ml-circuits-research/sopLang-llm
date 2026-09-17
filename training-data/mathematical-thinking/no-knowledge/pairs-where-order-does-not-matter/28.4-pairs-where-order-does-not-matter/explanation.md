# Explanation 28.4 — Pairs where order does not matter

## Explanation

1. Since the order inside a team does not matter, each team is a subset of the letters rather than an ordered pair.
2. Listing the 2-letter subsets of A, B, C gives AB, AC, BC.
3. There are 3 teams, and AB and BA are counted as the same team.

Reference solution as printed in the source (chapter 28, 4 steps):

1. With A we can form AB and AC.
2. With B, BA would repeat AB, so only BC is new.
3. Starting from C produces no new pair.
4. There are 3 distinct teams.

## Result

**Answer.** AB, AC, BC; 3 teams.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
