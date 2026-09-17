# Explanation 5.10 — Timeline 5

## Explanation

1. A clock time uses the convention that one hour is 60 minutes and one day is 24 hours, and those conventions are supplied as facts rather than assumed.
2. The start time 12:00 becomes 720 minutes after midnight.
3. Adding 3 hours means adding 180 minutes, and reading the total back in hours and minutes gives 15:00.

Reference solution as printed in the source (chapter 5, 3 steps):

1. Start at 12:00.
2. Move forward 3 one-hour steps: 12:00 → 13:00 → 14:00 → 15:00.
3. After 3 steps we reach 15:00.

## Result

**Answer.** 15:00

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
