# Explanation 1.16 — Numbered Seats 1

## Explanation

1. The starting position is fixed: Radu sits in seat 2.
2. The problem defines "places after" as adding 2 to the seat number, so each later child is computed from the previous child instead of being counted from the start.
3. Applying the step twice gives Ioana in seat 4 and Sofia in seat 6.
4. Both seats stay inside the 7-seat line, which is the consistency check for the answer.

Reference solution as printed in the source (chapter 1, 4 steps):

1. Start from Radu’s position: 2.
2. Ioana is two places after him: 2+2=4.
3. Sofia is two places after Ioana: 4+2=6.
4. The numbers 4 and 6 lie in the interval 1…7, so the positions are possible.

## Result

**Answer.** Ioana: seat 4; Sofia: seat 6.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
