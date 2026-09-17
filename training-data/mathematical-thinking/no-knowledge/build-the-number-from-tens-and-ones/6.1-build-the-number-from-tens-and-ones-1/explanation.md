# Explanation 6.1 — Build the Number from Tens and Ones 1

## Explanation

1. The problem fixes the value of a ten: one ten is worth 10 ones, so 3 tens contribute 30.
2. The 7 loose ones are added unchanged because they are already counted in ones.
3. Replacing every ten by 10 ones and adding the loose ones gives 30 + 7 = 37.
4. The answer 37 therefore has 3 in the tens place and 7 in the ones place, which matches the description.

Reference solution as printed in the source (chapter 6, 3 steps):

1. 3 tens means 3·10=30.
2. Add the 7 ones: 30+7=37.
3. The number is 37.

## Result

**Answer.** 37

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
