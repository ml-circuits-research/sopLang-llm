# Explanation 341 — Fair test and control variables

## Explanation

1. A fair test changes exactly one factor, “degree of compaction”, and holds every other condition fixed.
2. The two groups receive that factor at different levels, 1 and 3, so any difference in the outcome can be traced to the factor.
3. The conditions kept constant are the same amount of soil, the same water, the same container; changing any of them at the same time would give two causes for one difference and the conclusion would be ambiguous.
4. Both groups must also be measured on the same outcome variable, otherwise the comparison is not like for like.

Reference solution as printed in the source (form 11, 4 steps):

1. The variable we intentionally change is “degree of compaction”.
2. We choose two levels: 1 and 3.
3. We keep the same: the same amount of soil, the same water, the same container.
4. We measure the same outcome variable in both groups. If we also change another condition, two causes change at once and we can no longer tell which produced the difference.

## Result

**Answer.** We change only “degree of compaction” and we control the same amount of soil, the same water, the same container.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
