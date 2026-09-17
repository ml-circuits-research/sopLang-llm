# Explanation 21.23 — Deduction by Excluding Categories

## Explanation

1. The object has exactly one of the three possible values: wood, metal, plastic.
2. Excluding wood and plastic removes all but one of them.
3. The only value left is metal, and it must be the answer.

Reference solution as printed in the source (chapter 21, 4 steps):

1. The complete list has three possibilities.
2. The first clue eliminates wood.
3. The second eliminates plastic.
4. Only one possibility remains: metal.

## Result

**Answer.** Metal.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
