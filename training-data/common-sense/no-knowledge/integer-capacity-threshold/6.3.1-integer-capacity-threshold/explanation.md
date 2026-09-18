# Explanation 6.3.1 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 620 × (1 + 15/100) = 713 residents.
2. Dividing by the supply of one module gives 713/120 = 5.941666666666666, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 6 modules; 6 modules install 720 residents, which covers the target with 7 residents to spare, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 620 × (1 + 0.15) = 713 residents.
2. The theoretical number of modules is 713/120 = 5.94.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 6 modules. Installed capacity = 720 residents, which is ≥ 713.

## Result

**Answer.** At least 6 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
