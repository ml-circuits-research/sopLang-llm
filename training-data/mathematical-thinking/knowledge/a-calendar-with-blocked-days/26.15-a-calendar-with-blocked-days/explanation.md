# Explanation 26.15 — A calendar with blocked days

## Explanation

1. "After Monday, before Friday" selects the weekdays strictly between the two bounds on the order carried by the fact table, giving Tuesday, Wednesday, Thursday.
2. Removing the blocked days Tuesday and Thursday from that list leaves only Wednesday.
3. One candidate survives every constraint, so the meeting can only be placed on Wednesday.

Reference solution as printed in the source (chapter 26, 4 steps):

1. The time condition leaves Tuesday, Wednesday, and Thursday.
2. Tuesday is blocked.
3. Thursday is blocked.
4. Only Wednesday remains.

## Result

**Answer.** Wednesday.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
