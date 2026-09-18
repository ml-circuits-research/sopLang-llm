# Explanation 32 — Order and sequence

## Explanation

1. The world of the case describes one process, and its stages air enters the lungs, oxygen passes into the blood, the blood transports oxygen, oxygen reaches the cells are the steps of that process written in mixed order.
2. Matching those steps against the knowledge sheet of the process gives the sequence air enters lungs → oxygen passes into the blood → the blood transports oxygen → oxygen reaches the cells, because each step of the sheet is the one that prepares the next.
3. The first step is the one that depends on none of the others, and every later step uses the result of the step before it.
4. Reversing any neighbouring pair would ask for the effect before the cause, so the order of the sheet is the only order the process allows.

Reference solution as printed in the source (form 2, 4 steps):

1. We look for the stage that does not depend on any of the others in the list: “air enters the lungs”.
2. It can be followed by “oxygen passes into the blood”, because it uses the result of the first stage.
3. The third is “the blood transports oxygen”, and the last is “oxygen reaches the cells”; if we reverse the last two, we would be asking for the effect before the cause or the final state before the intermediate state.
4. We verify the order from beginning to end: each step has the required data produced by the preceding step.

## Result

**Answer.** Air enters lungs → oxygen passes into the blood → the blood transports oxygen → oxygen reaches the cells.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
