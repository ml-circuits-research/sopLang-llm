# Explanation 393 — Reservoir stock and flow: case 3

## Explanation

1. The daily net change is the inflow minus the outflow: 7 - 5 = 2 unit(s) per day.
2. Over 4 day(s) that net change accumulates to 4 times 2 = 8 unit(s).
3. Adding the accumulated change to the starting stock 36 gives 44 unit(s).
4. The stock is increasing because the daily net change is positive.

Reference solution as printed in the source (family N4, 3 steps):

1. Daily net change=7−5=2.
2. Over 4 days, net change=4×2=8.
3. End stock=36+(8)=44.

## Result

**Answer.** 44 units; the stock is increasing.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
