# Explanation 2.9 — Reconstruct the Starting State 4

## Explanation

1. Forward, the box first gains 7 objects and then loses 3, ending at 14.
2. Working backward means inverting each rule and reversing the order: undoing "remove" is adding back, and undoing "add" is taking away.
3. Undoing the last change gives 14 + 3 = 17; undoing the first gives 17 - 7 = 10.
4. Checking forward from 10: 10 + 7 - 3 = 14, which matches.

Reference solution as printed in the source (chapter 2, 3 steps):

1. The last action was “remove 3.” To go backward, add 3: 14+3=17.
2. Now undo the action “add 7” by subtracting 7: 17-7=10.
3. Forward check: 10+7=17, then 17-3=14.

## Result

**Answer.** 10

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
