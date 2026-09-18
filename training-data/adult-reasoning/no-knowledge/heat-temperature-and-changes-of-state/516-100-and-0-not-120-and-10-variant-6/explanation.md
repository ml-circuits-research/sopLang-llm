# Explanation 516 — 100 and 0, not 120 and 10 — variant 6

## Explanation

1. The sheet fixes the plain boiling point of water at 100 °C in Little River at ordinary pressure, and it says the lid only shortens the time to the boil, so the lid cannot carry the water to the 120 °C that Sam asserts.
2. While the ice and the water are both present the sheet keeps the temperature at the melting point of 0 °C, so the glass does not take the 10 °C that the warm room suggests.
3. A lid traps heat so the water reaches 100 °C sooner, but it does not change the temperature of a change of state, so both of Sam's figures are too high.

Reference material as printed in the source:

A lid changes time, not the threshold. Room heat goes first into melting. Two intuitions cut by the same text.

## Result

**Answer.** Boil with lid: still 100 °C. Glass of ice+water: 0 °C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
