# Explanation 40.14 — Scheduling with an optional task

## Explanation

1. Every subset of the tasks that fits in 5 minutes is a legal schedule, because whole tasks are done at most once each.
2. The best subset is A+B, which uses 5 of the 5 minutes and collects 9 points.
3. Any schedule containing the remaining tasks would exceed the time limit, so no other subset earns more points.

Reference solution as printed in the source (chapter 40, 4 steps):

1. Enumerate the combinations that fit.
2. A+B takes 5 and gives 9.
3. C alone gives 6; A alone 5; B alone 4.
4. Combinations containing C and another task exceed 5.

## Result

**Answer.** A+B, 9 points.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
