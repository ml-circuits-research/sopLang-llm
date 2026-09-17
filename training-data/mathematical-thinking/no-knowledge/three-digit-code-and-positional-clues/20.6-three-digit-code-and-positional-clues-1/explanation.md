# Explanation 20.6 — Three-Digit Code and Positional Clues 1

## Explanation

1. The code uses each of the digits 4, 2, 7 exactly once, so the candidates are all permutations of those three digits.
2. Fixing digit 4 in the first position removes all permutations that do not start with it.
3. The remaining clue says that digit 2 stands before digit 7, which keeps only 427.
4. With three distinct digits a single ordering clue decides between the two remaining candidates, so the code is unique.

Reference solution as printed in the source (chapter 20, 4 steps):

1. Position 1 is fixed: 4.
2. Digits 2 and 7 remain for positions 2 and 3.
3. The condition says that 2 comes before 7, so their order is 2, 7.
4. The code is 427.

## Result

**Answer.** 427

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
