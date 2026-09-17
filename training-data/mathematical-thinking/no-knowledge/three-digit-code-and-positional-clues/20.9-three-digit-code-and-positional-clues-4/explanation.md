# Explanation 20.9 — Three-Digit Code and Positional Clues 4

## Explanation

1. The code uses each of the digits 3, 7, 4 exactly once, so the candidates are all permutations of those three digits.
2. Fixing digit 3 in the first position removes all permutations that do not start with it.
3. The remaining clue says that digit 7 stands before digit 4, which keeps only 374.
4. With three distinct digits a single ordering clue decides between the two remaining candidates, so the code is unique.

Reference solution as printed in the source (chapter 20, 4 steps):

1. Position 1 is fixed: 3.
2. Digits 7 and 4 remain for positions 2 and 3.
3. The condition says that 7 comes before 4, so their order is 7, 4.
4. The code is 374.

## Result

**Answer.** 374

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
