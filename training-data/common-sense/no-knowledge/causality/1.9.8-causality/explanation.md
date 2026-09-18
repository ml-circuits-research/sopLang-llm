# Explanation 1.9.8 — Causality

## Explanation

1. The first four weeks are observational: X and better outcomes occur together, but X is used mainly when staffing is complete, so staffing is complete is a plausible confounder that travels with X and the association alone cannot separate them.
2. Randomly assigning 40 comparable cases (20 to X, 20 to the usual procedure) under the same team and stated conditions is meant to distribute known and unknown factors more evenly between the groups.
3. The reported success rates are 15/20 = 75.0% with X and 11/20 = 55.0% in control, so within this model the difference is more plausibly attributed to X than to staffing.
4. One small experiment can still be moved by random variation and applies only to comparable settings, so the justified conclusion is stronger causal evidence, not absolute proof.

Reference solution as printed in the source (template 12, 4 steps):

1. In the observational data, X and better outcomes occur together, but X also coincides with complete staffing. Staffing is therefore a plausible confounder.
2. Random assignment is intended to distribute known and unknown factors more evenly between the later groups, while the stated operating conditions are held constant.
3. The observed success rates are 15/20 = 75.0% with X and 11/20 = 55.0% in control, so the difference is more plausibly attributed to X within this model.
4. A single small experiment can still be affected by random variation and limited generalizability; the justified conclusion is stronger causal evidence, not absolute proof.

## Result

**Answer.** The first four weeks provide correlational evidence; the randomized comparison provides stronger causal evidence, but not absolute certainty.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
