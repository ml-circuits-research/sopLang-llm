# Explanation 631 — Kilometres divided by steps — variant 1

## Explanation

1. The sheet fixes distance = speed × time at constant speed, so the walking time is 12 ÷ 4 = 3.00 h.
2. The stem adds no pause, so that decimal hour is the whole walking time: 3 whole hours plus 0 minutes of the remaining part.
3. Kara starts at 09:00, and adding 3 h 0 min gives the printed arrival hour 12:00.

Reference material as printed in the source:

t=d/v. The decimal part ×60 = minutes. No slope and tiredness: the model is flat, as written.

## Result

**Answer.** 3.00 h ≈ 3 h 0 min. Arrival 12:00.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
