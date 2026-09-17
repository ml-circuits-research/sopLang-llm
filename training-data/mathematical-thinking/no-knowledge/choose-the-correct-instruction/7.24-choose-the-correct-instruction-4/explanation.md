# Explanation 7.24 — Choose the Correct Instruction 4

## Explanation

1. The robot starts at 20 and must land exactly on 31 after one instruction, so the needed change is 31 - 20 = 11.
2. Testing each candidate in turn shows that only “add 11” produces the target value 31.
3. The other candidates change the number away from 31, so “Add 11” is the unique instruction that succeeds.

Reference solution as printed in the source (chapter 7, 3 steps):

1. “Add 11”: 20+11=31, so it works.
2. “Subtract 11”: 20-11=9, which is not the target.
3. “Add 13”: 20+13=33, which exceeds the target.

## Result

**Answer.** “Add 11.”

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
