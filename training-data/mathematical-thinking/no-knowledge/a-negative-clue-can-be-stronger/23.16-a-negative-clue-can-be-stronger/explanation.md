# Explanation 23.16 — A negative clue can be stronger

## Explanation

1. Each negative clue is applied as a filter that drops every candidate containing the excluded property.
2. Excluding circles leaves one object while excluding red leaves two, so it is not a circle is the stronger clue.

Reference solution as printed in the source (chapter 23, 4 steps):

1. “It is not a circle” eliminates the three circle objects and leaves only red-square.
2. “It is not red” eliminates the two red objects and leaves blue-circle and green-circle.
3. A clue is stronger here if it leaves fewer possibilities.
4. The first leaves 1 candidate; the second leaves 2.

## Result

**Answer.** “It is not a circle”.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
