# Explanation 22.4 — Relative position from two relations

## Explanation

1. Each relation aligns two places on one axis, so "east of" and "west of" become one directed inequality along the east-west axis.
2. Chaining the relations transitively links the asked subject to its reference without any diagram.
3. The chain places park west of school.

Reference solution as printed in the source (chapter 22, 4 steps):

1. If the library is east of the park, then the park is west of the library.
2. The school is even farther east than the library.
3. Therefore the park lies west of the school.
4. No exact distances are needed for this conclusion.

## Result

**Answer.** West of the school.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
