# Explanation 175 — Population balance in a town: case 5

## Explanation

1. Natural change compares births with deaths: 32 − 11 = +21.
2. Migration change compares people moving in with people moving out: 32 − 41 = -9.
3. The year-end population adds both components to the starting population of 1300, giving 1300 +21 -9 = 1312.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=32−11=21.
2. Migration change=32−41=-9.
3. Total change=21+-9=12.
4. End population=1300+12=1312.

## Result

**Answer.** Natural change +21; migration change -9; end population 1312.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
