# Explanation 7.23 — Choose the Correct Instruction 3

## Explanation

1. The robot starts at 18 and must land exactly on 27 after one instruction, so the needed change is 27 - 18 = 9.
2. Testing each candidate in turn shows that only “add 9” produces the target value 27.
3. The other candidates change the number away from 27, so “Add 9” is the unique instruction that succeeds.

Reference solution as printed in the source (chapter 7, 3 steps):

1. “Add 9”: 18+9=27, so it works.
2. “Subtract 9”: 18-9=9, which is not the target.
3. “Add 11”: 18+11=29, which exceeds the target.

## Result

**Answer.** “Add 9.”

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
