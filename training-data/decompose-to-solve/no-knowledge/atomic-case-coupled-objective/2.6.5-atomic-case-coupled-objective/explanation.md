# Explanation 2.6.5 — Atomic Case: Coupled Objective

## Explanation

1. The scenario is preparing a software release, and the three quantities of each configuration are coupled by the rule fixed in advance: S = cost + 1×time − 2×quality.
2. For configuration A that gives 140 + 1×74 − 2×70 = 74.0, and for configuration B it gives 70 + 1×37 − 2×81 = -55.0.
3. Because the objective is one coupled expression, the honest formulation is a single optimization subproblem, not three separate cost, time, and quality problems whose winners are then voted on.
4. Configuration B therefore wins with -55.0 against 74.0.

## Result

**Answer.** This is intentionally a false-decomposition case. The best formulation is one optimization subproblem, not three independent choices. Configuration B wins because the predetermined combined score is -55.0 versus 74.0.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
