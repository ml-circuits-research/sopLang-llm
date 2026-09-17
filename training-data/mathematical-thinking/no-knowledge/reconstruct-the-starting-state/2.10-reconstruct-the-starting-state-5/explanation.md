# Explanation 2.10 — Reconstruct the Starting State 5

## Explanation

1. Forward, the box first gains 8 objects and then loses 2, ending at 17.
2. Working backward means inverting each rule and reversing the order: undoing "remove" is adding back, and undoing "add" is taking away.
3. Undoing the last change gives 17 + 2 = 19; undoing the first gives 19 - 8 = 11.
4. Checking forward from 11: 11 + 8 - 2 = 17, which matches.

Reference solution as printed in the source (chapter 2, 3 steps):

1. The last action was “remove 2.” To go backward, add 2: 17+2=19.
2. Now undo the action “add 8” by subtracting 8: 19-8=11.
3. Forward check: 11+8=19, then 19-2=17.

## Result

**Answer.** 11

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
