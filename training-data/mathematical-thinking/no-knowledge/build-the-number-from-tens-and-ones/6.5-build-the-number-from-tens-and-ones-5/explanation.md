# Explanation 6.5 — Build the Number from Tens and Ones 5

## Explanation

1. The problem fixes the value of a ten: one ten is worth 10 ones, so 7 tens contribute 70.
2. The 1 loose ones are added unchanged because they are already counted in ones.
3. Replacing every ten by 10 ones and adding the loose ones gives 70 + 1 = 71.
4. The answer 71 therefore has 7 in the tens place and 1 in the ones place, which matches the description.

Reference solution as printed in the source (chapter 6, 3 steps):

1. 7 tens means 7·10=70.
2. Add the 1 one: 70+1=71.
3. The number is 71.

## Result

**Answer.** 71

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
