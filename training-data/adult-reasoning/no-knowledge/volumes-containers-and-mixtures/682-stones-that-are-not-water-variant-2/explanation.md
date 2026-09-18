# Explanation 682 — Stones that are not water — variant 2

## Explanation

1. The tank measures 40 cm × 25 cm × 17 cm, so its full volume is 17000 cm³, which the sheet converts to 17.0 l.
2. Filling it to 80% gives 80% of that, and the submerged stones take 2 l of the space up to the level.
3. Because the rule subtracts the stones from the volume up to the level, the water is 11.6 l: the stones displace water without becoming water.

Reference material as printed in the source:

The question is about litres of water, not about level. That is why we subtract the stones. If it were about level, the stones would raise it.

## Result

**Answer.** Full 17.0 l. Water 11.6 l.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
