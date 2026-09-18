# Explanation 396 — Litres until rain — variant 6

## Explanation

1. The garden of Leo in Mill Hamlet drinks 4 l a day, and the rain is due in 12 days, so the whole stretch needs 4×12 = 48 l.
2. The tank holds 115 l today, and 48 ≤ 115, so the current dose lasts and does not have to be divided across the days.
3. The reserve left when the rain arrives is 115 − 48 = 67 l.

Reference material as printed in the source:

A finite resource = stock / days. Preventive extra empties faster. It is a budget in litres.

## Result

**Answer.** Yes. 4×12=48 ≤ 115. Left 67 l.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
