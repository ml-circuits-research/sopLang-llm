# Explanation 32.17 — Visit all nodes without repetition

## Explanation

1. Visiting every node exactly once is a path that uses all nodes and never repeats one, so a walk can be extended and backed out of dead ends.
2. Starting at A, the search finds the visiting order A-B-C-D, which covers all 4 nodes.

Reference solution as printed in the source (chapter 32, 4 steps):

1. From A the only continuation is B.
2. From B we can go to C without returning to A.
3. From C we go to D.
4. The sequence A-B-C-D visits each node exactly once.

## Result

**Answer.** Yes: A-B-C-D.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
