# Explanation 11 — Following water from North Fork

## Explanation

1. Each "flows into" fact is a directed arrow, so the network has 3 arrows from upstream to downstream.
2. Following the arrows from North Fork reaches Blue Creek.
3. No fact removes an edge from the network.

Reference solution as printed in the source (family G3, 3 steps):

1. Rewrite the facts as arrows: North Fork→Meadow River, Red Brook→Meadow River, Meadow River→Blue Creek.
2. Follow arrows starting from North Fork.
3. An arrow path reaches Blue Creek, so North Fork is upstream of Blue Creek.

## Result

**Answer.** Yes; water from North Fork can reach Blue Creek.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
