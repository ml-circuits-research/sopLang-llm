# Explanation 23.20 — The smallest amount of information that solves the puzzle

## Explanation

1. A clue identifies the number by itself only when the only candidate it keeps is the wanted number.
2. Testing the clues on 2, 4, 6, and 8 shows that the smallest clue that pins down 6 is C.

Reference solution as printed in the source (chapter 23, 4 steps):

1. A eliminates nothing because all candidates are even.
2. B eliminates 2 and 4, but leaves 6 and 8.
3. C applies two bounds at once and leaves only 6.
4. Only C identifies the number directly.

## Result

**Answer.** C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
