# Explanation 938 — The excess and the drawer — variant 8

## Explanation

1. With the policy Hugo pays the yearly premium 305 plus the excess 440 on the single loss, so the insured out-of-pocket is 305+440=745.
2. Without the policy the whole loss of 840 is paid from the reserve, so the uninsured out-of-pocket is 840.
3. The reserve of 540 is < the uninsured loss of 840, so the drawer alone cannot absorb it and the policy caps the payment at 745.

Reference material as printed in the source:

One loss, one year. Do not invent “over 10 years”. Excess + premium vs the whole.

## Result

**Answer.** With: 305+440=745. Without: 840. Reserve 540 < the uninsured loss.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
