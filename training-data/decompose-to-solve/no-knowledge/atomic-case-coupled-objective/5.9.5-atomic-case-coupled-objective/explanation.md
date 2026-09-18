# Explanation 5.9.5 — Atomic Case: Coupled Objective

## Explanation

1. The scenario is interpreting a basic hazard scenario, and the three quantities of each configuration are coupled by the rule fixed in advance: S = cost + 1×time − 2×quality.
2. For configuration A that gives 87 + 1×57 − 2×95 = -46.0, and for configuration B it gives 131 + 1×39 − 2×96 = -22.0.
3. Because the objective is one coupled expression, the honest formulation is a single optimization subproblem, not three separate cost, time, and quality problems whose winners are then voted on.
4. Configuration A therefore wins with -46.0 against -22.0.

## Result

**Answer.** This is intentionally a false-decomposition case. The best formulation is one optimization subproblem, not three independent choices. Configuration A wins because the predetermined combined score is -46.0 versus -22.0.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
