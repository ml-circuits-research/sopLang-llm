# Explanation 7.22 — Choose the Correct Instruction 2

## Explanation

1. The robot starts at 15 and must land exactly on 23 after one instruction, so the needed change is 23 - 15 = 8.
2. Testing each candidate in turn shows that only “add 8” produces the target value 23.
3. The other candidates change the number away from 23, so “Add 8” is the unique instruction that succeeds.

Reference solution as printed in the source (chapter 7, 3 steps):

1. “Add 8”: 15+8=23, so it works.
2. “Subtract 8”: 15-8=7, which is not the target.
3. “Add 10”: 15+10=25, which exceeds the target.

## Result

**Answer.** “Add 8.”

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
