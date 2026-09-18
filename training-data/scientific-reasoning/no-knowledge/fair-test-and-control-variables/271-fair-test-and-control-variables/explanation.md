# Explanation 271 — Fair test and control variables

## Explanation

1. A fair test changes exactly one factor, “temperature in the interval certain”, and holds every other condition fixed.
2. The two groups receive that factor at different levels, 15 and 28, so any difference in the outcome can be traced to the factor.
3. The conditions kept constant are the same number initial of eggs, the same food, the same species; changing any of them at the same time would give two causes for one difference and the conclusion would be ambiguous.
4. Both groups must also be measured on the same outcome variable, otherwise the comparison is not like for like.

Reference solution as printed in the source (form 11, 4 steps):

1. The variable we intentionally change is “temperature in the interval certain”.
2. We choose two levels: 15 and 28.
3. We keep the same: the same number initial of eggs, the same food, the same species.
4. We measure the same outcome variable in both groups. If we also change another condition, two causes change at once and we can no longer tell which produced the difference.

## Result

**Answer.** We change only “temperature in the interval certain” and we control the same number initial of eggs, the same food, the same species.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
