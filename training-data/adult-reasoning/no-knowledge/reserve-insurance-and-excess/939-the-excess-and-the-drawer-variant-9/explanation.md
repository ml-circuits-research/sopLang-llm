# Explanation 939 — The excess and the drawer — variant 9

## Explanation

1. With the policy Leo pays the yearly premium 320 plus the excess 460 on the single loss, so the insured out-of-pocket is 320+460=780.
2. Without the policy the whole loss of 860 is paid from the reserve, so the uninsured out-of-pocket is 860.
3. The reserve of 560 is < the uninsured loss of 860, so the drawer alone cannot absorb it and the policy caps the payment at 780.

Reference material as printed in the source:

One loss, one year. Do not invent “over 10 years”. Excess + premium vs the whole.

## Result

**Answer.** With: 320+460=780. Without: 860. Reserve 560 < the uninsured loss.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
