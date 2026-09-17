# Explanation 20.7 — Three-Digit Code and Positional Clues 2

## Explanation

1. The code uses each of the digits 5, 8, 3 exactly once, so the candidates are all permutations of those three digits.
2. Fixing digit 5 in the first position removes all permutations that do not start with it.
3. The remaining clue says that digit 8 stands before digit 3, which keeps only 583.
4. With three distinct digits a single ordering clue decides between the two remaining candidates, so the code is unique.

Reference solution as printed in the source (chapter 20, 4 steps):

1. Position 1 is fixed: 5.
2. Digits 8 and 3 remain for positions 2 and 3.
3. The condition says that 8 comes before 3, so their order is 8, 3.
4. The code is 583.

## Result

**Answer.** 583

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
