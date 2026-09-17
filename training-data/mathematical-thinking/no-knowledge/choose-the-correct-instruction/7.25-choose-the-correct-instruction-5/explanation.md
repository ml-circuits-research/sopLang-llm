# Explanation 7.25 — Choose the Correct Instruction 5

## Explanation

1. The robot starts at 24 and must land exactly on 36 after one instruction, so the needed change is 36 - 24 = 12.
2. Testing each candidate in turn shows that only “add 12” produces the target value 36.
3. The other candidates change the number away from 36, so “Add 12” is the unique instruction that succeeds.

Reference solution as printed in the source (chapter 7, 3 steps):

1. “Add 12”: 24+12=36, so it works.
2. “Subtract 12”: 24-12=12, which is not the target.
3. “Add 14”: 24+14=38, which exceeds the target.

## Result

**Answer.** “Add 12.”

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
