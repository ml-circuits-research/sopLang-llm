# Explanation 423 — Population balance in a town: case 3

## Explanation

1. Natural change compares births with deaths: 26 − 12 = +14.
2. Migration change compares people moving in with people moving out: 34 − 33 = +1.
3. The year-end population adds both components to the starting population of 1300, giving 1300 +14 +1 = 1315.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=26−12=14.
2. Migration change=34−33=1.
3. Total change=14+1=15.
4. End population=1300+15=1315.

## Result

**Answer.** Natural change +14; migration change +1; end population 1315.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
