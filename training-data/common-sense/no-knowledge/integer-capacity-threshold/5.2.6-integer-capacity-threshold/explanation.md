# Explanation 5.2.6 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 660 × (1 + 10/100) = 726 operations.
2. Dividing by the supply of one module gives 726/70 = 10.371428571428572, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 11 modules; 11 modules install 770 operations, which covers the target with 44 operations to spare, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 660 × (1 + 0.10) = 726 operations.
2. The theoretical number of modules is 726/70 = 10.37.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 11 modules. Installed capacity = 770 operations, which is ≥ 726.

## Result

**Answer.** At least 11 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
