# Explanation 7.21 — Choose the Correct Instruction 1

## Explanation

1. The robot starts at 12 and must land exactly on 19 after one instruction, so the needed change is 19 - 12 = 7.
2. Testing each candidate in turn shows that only “add 7” produces the target value 19.
3. The other candidates change the number away from 19, so “Add 7” is the unique instruction that succeeds.

Reference solution as printed in the source (chapter 7, 3 steps):

1. “Add 7”: 12+7=19, so it works.
2. “Subtract 7”: 12-7=5, which is not the target.
3. “Add 9”: 12+9=21, which exceeds the target.

## Result

**Answer.** “Add 7.”

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
