# Explanation 2.5.3 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 580 × (1 + 25/100) = 725 units.
2. Dividing by the supply of one module gives 725/100 = 7.25, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 8 modules; 8 modules install 800 units, which covers the target with 75 units to spare, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 580 × (1 + 0.25) = 725 units.
2. The theoretical number of modules is 725/100 = 7.25.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 8 modules. Installed capacity = 800 units, which is ≥ 725.

## Result

**Answer.** At least 8 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
