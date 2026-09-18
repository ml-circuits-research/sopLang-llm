# Explanation 936 — The excess and the drawer — variant 6

## Explanation

1. With the policy Ugo pays the yearly premium 275 plus the excess 400 on the single loss, so the insured out-of-pocket is 275+400=675.
2. Without the policy the whole loss of 800 is paid from the reserve, so the uninsured out-of-pocket is 800.
3. The reserve of 500 is < the uninsured loss of 800, so the drawer alone cannot absorb it and the policy caps the payment at 675.

Reference material as printed in the source:

One loss, one year. Do not invent “over 10 years”. Excess + premium vs the whole.

## Result

**Answer.** With: 275+400=675. Without: 800. Reserve 500 < the uninsured loss.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
