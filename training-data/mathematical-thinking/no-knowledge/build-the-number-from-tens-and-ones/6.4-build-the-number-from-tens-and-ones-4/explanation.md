# Explanation 6.4 — Build the Number from Tens and Ones 4

## Explanation

1. The problem fixes the value of a ten: one ten is worth 10 ones, so 4 tens contribute 40.
2. The 9 loose ones are added unchanged because they are already counted in ones.
3. Replacing every ten by 10 ones and adding the loose ones gives 40 + 9 = 49.
4. The answer 49 therefore has 4 in the tens place and 9 in the ones place, which matches the description.

Reference solution as printed in the source (chapter 6, 3 steps):

1. 4 tens means 4·10=40.
2. Add the 9 ones: 40+9=49.
3. The number is 49.

## Result

**Answer.** 49

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
