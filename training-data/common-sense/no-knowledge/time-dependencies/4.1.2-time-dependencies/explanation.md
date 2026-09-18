# Explanation 4.1.2 — Time dependencies

## Explanation

1. Tasks with no prerequisite start at day 0: A finishes at 4, B finishes at 5.
2. Every other task starts at the latest finish among its prerequisites, so C waits for A, starts at 4, and finishes at 6; D waits for A, starts at 4, and finishes at 9; E waits for B and C, starts at 6, and finishes at 10; F waits for D and E, starts at 10, and finishes at 12.
3. The latest finish of all tasks is 12 days, reached by task F, so no schedule is shorter than that and this one attains it.
4. Each step of A–C–E–F waits for the previous step and therefore fixes the next start, while shortening a task outside that chain leaves the final finish unchanged.

Reference solution as printed in the source (template 8, 4 steps):

1. A finishes at 4 and B at 5. C therefore finishes at 6; D finishes at 9.
2. E must wait for both B and C, so it starts at max(5, 6) = 6 and finishes at 10.
3. F must wait for both D and E, so it starts at max(9, 10) = 10 and finishes at 12.
4. Tracing the predecessor that fixes each maximum gives the critical chain A–C–E–F. Shortening a non-critical task need not change the final deadline.

## Result

**Answer.** The minimum duration is 12 days. One critical chain is A–C–E–F.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
