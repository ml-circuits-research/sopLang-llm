# Explanation 13 — Following water from Willow Stream

## Explanation

1. Each "flows into" fact is a directed arrow, so the network has 3 arrows from upstream to downstream.
2. Following the arrows from Willow Stream reaches Blue Creek.
3. No fact removes an edge from the network.

Reference solution as printed in the source (family G3, 3 steps):

1. Rewrite the facts as arrows: Willow Stream→Blue Creek, Clearwater→Blue Creek, Blue Creek→Silver River.
2. Follow arrows starting from Willow Stream.
3. An arrow path reaches Blue Creek, so Willow Stream is upstream of Blue Creek.

## Result

**Answer.** Yes; water from Willow Stream can reach Blue Creek.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
