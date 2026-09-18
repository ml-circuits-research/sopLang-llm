# Explanation 937 — The excess and the drawer — variant 7

## Explanation

1. With the policy Drew pays the yearly premium 290 plus the excess 420 on the single loss, so the insured out-of-pocket is 290+420=710.
2. Without the policy the whole loss of 820 is paid from the reserve, so the uninsured out-of-pocket is 820.
3. The reserve of 520 is < the uninsured loss of 820, so the drawer alone cannot absorb it and the policy caps the payment at 710.

Reference material as printed in the source:

One loss, one year. Do not invent “over 10 years”. Excess + premium vs the whole.

## Result

**Answer.** With: 290+420=710. Without: 820. Reserve 520 < the uninsured loss.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
