# Explanation 2.10.5 — Atomic Case: Coupled Objective

## Explanation

1. The scenario is planning a staged evacuation exercise, and the three quantities of each configuration are coupled by the rule fixed in advance: S = cost + 1.5×time − 2×quality.
2. For configuration A that gives 93 + 1.5×65 − 2×71 = 48.5, and for configuration B it gives 92 + 1.5×59 − 2×93 = -5.5.
3. Because the objective is one coupled expression, the honest formulation is a single optimization subproblem, not three separate cost, time, and quality problems whose winners are then voted on.
4. Configuration B therefore wins with -5.5 against 48.5.

## Result

**Answer.** This is intentionally a false-decomposition case. The best formulation is one optimization subproblem, not three independent choices. Configuration B wins because the predetermined combined score is -5.5 versus 48.5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
