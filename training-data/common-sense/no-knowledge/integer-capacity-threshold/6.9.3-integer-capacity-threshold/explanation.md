# Explanation 6.9.3 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 1020 × (1 + 15/100) = 1173 residents.
2. Dividing by the supply of one module gives 1173/80 = 14.6625, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 15 modules; 15 modules install 1200 residents, which covers the target with 27 residents to spare, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 1020 × (1 + 0.15) = 1173 residents.
2. The theoretical number of modules is 1173/80 = 14.66.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 15 modules. Installed capacity = 1200 residents, which is ≥ 1173.

## Result

**Answer.** At least 15 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
