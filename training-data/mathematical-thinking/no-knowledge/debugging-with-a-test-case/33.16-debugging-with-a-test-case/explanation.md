# Explanation 33.16 — Debugging with a test case

## Explanation

1. A test case compares what the program should do with what it does for one input; here the input is 3.
2. The intended rule gives 6, while the faulty formula gives 5.
3. The two values differ, which is exactly the evidence that the program contains a bug.

Reference solution as printed in the source (chapter 33, 4 steps):

1. “Twice” means two copies of 3: 6.
2. The program adds only 2 and gets 5.
3. The results differ.
4. The test shows that the implemented formula does not satisfy the requirement.

## Result

**Answer.** Correct result 6; the program produces 5.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
