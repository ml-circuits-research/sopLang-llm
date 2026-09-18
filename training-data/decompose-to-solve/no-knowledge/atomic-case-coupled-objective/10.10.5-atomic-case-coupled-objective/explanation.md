# Explanation 10.10.5 — Atomic Case: Coupled Objective

## Explanation

1. The scenario is coordinating a conference and publication workflow, and the three quantities of each configuration are coupled by the rule fixed in advance: S = cost + 1.5×time − 3×quality.
2. For configuration A that gives 113 + 1.5×48 − 3×93 = -94.0, and for configuration B it gives 98 + 1.5×47 − 3×87 = -92.5.
3. Because the objective is one coupled expression, the honest formulation is a single optimization subproblem, not three separate cost, time, and quality problems whose winners are then voted on.
4. Configuration A therefore wins with -94.0 against -92.5.

## Result

**Answer.** This is intentionally a false-decomposition case. The best formulation is one optimization subproblem, not three independent choices. Configuration A wins because the predetermined combined score is -94.0 versus -92.5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
