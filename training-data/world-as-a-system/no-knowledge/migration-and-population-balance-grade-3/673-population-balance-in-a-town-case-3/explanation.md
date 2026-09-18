# Explanation 673 — Population balance in a town: case 3

## Explanation

1. Natural change compares births with deaths: 26 − 13 = +13.
2. Migration change compares people moving in with people moving out: 36 − 33 = +3.
3. The year-end population adds both components to the starting population of 1400, giving 1400 +13 +3 = 1416.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=26−13=13.
2. Migration change=36−33=3.
3. Total change=13+3=16.
4. End population=1400+16=1416.

## Result

**Answer.** Natural change +13; migration change +3; end population 1416.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
