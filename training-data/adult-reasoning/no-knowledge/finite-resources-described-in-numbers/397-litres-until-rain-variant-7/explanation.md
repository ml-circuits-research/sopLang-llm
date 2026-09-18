# Explanation 397 — Litres until rain — variant 7

## Explanation

1. The garden of Piotr in Wells Village drinks 5 l a day, and the rain is due in 12 days, so the whole stretch needs 5×12 = 60 l.
2. The tank holds 122 l today, and 60 ≤ 122, so the current dose lasts and does not have to be divided across the days.
3. The reserve left when the rain arrives is 122 − 60 = 62 l.

Reference material as printed in the source:

A finite resource = stock / days. Preventive extra empties faster. It is a budget in litres.

## Result

**Answer.** Yes. 5×12=60 ≤ 122. Left 62 l.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
