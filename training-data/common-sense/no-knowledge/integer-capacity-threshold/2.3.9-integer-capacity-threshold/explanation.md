# Explanation 2.3.9 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 900 × (1 + 15/100) = 1035 units.
2. Dividing by the supply of one module gives 1035/100 = 10.35, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 11 modules; 11 modules install 1100 units, which covers the target with 65 units to spare, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 900 × (1 + 0.15) = 1035 units.
2. The theoretical number of modules is 1035/100 = 10.35.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 11 modules. Installed capacity = 1100 units, which is ≥ 1035.

## Result

**Answer.** At least 11 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
