# Explanation 1.10.10 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 1100 × (1 + 25/100) = 1375 cases.
2. Dividing by the supply of one module gives 1375/90 = 15.277777777777779, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 16 modules; 16 modules install 1440 cases, which covers the target with 65 cases to spare, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 1100 × (1 + 0.25) = 1375 cases.
2. The theoretical number of modules is 1375/90 = 15.28.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 16 modules. Installed capacity = 1440 cases, which is ≥ 1375.

## Result

**Answer.** At least 16 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
