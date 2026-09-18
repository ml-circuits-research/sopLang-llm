# Explanation 7.2.2 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 980 × (1 + 25/100) = 1225 service units.
2. Dividing by the supply of one module gives 1225/70 = 17.5, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 18 modules; 18 modules install 1260 service units, which covers the target with 35 service units to spare, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 980 × (1 + 0.25) = 1225 service units.
2. The theoretical number of modules is 1225/70 = 17.5.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 18 modules. Installed capacity = 1260 service units, which is ≥ 1225.

## Result

**Answer.** At least 18 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
