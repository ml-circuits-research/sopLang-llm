# Explanation 15.11 — Choose the Shortest Route 1

## Explanation

1. The statement defines "shortest" as the route with the smallest total length, so the task is a minimum over three numbers and then a comparison with the maximum.
2. Scanning the lengths 12 m, 15 m, 11 m keeps the smallest value, 11 m, which belongs to route 3.
3. The longest route is 15 m, so choosing route 3 saves the difference, 4 m.

Reference solution as printed in the source (chapter 15, 3 steps):

1. The smallest value is 11, so choose route 3.
2. The largest value is 15.
3. The difference is 15-11=4 m.

## Result

**Answer.** Route 3; 4 m shorter than the longest.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
