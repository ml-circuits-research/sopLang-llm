# Explanation 142 — Reservoir stock and flow: case 2

## Explanation

1. The daily net change is the inflow minus the outflow: 6 - 5 = 1 unit(s) per day.
2. Over 3 day(s) that net change accumulates to 3 times 1 = 3 unit(s).
3. Adding the accumulated change to the starting stock 28 gives 31 unit(s).
4. The stock is increasing because the daily net change is positive.

Reference solution as printed in the source (family N4, 3 steps):

1. Daily net change=6−5=1.
2. Over 3 days, net change=3×1=3.
3. End stock=28+(3)=31.

## Result

**Answer.** 31 units; the stock is increasing.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
