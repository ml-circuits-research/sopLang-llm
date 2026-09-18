# Explanation 173 — Population balance in a town: case 3

## Explanation

1. Natural change compares births with deaths: 26 − 11 = +15.
2. Migration change compares people moving in with people moving out: 32 − 33 = -1.
3. The year-end population adds both components to the starting population of 1200, giving 1200 +15 -1 = 1214.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=26−11=15.
2. Migration change=32−33=-1.
3. Total change=15+-1=14.
4. End population=1200+14=1214.

## Result

**Answer.** Natural change +15; migration change -1; end population 1214.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
