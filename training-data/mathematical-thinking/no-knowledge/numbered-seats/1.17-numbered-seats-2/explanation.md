# Explanation 1.17 — Numbered Seats 2

## Explanation

1. The starting position is fixed: Ioana sits in seat 3.
2. The problem defines "places after" as adding 2 to the seat number, so each later child is computed from the previous child instead of being counted from the start.
3. Applying the step twice gives Sofia in seat 5 and Tudor in seat 7.
4. Both seats stay inside the 8-seat line, which is the consistency check for the answer.

Reference solution as printed in the source (chapter 1, 4 steps):

1. Start from Ioana’s position: 3.
2. Sofia is two places after her: 3+2=5.
3. Tudor is two places after Sofia: 5+2=7.
4. The numbers 5 and 7 lie in the interval 1…8, so the positions are possible.

## Result

**Answer.** Sofia: seat 5; Tudor: seat 7.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
