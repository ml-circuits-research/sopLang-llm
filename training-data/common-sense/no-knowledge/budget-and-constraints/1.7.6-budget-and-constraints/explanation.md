# Explanation 1.7.6 — Budget and constraints

## Explanation

1. The fixed cost is unavoidable, so 1000 − 270 = 730 CU remain and whole units cost 55 CU each, so at most floor(730/55) = 13 units can be bought without the add-on.
2. With the module, 490 CU remain for units, so at most 8 units can be bought, and its 80 benefit points are added once.
3. A plan is valid only when it reaches the required 15 units, so any plan below that threshold is excluded before the benefit comparison.
4. With both maxima below the requirement, no feasible plan exists and the answer reports the two maxima.

Reference solution as printed in the source (template 4, 2 steps):

1. Without the add-on, 730 CU remain after the fixed cost, so at most floor((1000−270)/55) = 13 units can be bought. This does not meet the minimum of 15;
2. With the add-on, 490 CU remain for units, so at most 8 units can be bought. This does not meet the minimum;

## Result

**Answer.** Neither plan is feasible: the maximum is 13 units without the add-on and 8 with it, both below the required 15.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
