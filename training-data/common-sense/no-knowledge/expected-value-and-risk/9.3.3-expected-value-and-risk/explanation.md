# Explanation 9.3.3 — Expected value and risk

## Explanation

1. Without protection the expected cost is the probability times the loss, 8/100 × 4500 = 360 CU, and the adverse scenario carries the full 4500 CU loss.
2. With protection the 380 CU are paid for certain and the loss falls to 40% of 4500 CU, so the expected cost is 380 + 8/100 × 40/100 × 4500 = 524 CU.
3. The hard risk rule is applied first: an option whose adverse-scenario total exceeds 2100 CU is rejected before any expected cost is compared.
4. Both options exceed the risk limit in the adverse scenario, so neither is justified even though their expected costs differ.

Reference solution as printed in the source (template 5, 4 steps):

1. Without protection, expected cost = 0.08 × 4500 = 360 CU. The adverse-scenario loss is 4500 CU, so the 2100-CU risk limit is violated.
2. With protection, expected cost = 380 + 0.08 × 0.40 × 4500 = 524 CU.
3. In the adverse scenario with protection, total cost = 380 + 1800 = 2180 CU, so the risk limit is violated.
4. The hard risk rule is applied before comparing expected costs among the options that remain acceptable.

## Result

**Answer.** Expected cost without protection: 360 CU; with protection: 524 CU. Under the hard risk rule, the justified choice is neither option, because both violate the hard risk rule.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
