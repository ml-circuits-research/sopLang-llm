# Explanation 932 — The excess and the drawer — variant 2

## Explanation

1. With the policy Drew pays the yearly premium 215 plus the excess 320 on the single loss, so the insured out-of-pocket is 215+320=535.
2. Without the policy the whole loss of 720 is paid from the reserve, so the uninsured out-of-pocket is 720.
3. The reserve of 420 is < the uninsured loss of 720, so the drawer alone cannot absorb it and the policy caps the payment at 535.

Reference material as printed in the source:

One loss, one year. Do not invent “over 10 years”. Excess + premium vs the whole.

## Result

**Answer.** With: 215+320=535. Without: 720. Reserve 420 < the uninsured loss.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
