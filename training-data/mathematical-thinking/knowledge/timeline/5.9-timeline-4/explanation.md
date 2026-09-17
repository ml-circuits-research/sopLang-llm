# Explanation 5.9 — Timeline 4

## Explanation

1. A clock time uses the convention that one hour is 60 minutes and one day is 24 hours, and those conventions are supplied as facts rather than assumed.
2. The start time 11:00 becomes 660 minutes after midnight.
3. Adding 2 hours means adding 120 minutes, and reading the total back in hours and minutes gives 13:00.

Reference solution as printed in the source (chapter 5, 3 steps):

1. Start at 11:00.
2. Move forward 2 one-hour steps: 11:00 → 12:00 → 13:00.
3. After 2 steps we reach 13:00.

## Result

**Answer.** 13:00

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
