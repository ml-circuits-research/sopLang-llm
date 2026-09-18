# Explanation 720 — An axis that starts at 89 — variant 10

## Explanation

1. The header plots the months Jan–Jun with the axis running from 89 to 109, so the values 91, 93, 92, 99, 100, 101 sit inside a cut window instead of a zero-based one.
2. Ugo calls the series a doubling, but the first value is 91 and the last is 101, a change of 10; a real doubling would have to reach 182.
3. The truncated axis stretches the drawn slope, so the picture looks far steeper than the numbers behind it support.
4. The headline “Explosion in subscriptions” is an editorial judgement about the same series, not a measured quantity.

Reference material as printed in the source:

The reflex “where does the axis start?” is the right one. The values beat the title.

## Result

**Answer.** 91 → 101 is +10, not ×2 (that would be 182). A cut axis makes the slope look steep. The title is a judgement.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
