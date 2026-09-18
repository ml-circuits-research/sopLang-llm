# Explanation 1.4.8 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 820 × (1 + 15/100) = 943 cases.
2. Dividing by the supply of one module gives 943/80 = 11.7875, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 12 modules; 12 modules install 960 cases, which covers the target with 17 cases to spare, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 820 × (1 + 0.15) = 943 cases.
2. The theoretical number of modules is 943/80 = 11.79.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 12 modules. Installed capacity = 960 cases, which is ≥ 943.

## Result

**Answer.** At least 12 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
