# Explanation 497 — Multi-step synthesis

## Explanation

1. Level 1 checks the eligibility rule as a conjunction over the stated properties: the conditions are the same = YES, the instrument is checked = YES, the measurement is repeated = YES, the same unit is used = YES, so case D is eligible.
2. Level 2 follows the stated order and applies one link per step: we define what we measure → we choose the instrument and unit → we measure several times → we compare values, so after three links the process reaches “we compare values”.
3. Level 3 reads the same order backwards from its end: the stage printed immediately before the final stage “we compare values” is “we measure several times”.
4. The synthesis uses only the links the data state, so no stage that the chain does not connect is introduced.

Reference solution as printed in the source (form 17, 4 steps):

1. Level 1: we check every requirement; case D meets them all, so it is eligible.
2. Level 2: we apply only connected rules: we define what we measure → we choose the instrument and unit → we measure several times → we compare values. after three links we reach “we compare values”.
3. Level 3: the immediate predecessor of the last stage “we compare values” is “we measure several times”.
4. The synthesis combines satisfying constraints with following a sequence, without introducing any link that does not appear in the data.

## Result

**Answer.** (1) Yes, case D; (2) after three links we reach “we compare values”; (3) immediately before it is “we measure several times”.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
