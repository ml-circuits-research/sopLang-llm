# Explanation 1.4.5 — Marginal allocation

## Explanation

1. Each program's marginal benefits fall as its units are added, so a unit is taken only when every earlier unit of that program is taken; the feasible allocations are the triples of the stated 6 resource units that respect those four-step ladders (A: 20, 17, 14, 11; B: 17, 14, 11, 8; C: 14, 12, 10, 8).
2. The best allocation gives each unit the largest marginal benefit still available, which is the optimum A=3, B=2, C=1 with a total benefit of 96 points.
3. No other allocation of the stated units reaches that total, so the optimum is unique.
4. Taking a later unit without its earlier units would break the ordering rule, and adding marginal benefits across programs before ordering them would ignore which units are actually available.

Reference solution as printed in the source (template 14, 3 steps):

1. Because each program's marginal benefits are non-increasing, each successive unit is an opportunity that becomes available only after earlier units in that program are chosen.
2. Evaluate feasible allocations totaling 6 units (equivalently, repeatedly take a highest available marginal benefit). One optimum is A=3, B=2, C=1.
3. The selected benefits sum to 96 points. The ordering rule is respected because every selected later unit includes all earlier units in the same program.

## Result

**Answer.** A=3, B=2, C=1; maximum total benefit = 96 points.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
