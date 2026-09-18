# Explanation 674 — Population balance in a town: case 4

## Explanation

1. Natural change compares births with deaths: 29 − 13 = +16.
2. Migration change compares people moving in with people moving out: 36 − 37 = -1.
3. The year-end population adds both components to the starting population of 1450, giving 1450 +16 -1 = 1465.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=29−13=16.
2. Migration change=36−37=-1.
3. Total change=16+-1=15.
4. End population=1450+15=1465.

## Result

**Answer.** Natural change +16; migration change -1; end population 1465.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
