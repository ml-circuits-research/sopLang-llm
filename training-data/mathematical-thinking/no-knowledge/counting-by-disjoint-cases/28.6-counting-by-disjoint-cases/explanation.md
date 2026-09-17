# Explanation 28.6 — Counting by disjoint cases

## Explanation

1. The codes split into two disjoint cases that share no code, so their counts add.
2. The first case is a letter choice (2) together with a digit choice (3), giving 6 codes.
3. The second case is the single letter with no digit, giving 1 more code for a total of 7.

Reference solution as printed in the source (chapter 28, 4 steps):

1. Codes beginning with A or B form the first case.
2. A/B and 1/2/3 give 6 combinations.
3. Code C is a separate case and does not overlap the first.
4. 6+1=7.

## Result

**Answer.** 7 codes.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
