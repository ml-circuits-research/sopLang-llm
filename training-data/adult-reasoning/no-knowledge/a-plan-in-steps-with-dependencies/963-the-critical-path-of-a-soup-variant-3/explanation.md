# Explanation 963 — The critical path of a soup — variant 3

## Explanation

1. Shopping (30 min) must finish before prep (20 min), and boiling (42 min) must follow prep, so the only order that respects the arrows is S1 then S2 then S3.
2. The longest path through those dependencies is 30+20+42=92 minutes, which no parallelism can shorten because Cara has put S3 ahead of S2, breaking the arrow the plan states.
3. S4 runs parallel with the last 10 min of S3, so it hides inside the chain rather than cutting it.
4. Cara targets 42 min, but 42 is S3’s duration alone, not the chain’s duration.

Reference material as printed in the source:

A plan is a graph of dependencies. A wish-list is not a graph.

## Result

**Answer.** Critical path 30+20+42=92 min. S4 does not cut S3. Boiling before prep breaks the arrow. 42 is S3’s duration, not the chain’s.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
