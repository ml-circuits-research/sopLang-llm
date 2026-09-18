# Explanation 174 — Population balance in a town: case 4

## Explanation

1. Natural change compares births with deaths: 29 − 11 = +18.
2. Migration change compares people moving in with people moving out: 32 − 37 = -5.
3. The year-end population adds both components to the starting population of 1250, giving 1250 +18 -5 = 1263.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=29−11=18.
2. Migration change=32−37=-5.
3. Total change=18+-5=13.
4. End population=1250+13=1263.

## Result

**Answer.** Natural change +18; migration change -5; end population 1263.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
