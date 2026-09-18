# Explanation 634 — Kilometres divided by steps — variant 4

## Explanation

1. The sheet fixes distance = speed × time at constant speed, so the walking time is 18 ÷ 4 = 4.50 h.
2. The stem adds no pause, so that decimal hour is the whole walking time: 4 whole hours plus 30 minutes of the remaining part.
3. Cara starts at 09:00, and adding 4 h 30 min gives the printed arrival hour 13:30.

Reference material as printed in the source:

t=d/v. The decimal part ×60 = minutes. No slope and tiredness: the model is flat, as written.

## Result

**Answer.** 4.50 h ≈ 4 h 30 min. Arrival 13:30.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
