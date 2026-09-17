# Explanation 20.8 — Three-Digit Code and Positional Clues 3

## Explanation

1. The code uses each of the digits 6, 9, 1 exactly once, so the candidates are all permutations of those three digits.
2. Fixing digit 6 in the first position removes all permutations that do not start with it.
3. The remaining clue says that digit 9 stands before digit 1, which keeps only 691.
4. With three distinct digits a single ordering clue decides between the two remaining candidates, so the code is unique.

Reference solution as printed in the source (chapter 20, 4 steps):

1. Position 1 is fixed: 6.
2. Digits 9 and 1 remain for positions 2 and 3.
3. The condition says that 9 comes before 1, so their order is 9, 1.
4. The code is 691.

## Result

**Answer.** 691

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
