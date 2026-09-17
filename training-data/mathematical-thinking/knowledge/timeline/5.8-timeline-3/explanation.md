# Explanation 5.8 — Timeline 3

## Explanation

1. A clock time uses the convention that one hour is 60 minutes and one day is 24 hours, and those conventions are supplied as facts rather than assumed.
2. The start time 10:00 becomes 600 minutes after midnight.
3. Adding 4 hours means adding 240 minutes, and reading the total back in hours and minutes gives 14:00.

Reference solution as printed in the source (chapter 5, 3 steps):

1. Start at 10:00.
2. Move forward 4 one-hour steps: 10:00 → 11:00 → 12:00 → 13:00 → 14:00.
3. After 4 steps we reach 14:00.

## Result

**Answer.** 14:00

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
