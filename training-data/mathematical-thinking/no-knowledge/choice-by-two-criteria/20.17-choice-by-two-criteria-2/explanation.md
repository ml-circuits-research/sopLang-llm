# Explanation 20.17 — Choice by Two Criteria 2

## Explanation

1. The selection rule is lexicographic: time is compared first, and cost is consulted only when two plans have the same time.
2. Among the plans the smallest time is 11, which already rules out every plan with a larger time.
3. The surviving plan with time 11 also has the smaller cost whenever the time was tied, so P3 is selected.
4. No other plan can beat it, because beating it would require a smaller time or an equal time with a smaller cost.

Reference solution as printed in the source (chapter 20, 4 steps):

1. First compare the times: [12, 11, 11].
2. The minimum time is 11. The plans with this time are [2, 3].
3. If there is a tie in time, compare costs only among these plans; the smallest cost is 10 for P3.
4. The selected plan is P3.

## Result

**Answer.** P3.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
