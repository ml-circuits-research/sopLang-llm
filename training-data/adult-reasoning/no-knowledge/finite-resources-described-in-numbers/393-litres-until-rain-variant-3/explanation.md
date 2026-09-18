# Explanation 393 — Litres until rain — variant 3

## Explanation

1. The garden of Ugo in Long Hill drinks 6 l a day, and the rain is due in 12 days, so the whole stretch needs 6×12 = 72 l.
2. The tank holds 94 l today, and 72 ≤ 94, so the current dose lasts and does not have to be divided across the days.
3. The reserve left when the rain arrives is 94 − 72 = 22 l.

Reference material as printed in the source:

A finite resource = stock / days. Preventive extra empties faster. It is a budget in litres.

## Result

**Answer.** Yes. 6×12=72 ≤ 94. Left 22 l.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
