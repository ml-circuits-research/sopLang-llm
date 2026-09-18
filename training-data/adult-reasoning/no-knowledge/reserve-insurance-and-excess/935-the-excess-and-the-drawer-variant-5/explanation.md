# Explanation 935 — The excess and the drawer — variant 5

## Explanation

1. With the policy Piotr pays the yearly premium 260 plus the excess 380 on the single loss, so the insured out-of-pocket is 260+380=640.
2. Without the policy the whole loss of 780 is paid from the reserve, so the uninsured out-of-pocket is 780.
3. The reserve of 480 is < the uninsured loss of 780, so the drawer alone cannot absorb it and the policy caps the payment at 640.

Reference material as printed in the source:

One loss, one year. Do not invent “over 10 years”. Excess + premium vs the whole.

## Result

**Answer.** With: 260+380=640. Without: 780. Reserve 480 < the uninsured loss.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
