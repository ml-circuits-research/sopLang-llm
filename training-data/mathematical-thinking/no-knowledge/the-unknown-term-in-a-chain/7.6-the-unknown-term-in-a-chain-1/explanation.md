# Explanation 7.6 — The Unknown Term in a Chain 1

## Explanation

1. The chain reads 7 + x + 5 = 20, where x is the unknown first addition.
2. Undoing the additions in reverse order means subtracting 5 first: 20 - 5 = 15.
3. Subtracting the starting amount as well gives 15 - 7 = 8.
4. Checking forward, 7 + 8 + 5 = 20, so the unknown term is 8.

Reference solution as printed in the source (chapter 7, 4 steps):

1. Undo the last addition: 20-5=15.
2. Now we have 7+x=15.
3. Also remove the initial quantity: 15-7=8.
4. Check: 7+8+5=20.

## Result

**Answer.** 8

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
