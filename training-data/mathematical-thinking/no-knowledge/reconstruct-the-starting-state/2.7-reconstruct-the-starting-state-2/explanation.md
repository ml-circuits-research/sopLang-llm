# Explanation 2.7 — Reconstruct the Starting State 2

## Explanation

1. Forward, the box first gains 5 objects and then loses 3, ending at 10.
2. Working backward means inverting each rule and reversing the order: undoing "remove" is adding back, and undoing "add" is taking away.
3. Undoing the last change gives 10 + 3 = 13; undoing the first gives 13 - 5 = 8.
4. Checking forward from 8: 8 + 5 - 3 = 10, which matches.

Reference solution as printed in the source (chapter 2, 3 steps):

1. The last action was “remove 3.” To go backward, add 3: 10+3=13.
2. Now undo the action “add 5” by subtracting 5: 13-5=8.
3. Forward check: 8+5=13, then 13-3=10.

## Result

**Answer.** 8

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
