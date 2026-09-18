# Explanation 921 — Population balance in a town: case 1

## Explanation

1. Natural change compares births with deaths: 20 − 14 = +6.
2. Migration change compares people moving in with people moving out: 38 − 25 = +13.
3. The year-end population adds both components to the starting population of 1400, giving 1400 +6 +13 = 1419.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=20−14=6.
2. Migration change=38−25=13.
3. Total change=6+13=19.
4. End population=1400+19=1419.

## Result

**Answer.** Natural change +6; migration change +13; end population 1419.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
