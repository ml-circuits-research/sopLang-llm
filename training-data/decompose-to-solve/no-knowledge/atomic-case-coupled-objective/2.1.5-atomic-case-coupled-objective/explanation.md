# Explanation 2.1.5 — Atomic Case: Coupled Objective

## Explanation

1. The scenario is planning a multi-leg rail or air journey, and the three quantities of each configuration are coupled by the rule fixed in advance: S = cost + 2×time − 3×quality.
2. For configuration A that gives 108 + 2×54 − 3×85 = -39.0, and for configuration B it gives 111 + 2×40 − 3×82 = -55.0.
3. Because the objective is one coupled expression, the honest formulation is a single optimization subproblem, not three separate cost, time, and quality problems whose winners are then voted on.
4. Configuration B therefore wins with -55.0 against -39.0.
5. This is intentionally a false-decomposition case. The best formulation is one optimization subproblem, not three independent choices.

**Source answer.** This is intentionally a false-decomposition case. The best formulation is one optimization subproblem, not three independent choices. Configuration B wins because the predetermined combined score is -55.0 versus -39.0. — the source prints the answer in a prose sentence; the shipped answer keeps only the value-bearing tokens, and the removed prose moves into the explanation. The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** Configuration B wins: -55.0 versus -39.0.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
