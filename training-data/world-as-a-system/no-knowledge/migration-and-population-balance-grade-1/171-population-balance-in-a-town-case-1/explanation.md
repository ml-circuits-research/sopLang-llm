# Explanation 171 — Population balance in a town: case 1

## Explanation

1. Natural change compares births with deaths: 20 − 11 = +9.
2. Migration change compares people moving in with people moving out: 32 − 25 = +7.
3. The year-end population adds both components to the starting population of 1100, giving 1100 +9 +7 = 1116.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=20−11=9.
2. Migration change=32−25=7.
3. Total change=9+7=16.
4. End population=1100+16=1116.

## Result

**Answer.** Natural change +9; migration change +7; end population 1116.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
