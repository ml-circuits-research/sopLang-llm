# Explanation 940 — The excess and the drawer — variant 10

## Explanation

1. With the policy Piotr pays the yearly premium 335 plus the excess 480 on the single loss, so the insured out-of-pocket is 335+480=815.
2. Without the policy the whole loss of 880 is paid from the reserve, so the uninsured out-of-pocket is 880.
3. The reserve of 580 is < the uninsured loss of 880, so the drawer alone cannot absorb it and the policy caps the payment at 815.

Reference material as printed in the source:

One loss, one year. Do not invent “over 10 years”. Excess + premium vs the whole.

## Result

**Answer.** With: 335+480=815. Without: 880. Reserve 580 < the uninsured loss.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
