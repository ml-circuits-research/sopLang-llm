# Explanation 23.9 — Information that completes a non-unique puzzle

## Explanation

1. A clue identifies the number only when exactly one of the remaining candidates satisfies it.
2. Testing each clue on 4, 5, and 6 leaves a single candidate for II alone, so that clue completes the puzzle.

Reference solution as printed in the source (chapter 23, 4 steps):

1. I keeps 4 and 5, so it is not sufficient.
2. II keeps only 5 because 4 and 6 are even.
3. III is true for all three, so it does not help.
4. Only clue II makes the solution unique.

## Result

**Answer.** II: “the number is odd”.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
