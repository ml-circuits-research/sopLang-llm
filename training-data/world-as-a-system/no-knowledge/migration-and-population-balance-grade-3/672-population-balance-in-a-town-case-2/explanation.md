# Explanation 672 — Population balance in a town: case 2

## Explanation

1. Natural change compares births with deaths: 23 − 13 = +10.
2. Migration change compares people moving in with people moving out: 36 − 29 = +7.
3. The year-end population adds both components to the starting population of 1350, giving 1350 +10 +7 = 1367.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=23−13=10.
2. Migration change=36−29=7.
3. Total change=10+7=17.
4. End population=1350+17=1367.

## Result

**Answer.** Natural change +10; migration change +7; end population 1367.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
