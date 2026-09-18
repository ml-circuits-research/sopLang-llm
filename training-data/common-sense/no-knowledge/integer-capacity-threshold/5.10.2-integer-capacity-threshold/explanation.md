# Explanation 5.10.2 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 620 × (1 + 20/100) = 744 operations.
2. Dividing by the supply of one module gives 744/80 = 9.3, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 10 modules; 10 modules install 800 operations, which covers the target with 56 operations to spare, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 620 × (1 + 0.20) = 744 operations.
2. The theoretical number of modules is 744/80 = 9.3.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 10 modules. Installed capacity = 800 operations, which is ≥ 744.

## Result

**Answer.** At least 10 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
