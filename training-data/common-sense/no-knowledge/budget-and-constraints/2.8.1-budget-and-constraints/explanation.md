# Explanation 2.8.1 — Budget and constraints

## Explanation

1. The fixed cost is unavoidable, so 900 − 250 = 650 CU remain and whole units cost 45 CU each, so at most floor(650/45) = 14 units can be bought without the add-on.
2. With the module, 430 CU remain for units, so at most 9 units can be bought, and its 120 benefit points are added once.
3. A plan is valid only when it reaches the required 18 units, so any plan below that threshold is excluded before the benefit comparison.
4. With both maxima below the requirement, no feasible plan exists and the answer reports the two maxima.

Reference solution as printed in the source (template 4, 2 steps):

1. Without the add-on, 650 CU remain after the fixed cost, so at most floor((900−250)/45) = 14 units can be bought. This does not meet the minimum of 18;
2. With the add-on, 430 CU remain for units, so at most 9 units can be bought. This does not meet the minimum;

## Result

**Answer.** Neither plan is feasible: the maximum is 14 units without the add-on and 9 with it, both below the required 18.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
