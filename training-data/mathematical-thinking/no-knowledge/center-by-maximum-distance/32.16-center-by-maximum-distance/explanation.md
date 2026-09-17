# Explanation 32.16 — Center by maximum distance

## Explanation

1. For each candidate the important number is its eccentricity, the distance to the farthest node of the chain.
2. The smallest farthest distance is 2, reached at C, so that node is the best centre.

Reference solution as printed in the source (chapter 32, 4 steps):

1. From B, A is at distance 1 and E at 3; maximum 3.
2. From C, A and E are both at distance 2; maximum 2.
3. From D, E is at distance 1 and A at 3; maximum 3.
4. C minimizes the greatest distance.

## Result

**Answer.** C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
