# Explanation 6.4.5 — Budget and constraints

## Explanation

1. The fixed cost is unavoidable, so 1300 − 320 = 980 CU remain and whole units cost 45 CU each, so at most floor(980/45) = 21 units can be bought without the add-on.
2. With the module, 780 CU remain for units, so at most 17 units can be bought, and its 90 benefit points are added once.
3. A plan is valid only when it reaches the required 13 units, so any plan below that threshold is excluded before the benefit comparison.
4. Feasibility is checked before optimization: the reported plan is the feasible one with the larger benefit, and a tie is reported as the plan without the add-on.

Reference solution as printed in the source (template 4, 3 steps):

1. Without the add-on, 980 CU remain after the fixed cost, so at most floor((1300−320)/45) = 21 units can be bought. This meets the minimum of 13; benefit = 189.
2. With the add-on, 780 CU remain for units, so at most 17 units can be bought. This meets the minimum; benefit = 153 + 90 = 243.
3. Compare benefit only among feasible plans; any plan below the required unit threshold is excluded before optimization.

## Result

**Answer.** The optimal feasible plan uses the add-on: 17 units plus the module for 243 benefit points.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
