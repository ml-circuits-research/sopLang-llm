# Explanation 186 — Temporal compatibility in a story set in 1400

## Explanation

1. The story is set in 1400, so only items whose interval contains 1400 are compatible.
2. Test each mentioned item against its stated interval: Technology A and Tool C.
3. The item outside its interval is Tool C, which is the anachronism.
4. Items the story does not mention cannot be anachronistic here, whatever their interval.

Reference solution as printed in the source (family N13, 3 steps):

1. Check 1400 against Technology A interval 1200–1600.
2. Check 1400 against Tool C interval 1700–2000.
3. Items outside their intervals: ['Tool C'].

## Result

**Answer.** Anachronistic: Tool C.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
