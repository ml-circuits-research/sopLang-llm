# Explanation 400 — Litres until rain — variant 10

## Explanation

1. The garden of Hugo in Little River drinks 8 l a day, and the rain is due in 12 days, so the whole stretch needs 8×12 = 96 l.
2. The tank holds 143 l today, and 96 ≤ 143, so the current dose lasts and does not have to be divided across the days.
3. The reserve left when the rain arrives is 143 − 96 = 47 l.

Reference material as printed in the source:

A finite resource = stock / days. Preventive extra empties faster. It is a budget in litres.

## Result

**Answer.** Yes. 8×12=96 ≤ 143. Left 47 l.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
