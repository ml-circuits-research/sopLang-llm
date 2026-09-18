# Explanation 3.5.1 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 1080 × (1 + 25/100) = 1350 participants.
2. Dividing by the supply of one module gives 1350/70 = 19.285714285714285, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 20 modules; 20 modules install 1400 participants, which covers the target with 50 participants to spare, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 1080 × (1 + 0.25) = 1350 participants.
2. The theoretical number of modules is 1350/70 = 19.29.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 20 modules. Installed capacity = 1400 participants, which is ≥ 1350.

## Result

**Answer.** At least 20 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
