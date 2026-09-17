# Explanation 1.19 — Numbered Seats 4

## Explanation

1. The starting position is fixed: Tudor sits in seat 3.
2. The problem defines "places after" as adding 2 to the seat number, so each later child is computed from the previous child instead of being counted from the start.
3. Applying the step twice gives Vlad in seat 5 and Ilinca in seat 7.
4. Both seats stay inside the 10-seat line, which is the consistency check for the answer.

Reference solution as printed in the source (chapter 1, 4 steps):

1. Start from Tudor’s position: 3.
2. Vlad is two places after him: 3+2=5.
3. Ilinca is two places after Vlad: 5+2=7.
4. The numbers 5 and 7 lie in the interval 1…10, so the positions are possible.

## Result

**Answer.** Vlad: seat 5; Ilinca: seat 7.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
