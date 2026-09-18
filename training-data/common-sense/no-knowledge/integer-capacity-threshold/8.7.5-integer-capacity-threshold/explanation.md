# Explanation 8.7.5 — Integer capacity threshold

## Explanation

1. The reserve must exist physically, so the target capacity is the demand grossed up by the reserve: 840 × (1 + 15/100) = 966 documents.
2. Dividing by the supply of one module gives 966/120 = 8.05, the theoretical module count.
3. Modules are indivisible and the target is a minimum, so the ratio is rounded up to 9 modules; 9 modules install 1080 documents, which covers the target with 114 documents to spare, while one module fewer would fall short.
4. Rounding the ratio down would leave the reserve on average only, and the rule requires the capacity to exist in whole modules.

Reference solution as printed in the source (template 17, 3 steps):

1. Target capacity = 840 × (1 + 0.15) = 966 documents.
2. The theoretical number of modules is 966/120 = 8.05.
3. Modules are indivisible and the target is a minimum, so take the ceiling: 9 modules. Installed capacity = 1080 documents, which is ≥ 966.

## Result

**Answer.** At least 9 modules are required.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
