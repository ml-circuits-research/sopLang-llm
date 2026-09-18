# Explanation 2.1.3 — Expected value and risk

## Explanation

1. Without protection the expected cost is the probability times the loss, 12/100 × 3500 = 420 CU, and the adverse scenario carries the full 3500 CU loss.
2. With protection the 400 CU are paid for certain and the loss falls to 40% of 3500 CU, so the expected cost is 400 + 12/100 × 40/100 × 3500 = 568 CU.
3. The hard risk rule is applied first: an option whose adverse-scenario total exceeds 1300 CU is rejected before any expected cost is compared.
4. Both options exceed the risk limit in the adverse scenario, so neither is justified even though their expected costs differ.

Reference solution as printed in the source (template 5, 4 steps):

1. Without protection, expected cost = 0.12 × 3500 = 420 CU. The adverse-scenario loss is 3500 CU, so the 1300-CU risk limit is violated.
2. With protection, expected cost = 400 + 0.12 × 0.40 × 3500 = 568 CU.
3. In the adverse scenario with protection, total cost = 400 + 1400 = 1800 CU, so the risk limit is violated.
4. The hard risk rule is applied before comparing expected costs among the options that remain acceptable.

## Result

**Answer.** Expected cost without protection: 420 CU; with protection: 568 CU. Under the hard risk rule, the justified choice is neither option, because both violate the hard risk rule.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
