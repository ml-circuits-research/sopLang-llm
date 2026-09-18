# Explanation 934 — The excess and the drawer — variant 4

## Explanation

1. With the policy Leo pays the yearly premium 245 plus the excess 360 on the single loss, so the insured out-of-pocket is 245+360=605.
2. Without the policy the whole loss of 760 is paid from the reserve, so the uninsured out-of-pocket is 760.
3. The reserve of 460 is < the uninsured loss of 760, so the drawer alone cannot absorb it and the policy caps the payment at 605.

Reference material as printed in the source:

One loss, one year. Do not invent “over 10 years”. Excess + premium vs the whole.

## Result

**Answer.** With: 245+360=605. Without: 760. Reserve 460 < the uninsured loss.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
