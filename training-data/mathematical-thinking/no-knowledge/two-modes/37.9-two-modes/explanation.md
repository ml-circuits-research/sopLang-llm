# Explanation 37.9 — Two modes

## Explanation

1. The quoted definition keeps every value that is tied for the highest count, rather than a single winner.
2. In 1, 1, 2, 2, 3 the values 1 and 2 each appear twice, more often than any other value.
3. Both are reported as modes: 1 and 2.

Reference solution as printed in the source (chapter 37, 4 steps):

1. 1 appears 2 times.
2. 2 appears 2 times.
3. 3 appears once.
4. The maximum frequency is 2 and is reached by two values.

## Result

**Answer.** 1 and 2.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
