# Explanation 21.16 — Three Properties, Only One Possible Object

## Explanation

1. Each "not ..." removes every card carrying that value, and the three filters must hold together.
2. Removing cards with red, square, large from the four descriptions leaves only C.
3. One surviving card means the description determines the object uniquely.

Reference solution as printed in the source (chapter 21, 4 steps):

1. “Not red” leaves C and D.
2. “Not square” eliminates D and leaves C.
3. C is small, so it also satisfies “not large.”
4. Only C satisfies all three conditions.

## Result

**Answer.** Card C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
