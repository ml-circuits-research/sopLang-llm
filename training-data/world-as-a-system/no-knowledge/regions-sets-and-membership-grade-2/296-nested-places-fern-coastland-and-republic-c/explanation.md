# Explanation 296 — Nested places: Fern, Coastland, and Republic C

## Explanation

1. Read the stated chain of containments from Fern upward and apply transitivity at each step.
2. The chain reaches Coastland, Republic C, Meridian, so Republic C contains Fern.
3. Containment only runs from the smaller unit to the larger one, which is why the chain settles the query.

Reference solution as printed in the source (family G10, 2 steps):

1. Follow the chain city→region→country.
2. Containment is transitive, so the city is in the country.

## Result

**Answer.** Yes, Fern is in Republic C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
