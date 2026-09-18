# Explanation 675 — Population balance in a town: case 5

## Explanation

1. Natural change compares births with deaths: 32 − 13 = +19.
2. Migration change compares people moving in with people moving out: 36 − 41 = -5.
3. The year-end population adds both components to the starting population of 1500, giving 1500 +19 -5 = 1514.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=32−13=19.
2. Migration change=36−41=-5.
3. Total change=19+-5=14.
4. End population=1500+14=1514.

## Result

**Answer.** Natural change +19; migration change -5; end population 1514.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
