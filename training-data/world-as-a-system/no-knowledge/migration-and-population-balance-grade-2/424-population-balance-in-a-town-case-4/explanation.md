# Explanation 424 — Population balance in a town: case 4

## Explanation

1. Natural change compares births with deaths: 29 − 12 = +17.
2. Migration change compares people moving in with people moving out: 34 − 37 = -3.
3. The year-end population adds both components to the starting population of 1350, giving 1350 +17 -3 = 1364.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=29−12=17.
2. Migration change=34−37=-3.
3. Total change=17+-3=14.
4. End population=1350+14=1364.

## Result

**Answer.** Natural change +17; migration change -3; end population 1364.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
