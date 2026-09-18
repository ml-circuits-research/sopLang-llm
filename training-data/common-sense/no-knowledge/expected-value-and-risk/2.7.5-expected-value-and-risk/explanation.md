# Explanation 2.7.5 — Expected value and risk

## Explanation

1. Without protection the expected cost is the probability times the loss, 10/100 × 6500 = 650 CU, and the adverse scenario carries the full 6500 CU loss.
2. With protection the 180 CU are paid for certain and the loss falls to 40% of 6500 CU, so the expected cost is 180 + 10/100 × 40/100 × 6500 = 440 CU.
3. The hard risk rule is applied first: an option whose adverse-scenario total exceeds 2100 CU is rejected before any expected cost is compared.
4. Both options exceed the risk limit in the adverse scenario, so neither is justified even though their expected costs differ.

Reference solution as printed in the source (template 5, 4 steps):

1. Without protection, expected cost = 0.10 × 6500 = 650 CU. The adverse-scenario loss is 6500 CU, so the 2100-CU risk limit is violated.
2. With protection, expected cost = 180 + 0.10 × 0.40 × 6500 = 440 CU.
3. In the adverse scenario with protection, total cost = 180 + 2600 = 2780 CU, so the risk limit is violated.
4. The hard risk rule is applied before comparing expected costs among the options that remain acceptable.

## Result

**Answer.** Expected cost without protection: 650 CU; with protection: 440 CU. Under the hard risk rule, the justified choice is neither option, because both violate the hard risk rule.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
