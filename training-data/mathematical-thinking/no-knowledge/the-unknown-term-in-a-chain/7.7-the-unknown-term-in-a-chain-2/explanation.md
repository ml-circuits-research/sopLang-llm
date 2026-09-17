# Explanation 7.7 — The Unknown Term in a Chain 2

## Explanation

1. The chain reads 9 + x + 6 = 24, where x is the unknown first addition.
2. Undoing the additions in reverse order means subtracting 6 first: 24 - 6 = 18.
3. Subtracting the starting amount as well gives 18 - 9 = 9.
4. Checking forward, 9 + 9 + 6 = 24, so the unknown term is 9.

Reference solution as printed in the source (chapter 7, 4 steps):

1. Undo the last addition: 24-6=18.
2. Now we have 9+x=18.
3. Also remove the initial quantity: 18-9=9.
4. Check: 9+9+6=24.

## Result

**Answer.** 9

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
