# Explanation 8.7.5 — Atomic Case: Coupled Objective

## Explanation

1. The scenario is assigning permissions in a small organization, and the three quantities of each configuration are coupled by the rule fixed in advance: S = cost + 1.5×time − 2×quality.
2. For configuration A that gives 130 + 1.5×56 − 2×70 = 74.0, and for configuration B it gives 139 + 1.5×37 − 2×86 = 22.5.
3. Because the objective is one coupled expression, the honest formulation is a single optimization subproblem, not three separate cost, time, and quality problems whose winners are then voted on.
4. Configuration B therefore wins with 22.5 against 74.0.

## Result

**Answer.** This is intentionally a false-decomposition case. The best formulation is one optimization subproblem, not three independent choices. Configuration B wins because the predetermined combined score is 22.5 versus 74.0.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
