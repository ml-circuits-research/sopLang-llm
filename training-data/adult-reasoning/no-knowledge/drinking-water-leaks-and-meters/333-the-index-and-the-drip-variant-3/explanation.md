# Explanation 333 — The index and the drip — variant 3

## Explanation

1. The book charges the difference between the two readings, so 1030 minus 1020 gives 10 m³ and, at 6 per m³, a cost of 60.
2. The table is the authority for the leak: 3 l/h for 24 h on each of 20 days is 1440 l.
3. Because 1000 l is 1 m³, the drip is 1.44 m³ on top of the index, which is why the printed answer keeps both units for the same water.

Reference material as printed in the source:

Litres versus cubic metres: without /1000 the drip is unreadable. The table is the authority for the approximation, not a laboratory.

## Result

**Answer.** Index 10 m³ = 60. Drip 1.44 m³ (1440 l).

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
