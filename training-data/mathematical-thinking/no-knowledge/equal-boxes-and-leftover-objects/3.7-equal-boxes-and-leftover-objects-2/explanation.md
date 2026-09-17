# Explanation 3.7 — Equal Boxes and Leftover Objects 2

## Explanation

1. A box counts only if it is completely filled with 4 objects, so partial boxes are not counted.
2. Taking 4 objects at a time from 14 fills 3 boxes and leaves 2 objects outside.
3. Checking: 3 × 4 + 2 = 14, and 2 is less than 4, so no extra complete box can be formed.

Reference solution as printed in the source (chapter 3, 4 steps):

1. Form one box at a time using 4 objects.
2. 4·3=12, so we can fill 3 boxes.
3. After filling these boxes, 14-12=2 objects remain.
4. The remainder 2 is less than 4, so it cannot form another complete box.

## Result

**Answer.** 3 complete boxes and 2 objects left over.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
