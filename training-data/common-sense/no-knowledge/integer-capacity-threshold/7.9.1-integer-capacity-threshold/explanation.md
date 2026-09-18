# Explanation 7.9.1 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 1000 × (1 + 25/100) = 1250 service units.
2. Dividing by the supply of one module gives 1250/100 = 12.5, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 13 modules; 13 modules install 1300 service units, which covers the target with 50 service units to spare, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 1000 × (1 + 0.25) = 1250 service units.
2. The theoretical number of modules is 1250/100 = 12.5.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 13 modules. Installed capacity = 1300 service units, which is ≥ 1250.

## Result

**Answer.** At least 13 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
