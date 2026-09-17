# Explanation 5.7 — Timeline 2

## Explanation

1. A clock time uses the convention that one hour is 60 minutes and one day is 24 hours, and those conventions are supplied as facts rather than assumed.
2. The start time 9:00 becomes 540 minutes after midnight.
3. Adding 3 hours means adding 180 minutes, and reading the total back in hours and minutes gives 12:00.

Reference solution as printed in the source (chapter 5, 3 steps):

1. Start at 9:00.
2. Move forward 3 one-hour steps: 9:00 → 10:00 → 11:00 → 12:00.
3. After 3 steps we reach 12:00.

## Result

**Answer.** 12:00

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
