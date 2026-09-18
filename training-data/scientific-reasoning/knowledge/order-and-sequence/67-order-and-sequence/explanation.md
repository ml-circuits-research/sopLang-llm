# Explanation 67 — Order and sequence

## Explanation

1. The world of the case describes one process, and its stages a shadowed area appears on the screen, the opaque object blocks part of the light, light reaches the object, the source emits light are the steps of that process written in mixed order.
2. Matching those steps against the knowledge sheet of the process gives the sequence the source emits light → light reaches the object → the opaque object blocks part of the light → a shadowed area appears on the screen, because each step of the sheet is the one that prepares the next.
3. The first step is the one that depends on none of the others, and every later step uses the result of the step before it.
4. Reversing any neighbouring pair would ask for the effect before the cause, so the order of the sheet is the only order the process allows.

Reference solution as printed in the source (form 2, 4 steps):

1. We look for the stage that does not depend on any of the others in the list: “the source emits light”.
2. It can be followed by “light reaches the object”, because it uses the result of the first stage.
3. The third is “the opaque object blocks part of the light”, and the last is “a shadowed area appears on the screen”; if we reverse the last two, we would be asking for the effect before the cause or the final state before the intermediate state.
4. We verify the order from beginning to end: each step has the required data produced by the preceding step.

## Result

**Answer.** The source emits light → light reaches the object → the opaque object blocks part of the light → a shadowed area appears on the screen.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
