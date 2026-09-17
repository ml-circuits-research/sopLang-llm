# Explanation 21.17 — A Necessary but Not Sufficient Property

## Explanation

1. The rule "all VIP tickets are gold" makes that value necessary for being VIP, so a ticket without it cannot be VIP.
2. A blue ticket is not gold, which excludes it from the VIP group.
3. A gold ticket is only known to satisfy the necessary condition, and ordinary tickets may share it, so VIP status is not decided.

Reference solution as printed in the source (chapter 21, 4 steps):

1. A VIP ticket must be gold.
2. A blue ticket is not gold, so it cannot be VIP.
3. A gold ticket may be VIP or may be an ordinary ticket.
4. Gold color is necessary but not sufficient.

## Result

**Answer.** Blue: it cannot be VIP. Gold: we cannot know for certain.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
