# Explanation 10.1.5 — Atomic Case: Coupled Objective

## Explanation

1. The scenario is planning a city festival with transport, energy, waste, and scheduling constraints, and the three quantities of each configuration are coupled by the rule fixed in advance: S = cost + 1.5×time − 3×quality.
2. For configuration A that gives 108 + 1.5×73 − 3×73 = -1.5, and for configuration B it gives 107 + 1.5×70 − 3×93 = -67.0.
3. Because the objective is one coupled expression, the honest formulation is a single optimization subproblem, not three separate cost, time, and quality problems whose winners are then voted on.
4. Configuration B therefore wins with -67.0 against -1.5.

## Result

**Answer.** This is intentionally a false-decomposition case. The best formulation is one optimization subproblem, not three independent choices. Configuration B wins because the predetermined combined score is -67.0 versus -1.5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
