# Explanation 20.10 — Three-Digit Code and Positional Clues 5

## Explanation

1. The code uses each of the digits 8, 5, 2 exactly once, so the candidates are all permutations of those three digits.
2. Fixing digit 8 in the first position removes all permutations that do not start with it.
3. The remaining clue says that digit 5 stands before digit 2, which keeps only 852.
4. With three distinct digits a single ordering clue decides between the two remaining candidates, so the code is unique.

Reference solution as printed in the source (chapter 20, 4 steps):

1. Position 1 is fixed: 8.
2. Digits 5 and 2 remain for positions 2 and 3.
3. The condition says that 5 comes before 2, so their order is 5, 2.
4. The code is 852.

## Result

**Answer.** 852

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
