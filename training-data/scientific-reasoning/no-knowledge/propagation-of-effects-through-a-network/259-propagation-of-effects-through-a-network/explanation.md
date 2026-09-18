# Explanation 259 — Propagation of effects through a network

## Explanation

1. The model changes “moist soil”, so that node is active before any arrow is applied, and the answer never counts it among the effects.
2. One pass activates every destination of an arrow whose source is already active; the passes repeat until a pass adds nothing, which is the transitive closure of the 4 stated arrows.
3. The effect reaches 4 nodes, in the order the network hands them on: the root can absorb water, water enters the stem, water reaches the leaves, the leaves remain hydrated.
4. A node that no arrow path reaches stays out of the answer, so a neighbour of a reached node is never assumed to be affected.

Reference solution as printed in the source (form 14, 4 steps):

1. We start with the active set {“moist soil”}.
2. We add every destination of arrows leaving nodes that have already been reached.
3. We repeat until another pass adds nothing; this is the transitive closure of the effect.
4. The nodes reached are: the root can absorb water, water enters the stem, water reaches the leaves, the leaves remain hydrated.

## Result

**Answer.** The effect can propagate to: the root can absorb water, water enters the stem, water reaches the leaves, the leaves remain hydrated.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
