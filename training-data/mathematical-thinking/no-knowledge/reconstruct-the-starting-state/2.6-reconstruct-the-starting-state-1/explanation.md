# Explanation 2.6 — Reconstruct the Starting State 1

## Explanation

1. Forward, the box first gains 4 objects and then loses 2, ending at 9.
2. Working backward means inverting each rule and reversing the order: undoing "remove" is adding back, and undoing "add" is taking away.
3. Undoing the last change gives 9 + 2 = 11; undoing the first gives 11 - 4 = 7.
4. Checking forward from 7: 7 + 4 - 2 = 9, which matches.

Reference solution as printed in the source (chapter 2, 3 steps):

1. The last action was “remove 2.” To go backward, add 2: 9+2=11.
2. Now undo the action “add 4” by subtracting 4: 11-4=7.
3. Forward check: 7+4=11, then 11-2=9.

## Result

**Answer.** 7

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
