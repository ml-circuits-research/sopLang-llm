# Explanation 683 — Stones that are not water — variant 3

## Explanation

1. The tank measures 40 cm × 25 cm × 18 cm, so its full volume is 18000 cm³, which the sheet converts to 18.0 l.
2. Filling it to 80% gives 80% of that, and the submerged stones take 2 l of the space up to the level.
3. Because the rule subtracts the stones from the volume up to the level, the water is 12.4 l: the stones displace water without becoming water.

Reference material as printed in the source:

The question is about litres of water, not about level. That is why we subtract the stones. If it were about level, the stones would raise it.

## Result

**Answer.** Full 18.0 l. Water 12.4 l.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
