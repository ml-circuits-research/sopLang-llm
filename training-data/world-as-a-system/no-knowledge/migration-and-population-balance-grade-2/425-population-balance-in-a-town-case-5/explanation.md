# Explanation 425 — Population balance in a town: case 5

## Explanation

1. Natural change compares births with deaths: 32 − 12 = +20.
2. Migration change compares people moving in with people moving out: 34 − 41 = -7.
3. The year-end population adds both components to the starting population of 1400, giving 1400 +20 -7 = 1413.

Reference solution as printed in the source (family N10, 4 steps):

1. Natural change=32−12=20.
2. Migration change=34−41=-7.
3. Total change=20+-7=13.
4. End population=1400+13=1413.

## Result

**Answer.** Natural change +20; migration change -7; end population 1413.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
