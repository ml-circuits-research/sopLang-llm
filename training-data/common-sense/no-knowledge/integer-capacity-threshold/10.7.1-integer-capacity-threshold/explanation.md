# Explanation 10.7.1 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 1140 × (1 + 20/100) = 1368 beneficiaries.
2. Dividing by the supply of one module gives 1368/90 = 15.2, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 16 modules; 16 modules install 1440 beneficiaries, which covers the target with 72 beneficiaries to spare, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 1140 × (1 + 0.20) = 1368 beneficiaries.
2. The theoretical number of modules is 1368/90 = 15.2.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 16 modules. Installed capacity = 1440 beneficiaries, which is ≥ 1368.

## Result

**Answer.** At least 16 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
