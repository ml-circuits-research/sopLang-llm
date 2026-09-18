# Explanation 640 — Kilometres divided by steps — variant 10

## Explanation

1. The sheet fixes distance = speed × time at constant speed, so the walking time is 30 ÷ 4 = 7.50 h.
2. The stem adds no pause, so that decimal hour is the whole walking time: 7 whole hours plus 30 minutes of the remaining part.
3. Gina starts at 09:00, and adding 7 h 30 min gives the printed arrival hour 16:30.

Reference material as printed in the source:

t=d/v. The decimal part ×60 = minutes. No slope and tiredness: the model is flat, as written.

## Result

**Answer.** 7.50 h ≈ 7 h 30 min. Arrival 16:30.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
