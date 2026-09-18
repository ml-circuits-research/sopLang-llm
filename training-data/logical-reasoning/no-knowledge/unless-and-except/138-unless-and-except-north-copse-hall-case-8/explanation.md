# Explanation 138 — Unless and except — North Copse hall — case 8

## Explanation

1. The board in North Copse keeps the hall open until 22:00 unless a storm warning is posted, which is the conditional "no posted warning, so the hall stays open".
2. No warning is posted, so the default stands and the hall stays open until 22:00; Jules points at storms in the world, but the board names a posted warning and nothing else.
3. "All evening classes run as planned except the roof-repair class" removes exactly one listed item, so that class is cancelled and the other classes still run.
4. Kat reads the pair that way, while Ned turns one named exception into a licence to cancel anything awkward.

Reference solution as printed in the source (section 14, 5 steps):

1. “Open unless warning” ≈ if no warning, then open.
2. No warning is posted.
3. “All except X” keeps the rest.
4. World-weather is not a posted warning.
5. Listed holes are small.

## Result

**Answer.** Without a posted warning, the hall stays open until 22:00. The roof-repair class is the listed hole. Other classes still run.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
