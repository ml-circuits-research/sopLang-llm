# Explanation 7.8 — The Unknown Term in a Chain 3

## Explanation

1. The chain reads 8 + x + 7 = 26, where x is the unknown first addition.
2. Undoing the additions in reverse order means subtracting 7 first: 26 - 7 = 19.
3. Subtracting the starting amount as well gives 19 - 8 = 11.
4. Checking forward, 8 + 11 + 7 = 26, so the unknown term is 11.

Reference solution as printed in the source (chapter 7, 4 steps):

1. Undo the last addition: 26-7=19.
2. Now we have 8+x=19.
3. Also remove the initial quantity: 19-8=11.
4. Check: 8+11+7=26.

## Result

**Answer.** 11

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
