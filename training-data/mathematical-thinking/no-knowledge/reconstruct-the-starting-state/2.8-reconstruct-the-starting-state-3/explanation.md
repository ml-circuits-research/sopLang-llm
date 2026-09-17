# Explanation 2.8 — Reconstruct the Starting State 3

## Explanation

1. Forward, the box first gains 6 objects and then loses 2, ending at 13.
2. Working backward means inverting each rule and reversing the order: undoing "remove" is adding back, and undoing "add" is taking away.
3. Undoing the last change gives 13 + 2 = 15; undoing the first gives 15 - 6 = 9.
4. Checking forward from 9: 9 + 6 - 2 = 13, which matches.

Reference solution as printed in the source (chapter 2, 3 steps):

1. The last action was “remove 2.” To go backward, add 2: 13+2=15.
2. Now undo the action “add 6” by subtracting 6: 15-6=9.
3. Forward check: 9+6=15, then 15-2=13.

## Result

**Answer.** 9

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
