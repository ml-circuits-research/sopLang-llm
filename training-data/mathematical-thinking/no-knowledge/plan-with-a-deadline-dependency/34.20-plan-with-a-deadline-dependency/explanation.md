# Explanation 34.20 — Plan with a deadline dependency

## Explanation

1. Task A starts at minute 0 and runs for 4 minutes, so it occupies minutes 0 to 4.
2. Task B cannot begin earlier than that, so it starts at minute 4 and adds its own 3 minutes.
3. It finishes at minute 7, with no break shortening the chain.

Reference solution as printed in the source (chapter 34, 4 steps):

1. A occupies the first 4 minutes.
2. B cannot begin before time 4.
3. B takes 3 minutes.
4. It finishes at 4+3=7.

## Result

**Answer.** Minute 7.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
