# Explanation 8.10.5 — Atomic Case: Coupled Objective

## Explanation

1. The scenario is diagnosing a service incident, and the three quantities of each configuration are coupled by the rule fixed in advance: S = cost + 1.5×time − 2×quality.
2. For configuration A that gives 133 + 1.5×62 − 2×87 = 52.0, and for configuration B it gives 75 + 1.5×42 − 2×92 = -46.0.
3. Because the objective is one coupled expression, the honest formulation is a single optimization subproblem, not three separate cost, time, and quality problems whose winners are then voted on.
4. Configuration B therefore wins with -46.0 against 52.0.

## Result

**Answer.** This is intentionally a false-decomposition case. The best formulation is one optimization subproblem, not three independent choices. Configuration B wins because the predetermined combined score is -46.0 versus 52.0.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
