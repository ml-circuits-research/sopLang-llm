# Explanation 923 — Population balance in a town: case 3

## Explanation

1. Natural change compares births with deaths: 26 − 14 = +12.
2. Migration change compares people moving in with people moving out: 38 − 33 = +5.
3. The year-end population adds both components to the starting population of 1500, giving 1500 +12 +5 = 1517.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=26−14=12.
2. Migration change=38−33=5.
3. Total change=12+5=17.
4. End population=1500+17=1517.

## Result

**Answer.** Natural change +12; migration change +5; end population 1517.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
