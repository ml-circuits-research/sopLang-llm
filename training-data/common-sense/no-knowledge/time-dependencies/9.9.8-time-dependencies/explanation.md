# Explanation 9.9.8 — Time dependencies

## Explanation

1. Tasks with no prerequisite start at day 0: A finishes at 5, B finishes at 6.
2. Every other task starts at the latest finish among its prerequisites, so C waits for A, starts at 5, and finishes at 8; D waits for A, starts at 5, and finishes at 11; E waits for B and C, starts at 8, and finishes at 10; F waits for D and E, starts at 11, and finishes at 16.
3. The latest finish of all tasks is 16 days, reached by task F, so no schedule is shorter than that and this one attains it.
4. Each step of A–D–F waits for the previous step and therefore fixes the next start, while shortening a task outside that chain leaves the final finish unchanged.

Reference solution as printed in the source (template 8, 4 steps):

1. A finishes at 5 and B at 6. C therefore finishes at 8; D finishes at 11.
2. E must wait for both B and C, so it starts at max(6, 8) = 8 and finishes at 10.
3. F must wait for both D and E, so it starts at max(11, 10) = 11 and finishes at 16.
4. Tracing the predecessor that fixes each maximum gives the critical chain A–D–F. Shortening a non-critical task need not change the final deadline.

## Result

**Answer.** The minimum duration is 16 days. One critical chain is A–D–F.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
