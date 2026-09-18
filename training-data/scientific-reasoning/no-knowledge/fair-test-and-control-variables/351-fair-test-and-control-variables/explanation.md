# Explanation 351 — Fair test and control variables

## Explanation

1. A fair test changes exactly one factor, “model rotation angle”, and holds every other condition fixed.
2. The two groups receive that factor at different levels, 0 and 180, so any difference in the outcome can be traced to the factor.
3. The conditions kept constant are the same source, the same point marked, the same source position; changing any of them at the same time would give two causes for one difference and the conclusion would be ambiguous.
4. Both groups must also be measured on the same outcome variable, otherwise the comparison is not like for like.

Reference solution as printed in the source (form 11, 4 steps):

1. The variable we intentionally change is “model rotation angle”.
2. We choose two levels: 0 and 180.
3. We keep the same: the same source, the same point marked, the same source position.
4. We measure the same outcome variable in both groups. If we also change another condition, two causes change at once and we can no longer tell which produced the difference.

## Result

**Answer.** We change only “model rotation angle” and we control the same source, the same point marked, the same source position.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
