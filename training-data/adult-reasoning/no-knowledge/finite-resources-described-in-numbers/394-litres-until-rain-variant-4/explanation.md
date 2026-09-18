# Explanation 394 — Litres until rain — variant 4

## Explanation

1. The garden of Drew in Forest Parish drinks 7 l a day, and the rain is due in 12 days, so the whole stretch needs 7×12 = 84 l.
2. The tank holds 101 l today, and 84 ≤ 101, so the current dose lasts and does not have to be divided across the days.
3. The reserve left when the rain arrives is 101 − 84 = 17 l.

Reference material as printed in the source:

A finite resource = stock / days. Preventive extra empties faster. It is a budget in litres.

## Result

**Answer.** Yes. 7×12=84 ≤ 101. Left 17 l.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
