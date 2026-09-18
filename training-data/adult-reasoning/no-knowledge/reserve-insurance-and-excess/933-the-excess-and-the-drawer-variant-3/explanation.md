# Explanation 933 — The excess and the drawer — variant 3

## Explanation

1. With the policy Hugo pays the yearly premium 230 plus the excess 340 on the single loss, so the insured out-of-pocket is 230+340=570.
2. Without the policy the whole loss of 740 is paid from the reserve, so the uninsured out-of-pocket is 740.
3. The reserve of 440 is < the uninsured loss of 740, so the drawer alone cannot absorb it and the policy caps the payment at 570.

Reference material as printed in the source:

One loss, one year. Do not invent “over 10 years”. Excess + premium vs the whole.

## Result

**Answer.** With: 230+340=570. Without: 740. Reserve 440 < the uninsured loss.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
