# Explanation 6.2.4 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 800 × (1 + 20/100) = 960 residents.
2. Dividing by the supply of one module gives 960/80 = 12, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 12 modules; 12 modules install 960 residents, which covers the target exactly, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 800 × (1 + 0.20) = 960 residents.
2. The theoretical number of modules is 960/80 = 12.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 12 modules. Installed capacity = 960 residents, which is ≥ 960.

## Result

**Answer.** At least 12 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
