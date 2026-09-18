# Explanation 6.2.1 — Marginal allocation

## Explanation

1. Each program's marginal benefits fall as its units are added, so a unit is taken only when every earlier unit of that program is taken; the feasible allocations are the triples of the stated 6 resource units that respect those four-step ladders (A: 13, 11, 9, 7; B: 15, 13, 11, 9; C: 19, 17, 15, 13).
2. The best allocation gives each unit the largest marginal benefit still available, which is the optimum A=0, B=2, C=4 with a total benefit of 92 points.
3. Equal marginal benefits make 3 allocations reach the same total, so the reported optimum is one member of a tie set rather than the only answer.
4. Taking a later unit without its earlier units would break the ordering rule, and adding marginal benefits across programs before ordering them would ignore which units are actually available.

Reference solution as printed in the source (template 14, 4 steps):

1. Because each program's marginal benefits are non-increasing, each successive unit is an opportunity that becomes available only after earlier units in that program are chosen.
2. Evaluate feasible allocations totaling 6 units (equivalently, repeatedly take a highest available marginal benefit). One optimum is A=0, B=2, C=4.
3. The selected benefits sum to 92 points. The ordering rule is respected because every selected later unit includes all earlier units in the same program.
4. Ties in marginal benefits can create more than one optimal allocation; equal total benefit does not imply a unique allocation.

## Result

**Answer.** One optimal allocation is A=0, B=2, C=4, with 92 points. There are 3 tied optimal allocations.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
