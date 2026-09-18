# Explanation 427 — Multi-step synthesis

## Explanation

1. Level 1 checks the eligibility rule as a conjunction over the stated properties: the component is attracted by a magnet = YES, does not pass through the filter = YES, remains after evaporation of the water = YES, so case iron is eligible.
2. Level 2 follows the stated order and applies one link per step: we use the magnet → we use the sieve → we filter the liquid → we evaporate the water, so after three links the process reaches “we evaporate the water”.
3. Level 3 reads the same order backwards from its end: the stage printed immediately before the final stage “we evaporate the water” is “we filter the liquid”.
4. The synthesis uses only the links the data state, so no stage that the chain does not connect is introduced.

Reference solution as printed in the source (form 17, 4 steps):

1. Level 1: we check each requirement; Case iron them satisfies on all, therefore is eligible.
2. Level 2: we apply only connected rules: we use the magnet → we use the sieve → we filter the liquid → we evaporate the water. after three links we reach “we evaporate the water”.
3. Level 3: the immediate predecessor of the last stage “we evaporate the water” is “we filter the liquid”.
4. The synthesis combines satisfying constraints with following a sequence, without introducing any link that does not appear in the data.

## Result

**Answer.** (1) YES, Case iron; (2) after three links we reach at “we evaporate the water”; (3) immediately before it is “we filter the liquid”.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
