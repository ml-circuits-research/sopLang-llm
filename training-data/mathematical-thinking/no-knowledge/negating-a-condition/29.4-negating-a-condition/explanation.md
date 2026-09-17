# Explanation 29.4 — Negating a condition

## Explanation

1. NOT(x > 5) is true exactly for the numbers that fail x > 5.
2. Negating a strict comparison keeps the boundary, so the answer is the set of numbers at most 5.
3. Scanning the candidates with the negated test keeps 3 and 5.

Reference solution as printed in the source (chapter 29, 4 steps):

1. 3 is not greater than 5 → keep it.
2. 5 is not greater than 5 → keep it.
3. 6 and 8 are greater than 5 → the negation is false.
4. 3 and 5 remain.

## Result

**Answer.** 3 and 5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
