# Explanation 26.2 — The day four days ago

## Explanation

1. Going back 4 days is a move in the negative direction on the weekday cycle, which the problem text takes for granted rather than listing.
2. The circuit reads the seven weekdays from the fact table and shifts the position of Tuesday by minus 4, wrapping around the start of the cycle.
3. The wrapped position is Friday, so 4 days before Tuesday is exactly that weekday.

Reference solution as printed in the source (chapter 26, 4 steps):

1. 1 day earlier: Monday.
2. 2 days earlier: Sunday.
3. 3 days earlier: Saturday.
4. 4 days earlier: Friday.

## Result

**Answer.** Friday.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
