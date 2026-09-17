# Explanation 32.18 — Traverse each link exactly once

## Explanation

1. A closed walk that uses each link exactly once returns to its starting node after covering every link.
2. Trying the links from A and never repeating one produces the circuit A-B-C-A, which closes the tour.

Reference solution as printed in the source (chapter 32, 4 steps):

1. A-B uses the first link.
2. B-C uses the second.
3. C-A uses the third.
4. We return to A without repeating a link.

## Result

**Answer.** Yes: A-B-C-A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
