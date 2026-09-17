# Explanation 7.10 — The Unknown Term in a Chain 5

## Explanation

1. The chain reads 12 + x + 8 = 33, where x is the unknown first addition.
2. Undoing the additions in reverse order means subtracting 8 first: 33 - 8 = 25.
3. Subtracting the starting amount as well gives 25 - 12 = 13.
4. Checking forward, 12 + 13 + 8 = 33, so the unknown term is 13.

Reference solution as printed in the source (chapter 7, 4 steps):

1. Undo the last addition: 33-8=25.
2. Now we have 12+x=25.
3. Also remove the initial quantity: 25-12=13.
4. Check: 12+13+8=33.

## Result

**Answer.** 13

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
