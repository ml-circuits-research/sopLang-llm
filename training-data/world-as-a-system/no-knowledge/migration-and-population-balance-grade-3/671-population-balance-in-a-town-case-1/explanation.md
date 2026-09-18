# Explanation 671 — Population balance in a town: case 1

## Explanation

1. Natural change compares births with deaths: 20 − 13 = +7.
2. Migration change compares people moving in with people moving out: 36 − 25 = +11.
3. The year-end population adds both components to the starting population of 1300, giving 1300 +7 +11 = 1318.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=20−13=7.
2. Migration change=36−25=11.
3. Total change=7+11=18.
4. End population=1300+18=1318.

## Result

**Answer.** Natural change +7; migration change +11; end population 1318.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
