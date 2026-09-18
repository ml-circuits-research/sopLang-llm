# Explanation 4.3.5 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 980 × (1 + 20/100) = 1176 measurements.
2. Dividing by the supply of one module gives 1176/90 = 13.066666666666666, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 14 modules; 14 modules install 1260 measurements, which covers the target with 84 measurements to spare, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 980 × (1 + 0.20) = 1176 measurements.
2. The theoretical number of modules is 1176/90 = 13.07.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 14 modules. Installed capacity = 1260 measurements, which is ≥ 1176.

## Result

**Answer.** At least 14 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
