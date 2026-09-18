# Explanation 319 — Watts and kilowatt-hours — variant 9

## Explanation

1. The sheet states that 1000 W for 1 h is 1 kWh, so 72 W for 7 h on each of 20 nights gives 10080 Wh.
2. Dividing by 1000 and rounding to the two decimals of the course gives 10.08 kWh, the figure the sheet then prices.
3. At the round price of 1 per kWh the consumption costs 10.08, which is why the printed money clause repeats the same number.

Reference material as printed in the source:

W/1000 × hours × days. The same formula for any appliance whose power and time are given.

## Result

**Answer.** 10.08 kWh = 10.08 in money at the round price.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
