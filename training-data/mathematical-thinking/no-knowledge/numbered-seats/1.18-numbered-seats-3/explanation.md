# Explanation 1.18 — Numbered Seats 3

## Explanation

1. The starting position is fixed: Sofia sits in seat 2.
2. The problem defines "places after" as adding 2 to the seat number, so each later child is computed from the previous child instead of being counted from the start.
3. Applying the step twice gives Tudor in seat 4 and Vlad in seat 6.
4. Both seats stay inside the 9-seat line, which is the consistency check for the answer.

Reference solution as printed in the source (chapter 1, 4 steps):

1. Start from Sofia’s position: 2.
2. Tudor is two places after her: 2+2=4.
3. Vlad is two places after Tudor: 4+2=6.
4. The numbers 4 and 6 lie in the interval 1…9, so the positions are possible.

## Result

**Answer.** Tudor: seat 4; Vlad: seat 6.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
