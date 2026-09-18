# Explanation 422 — Population balance in a town: case 2

## Explanation

1. Natural change compares births with deaths: 23 − 12 = +11.
2. Migration change compares people moving in with people moving out: 34 − 29 = +5.
3. The year-end population adds both components to the starting population of 1250, giving 1250 +11 +5 = 1266.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=23−12=11.
2. Migration change=34−29=5.
3. Total change=11+5=16.
4. End population=1250+16=1266.

## Result

**Answer.** Natural change +11; migration change +5; end population 1266.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
