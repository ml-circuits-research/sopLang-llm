# Explanation 931 — The excess and the drawer — variant 1

## Explanation

1. With the policy Ugo pays the yearly premium 200 plus the excess 300 on the single loss, so the insured out-of-pocket is 200+300=500.
2. Without the policy the whole loss of 700 is paid from the reserve, so the uninsured out-of-pocket is 700.
3. The reserve of 400 is < the uninsured loss of 700, so the drawer alone cannot absorb it and the policy caps the payment at 500.

Reference material as printed in the source:

One loss, one year. Do not invent “over 10 years”. Excess + premium vs the whole.

## Result

**Answer.** With: 200+300=500. Without: 700. Reserve 400 < the uninsured loss.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
