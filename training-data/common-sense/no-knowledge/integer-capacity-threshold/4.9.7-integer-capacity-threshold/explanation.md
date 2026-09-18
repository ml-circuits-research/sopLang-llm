# Explanation 4.9.7 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 520 × (1 + 20/100) = 624 measurements.
2. Dividing by the supply of one module gives 624/100 = 6.24, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 7 modules; 7 modules install 700 measurements, which covers the target with 76 measurements to spare, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 520 × (1 + 0.20) = 624 measurements.
2. The theoretical number of modules is 624/100 = 6.24.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 7 modules. Installed capacity = 700 measurements, which is ≥ 624.

## Result

**Answer.** At least 7 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
