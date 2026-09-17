# Explanation 15.13 — Choose the Shortest Route 3

## Explanation

1. The statement defines "shortest" as the route with the smallest total length, so the task is a minimum over three numbers and then a comparison with the maximum.
2. Scanning the lengths 21 m, 19 m, 20 m keeps the smallest value, 19 m, which belongs to route 2.
3. The longest route is 21 m, so choosing route 2 saves the difference, 2 m.

Reference solution as printed in the source (chapter 15, 3 steps):

1. The smallest value is 19, so choose route 2.
2. The largest value is 21.
3. The difference is 21-19=2 m.

## Result

**Answer.** Route 2; 2 m shorter than the longest.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
