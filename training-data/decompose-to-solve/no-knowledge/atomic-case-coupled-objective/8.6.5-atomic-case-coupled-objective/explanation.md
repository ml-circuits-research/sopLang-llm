# Explanation 8.6.5 — Atomic Case: Coupled Objective

## Explanation

1. The scenario is designing a data-collection workflow, and the three quantities of each configuration are coupled by the rule fixed in advance: S = cost + 2×time − 3×quality.
2. For configuration A that gives 129 + 2×47 − 3×77 = -8.0, and for configuration B it gives 137 + 2×66 − 3×82 = 23.0.
3. Because the objective is one coupled expression, the honest formulation is a single optimization subproblem, not three separate cost, time, and quality problems whose winners are then voted on.
4. Configuration A therefore wins with -8.0 against 23.0.

## Result

**Answer.** This is intentionally a false-decomposition case. The best formulation is one optimization subproblem, not three independent choices. Configuration A wins because the predetermined combined score is -8.0 versus 23.0.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
