# Explanation 5.4.5 — Atomic Case: Coupled Objective

## Explanation

1. The scenario is planning communication across time zones, and the three quantities of each configuration are coupled by the rule fixed in advance: S = cost + 1.5×time − 3×quality.
2. For configuration A that gives 85 + 1.5×58 − 3×87 = -89.0, and for configuration B it gives 130 + 1.5×65 − 3×88 = -36.5.
3. Because the objective is one coupled expression, the honest formulation is a single optimization subproblem, not three separate cost, time, and quality problems whose winners are then voted on.
4. Configuration A therefore wins with -89.0 against -36.5.

## Result

**Answer.** This is intentionally a false-decomposition case. The best formulation is one optimization subproblem, not three independent choices. Configuration A wins because the predetermined combined score is -89.0 versus -36.5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
