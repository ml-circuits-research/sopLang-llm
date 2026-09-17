# Explanation 21.15 — Detect Incompatible Data

## Explanation

1. Since 6 students brought neither object, exactly 18 - 6 students brought at least one.
2. With 7 bringing both, the union rule would give 12 + 10 - 7 = 15 students.
3. The two numbers must agree for the data to be consistent, and here they do not.

Reference solution as printed in the source (chapter 21, 4 steps):

1. If 6 brought neither object, then 18-6=12 brought at least one.
2. If 7 brought both, the counting formula gives 12+10-7=15 students with at least one.
3. The same quantity cannot be both 12 and 15.
4. Therefore, the value “7 brought both” is not compatible with the rest of the data.

## Result

**Answer.** No.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
