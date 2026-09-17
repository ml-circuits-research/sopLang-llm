# Explanation 6.21 — Change the Tens and Ones 1

## Explanation

1. The starting number is 120, and the problem fixes one ten as 10 ones.
2. The tens instruction therefore adds 10×2 = 20, while the ones instruction adds 3 directly.
3. Applying both changes in sequence gives 120 + 20 + 3 = 143.

Reference solution as printed in the source (chapter 6, 3 steps):

1. 2 tens means 20.
2. Add this to the starting number: 120+20=140.
3. Also add 3 ones: 140+3=143.

## Result

**Answer.** 143

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
