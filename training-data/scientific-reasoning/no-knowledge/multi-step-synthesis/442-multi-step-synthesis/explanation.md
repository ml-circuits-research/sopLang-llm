# Explanation 442 — Multi-step synthesis

## Explanation

1. Level 1 checks the eligibility rule as a conjunction over the stated properties: the screen is behind the object = YES, nothing blocks the source before the object = YES, the object is opaque = YES, the source is switched on = YES, so case D is eligible.
2. Level 2 follows the stated order and applies one link per step: the source emits light → light reaches the object → the opaque object blocks part of the light → a shadowed area appears on the screen, so after three links the process reaches “a shadowed area appears on the screen”.
3. Level 3 reads the same order backwards from its end: the stage printed immediately before the final stage “a shadowed area appears on the screen” is “the opaque object blocks part of the light”.
4. The synthesis uses only the links the data state, so no stage that the chain does not connect is introduced.

Reference solution as printed in the source (form 17, 4 steps):

1. Level 1: we check every requirement; case D meets them all, so it is eligible.
2. Level 2: we apply only connected rules: the source emits light → light reaches the object → the opaque object blocks part of the light → a shadowed area appears on the screen. after three links we reach “a shadowed area appears on the screen”.
3. Level 3: the immediate predecessor of the last stage “a shadowed area appears on the screen” is “the opaque object blocks part of the light”.
4. The synthesis combines satisfying constraints with following a sequence, without introducing any link that does not appear in the data.

## Result

**Answer.** (1) Yes, case D; (2) after three links we reach “a shadowed area appears on the screen”; (3) immediately before it is “the opaque object blocks part of the light”.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
