# Explanation 637 — Kilometres divided by steps — variant 7

## Explanation

1. The sheet fixes distance = speed × time at constant speed, so the walking time is 24 ÷ 4 = 6.00 h.
2. The stem adds no pause, so that decimal hour is the whole walking time: 6 whole hours plus 0 minutes of the remaining part.
3. Olga starts at 09:00, and adding 6 h 0 min gives the printed arrival hour 15:00.

Reference material as printed in the source:

t=d/v. The decimal part ×60 = minutes. No slope and tiredness: the model is flat, as written.

## Result

**Answer.** 6.00 h ≈ 6 h 0 min. Arrival 15:00.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
