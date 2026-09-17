# Explanation 7.9 — The Unknown Term in a Chain 4

## Explanation

1. The chain reads 11 + x + 5 = 28, where x is the unknown first addition.
2. Undoing the additions in reverse order means subtracting 5 first: 28 - 5 = 23.
3. Subtracting the starting amount as well gives 23 - 11 = 12.
4. Checking forward, 11 + 12 + 5 = 28, so the unknown term is 12.

Reference solution as printed in the source (chapter 7, 4 steps):

1. Undo the last addition: 28-5=23.
2. Now we have 11+x=23.
3. Also remove the initial quantity: 23-11=12.
4. Check: 11+12+5=28.

## Result

**Answer.** 12

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
