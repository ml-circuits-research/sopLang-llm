# Explanation 924 — Population balance in a town: case 4

## Explanation

1. Natural change compares births with deaths: 29 − 14 = +15.
2. Migration change compares people moving in with people moving out: 38 − 37 = +1.
3. The year-end population adds both components to the starting population of 1550, giving 1550 +15 +1 = 1566.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=29−14=15.
2. Migration change=38−37=1.
3. Total change=15+1=16.
4. End population=1550+16=1566.

## Result

**Answer.** Natural change +15; migration change +1; end population 1566.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
