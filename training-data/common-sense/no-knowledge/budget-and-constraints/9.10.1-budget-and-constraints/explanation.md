# Explanation 9.10.1 — Budget and constraints

## Explanation

1. The fixed cost is unavoidable, so 1000 − 270 = 730 CU remain and whole units cost 35 CU each, so at most floor(730/35) = 20 units can be bought without the add-on.
2. With the module, 480 CU remain for units, so at most 13 units can be bought, and its 70 benefit points are added once.
3. A plan is valid only when it reaches the required 13 units, so any plan below that threshold is excluded before the benefit comparison.
4. Feasibility is checked before optimization: the reported plan is the feasible one with the larger benefit, and a tie is reported as the plan without the add-on.

Reference solution as printed in the source (template 4, 3 steps):

1. Without the add-on, 730 CU remain after the fixed cost, so at most floor((1000−270)/35) = 20 units can be bought. This meets the minimum of 13; benefit = 280.
2. With the add-on, 480 CU remain for units, so at most 13 units can be bought. This meets the minimum; benefit = 182 + 70 = 252.
3. Compare benefit only among feasible plans; any plan below the required unit threshold is excluded before optimization.

## Result

**Answer.** The optimal feasible plan is without the add-on: 20 units for 280 benefit points.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
