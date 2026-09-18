# Explanation 4.10.5 — Atomic Case: Coupled Objective

## Explanation

1. The scenario is combining repeated measurements, and the three quantities of each configuration are coupled by the rule fixed in advance: S = cost + 1×time − 3×quality.
2. For configuration A that gives 94 + 1×67 − 3×82 = -85.0, and for configuration B it gives 135 + 1×45 − 3×73 = -39.0.
3. Because the objective is one coupled expression, the honest formulation is a single optimization subproblem, not three separate cost, time, and quality problems whose winners are then voted on.
4. Configuration A therefore wins with -85.0 against -39.0.

## Result

**Answer.** This is intentionally a false-decomposition case. The best formulation is one optimization subproblem, not three independent choices. Configuration A wins because the predetermined combined score is -85.0 versus -39.0.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
