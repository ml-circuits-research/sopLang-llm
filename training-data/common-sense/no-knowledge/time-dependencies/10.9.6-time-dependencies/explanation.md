# Explanation 10.9.6 — Time dependencies

## Explanation

1. Tasks with no prerequisite start at day 0: A finishes at 3, B finishes at 5.
2. Every other task starts at the latest finish among its prerequisites, so C waits for A, starts at 3, and finishes at 8; D waits for A, starts at 3, and finishes at 7; E waits for B and C, starts at 8, and finishes at 14; F waits for D and E, starts at 14, and finishes at 20.
3. The latest finish of all tasks is 20 days, reached by task F, so no schedule is shorter than that and this one attains it.
4. Each step of A–C–E–F waits for the previous step and therefore fixes the next start, while shortening a task outside that chain leaves the final finish unchanged.

Reference solution as printed in the source (template 8, 4 steps):

1. A finishes at 3 and B at 5. C therefore finishes at 8; D finishes at 7.
2. E must wait for both B and C, so it starts at max(5, 8) = 8 and finishes at 14.
3. F must wait for both D and E, so it starts at max(7, 14) = 14 and finishes at 20.
4. Tracing the predecessor that fixes each maximum gives the critical chain A–C–E–F. Shortening a non-critical task need not change the final deadline.

## Result

**Answer.** The minimum duration is 20 days. One critical chain is A–C–E–F.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
