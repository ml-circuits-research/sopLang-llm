# Explanation 5.9.5 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 1200 × (1 + 25/100) = 1500 operations.
2. Dividing by the supply of one module gives 1500/80 = 18.75, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 19 modules; 19 modules install 1520 operations, which covers the target with 20 operations to spare, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 1200 × (1 + 0.25) = 1500 operations.
2. The theoretical number of modules is 1500/80 = 18.75.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 19 modules. Installed capacity = 1520 operations, which is ≥ 1500.

## Result

**Answer.** At least 19 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
