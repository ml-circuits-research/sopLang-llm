# Explanation 3.9.5 — Atomic Case: Coupled Objective

## Explanation

1. The scenario is planning a non-medical sports training schedule, and the three quantities of each configuration are coupled by the rule fixed in advance: S = cost + 1.5×time − 3×quality.
2. For configuration A that gives 85 + 1.5×39 − 3×72 = -72.5, and for configuration B it gives 100 + 1.5×53 − 3×87 = -81.5.
3. Because the objective is one coupled expression, the honest formulation is a single optimization subproblem, not three separate cost, time, and quality problems whose winners are then voted on.
4. Configuration B therefore wins with -81.5 against -72.5.

## Result

**Answer.** This is intentionally a false-decomposition case. The best formulation is one optimization subproblem, not three independent choices. Configuration B wins because the predetermined combined score is -81.5 versus -72.5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
