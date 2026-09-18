# Explanation 421 — Population balance in a town: case 1

## Explanation

1. Natural change compares births with deaths: 20 − 12 = +8.
2. Migration change compares people moving in with people moving out: 34 − 25 = +9.
3. The year-end population adds both components to the starting population of 1200, giving 1200 +8 +9 = 1217.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=20−12=8.
2. Migration change=34−25=9.
3. Total change=8+9=17.
4. End population=1200+17=1217.

## Result

**Answer.** Natural change +8; migration change +9; end population 1217.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
