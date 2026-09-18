# Explanation 1.5.5 — Atomic Case: Coupled Objective

## Explanation

1. The scenario is choosing between service plans with different constraints, and the three quantities of each configuration are coupled by the rule fixed in advance: S = cost + 1×time − 2×quality.
2. For configuration A that gives 123 + 1×41 − 2×74 = 16.0, and for configuration B it gives 96 + 1×42 − 2×76 = -14.0.
3. Because the objective is one coupled expression, the honest formulation is a single optimization subproblem, not three separate cost, time, and quality problems whose winners are then voted on.
4. Configuration B therefore wins with -14.0 against 16.0.

## Result

**Answer.** This is intentionally a false-decomposition case. The best formulation is one optimization subproblem, not three independent choices. Configuration B wins because the predetermined combined score is -14.0 versus 16.0.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
