# Explanation 925 — Population balance in a town: case 5

## Explanation

1. Natural change compares births with deaths: 32 − 14 = +18.
2. Migration change compares people moving in with people moving out: 38 − 41 = -3.
3. The year-end population adds both components to the starting population of 1600, giving 1600 +18 -3 = 1615.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=32−14=18.
2. Migration change=38−41=-3.
3. Total change=18+-3=15.
4. End population=1600+15=1615.

## Result

**Answer.** Natural change +18; migration change -3; end population 1615.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
