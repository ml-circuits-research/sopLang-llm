# Explanation 398 — Litres until rain — variant 8

## Explanation

1. The garden of Ugo in Long Hill drinks 6 l a day, and the rain is due in 12 days, so the whole stretch needs 6×12 = 72 l.
2. The tank holds 129 l today, and 72 ≤ 129, so the current dose lasts and does not have to be divided across the days.
3. The reserve left when the rain arrives is 129 − 72 = 57 l.

Reference material as printed in the source:

A finite resource = stock / days. Preventive extra empties faster. It is a budget in litres.

## Result

**Answer.** Yes. 6×12=72 ≤ 129. Left 57 l.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
