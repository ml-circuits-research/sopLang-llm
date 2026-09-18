# Explanation 395 — Reservoir stock and flow: case 5

## Explanation

1. The daily net change is the inflow minus the outflow: 9 - 5 = 4 unit(s) per day.
2. Over 4 day(s) that net change accumulates to 4 times 4 = 16 unit(s).
3. Adding the accumulated change to the starting stock 42 gives 58 unit(s).
4. The stock is increasing because the daily net change is positive.

Reference solution as printed in the source (family N4, 3 steps):

1. Daily net change=9−5=4.
2. Over 4 days, net change=4×4=16.
3. End stock=42+(16)=58.

## Result

**Answer.** 58 units; the stock is increasing.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
