# Explanation 4.4.5 — Atomic Case: Coupled Objective

## Explanation

1. The scenario is planning an optics demonstration, and the three quantities of each configuration are coupled by the rule fixed in advance: S = cost + 1.5×time − 3×quality.
2. For configuration A that gives 146 + 1.5×75 − 3×85 = 3.5, and for configuration B it gives 108 + 1.5×54 − 3×84 = -63.0.
3. Because the objective is one coupled expression, the honest formulation is a single optimization subproblem, not three separate cost, time, and quality problems whose winners are then voted on.
4. Configuration B therefore wins with -63.0 against 3.5.

## Result

**Answer.** This is intentionally a false-decomposition case. The best formulation is one optimization subproblem, not three independent choices. Configuration B wins because the predetermined combined score is -63.0 versus 3.5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
