# Explanation 3.2.10 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 1020 × (1 + 25/100) = 1275 participants.
2. Dividing by the supply of one module gives 1275/70 = 18.214285714285715, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 19 modules; 19 modules install 1330 participants, which covers the target with 55 participants to spare, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 1020 × (1 + 0.25) = 1275 participants.
2. The theoretical number of modules is 1275/70 = 18.21.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 19 modules. Installed capacity = 1330 participants, which is ≥ 1275.

## Result

**Answer.** At least 19 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
