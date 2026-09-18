# Explanation 638 — Kilometres divided by steps — variant 8

## Explanation

1. The sheet fixes distance = speed × time at constant speed, so the walking time is 26 ÷ 5 = 5.20 h.
2. The stem adds no pause, so that decimal hour is the whole walking time: 5 whole hours plus 12 minutes of the remaining part.
3. Tess starts at 09:00, and adding 5 h 12 min gives the printed arrival hour 14:12.

Reference material as printed in the source:

t=d/v. The decimal part ×60 = minutes. No slope and tiredness: the model is flat, as written.

## Result

**Answer.** 5.20 h ≈ 5 h 12 min. Arrival 14:12.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
