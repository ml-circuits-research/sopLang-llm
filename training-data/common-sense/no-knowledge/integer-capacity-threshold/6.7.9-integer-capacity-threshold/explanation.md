# Explanation 6.7.9 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 700 × (1 + 20/100) = 840 residents.
2. Dividing by the supply of one module gives 840/90 = 9.333333333333334, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 10 modules; 10 modules install 900 residents, which covers the target with 60 residents to spare, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 700 × (1 + 0.20) = 840 residents.
2. The theoretical number of modules is 840/90 = 9.33.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 10 modules. Installed capacity = 900 residents, which is ≥ 840.

## Result

**Answer.** At least 10 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
