# Explanation 392 — Litres until rain — variant 2

## Explanation

1. The garden of Piotr in Wells Village drinks 5 l a day, and the rain is due in 12 days, so the whole stretch needs 5×12 = 60 l.
2. The tank holds 87 l today, and 60 ≤ 87, so the current dose lasts and does not have to be divided across the days.
3. The reserve left when the rain arrives is 87 − 60 = 27 l.

Reference material as printed in the source:

A finite resource = stock / days. Preventive extra empties faster. It is a budget in litres.

## Result

**Answer.** Yes. 5×12=60 ≤ 87. Left 27 l.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
