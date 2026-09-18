# Explanation 172 — Population balance in a town: case 2

## Explanation

1. Natural change compares births with deaths: 23 − 11 = +12.
2. Migration change compares people moving in with people moving out: 32 − 29 = +3.
3. The year-end population adds both components to the starting population of 1150, giving 1150 +12 +3 = 1165.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=23−11=12.
2. Migration change=32−29=3.
3. Total change=12+3=15.
4. End population=1150+15=1165.

## Result

**Answer.** Natural change +12; migration change +3; end population 1165.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
