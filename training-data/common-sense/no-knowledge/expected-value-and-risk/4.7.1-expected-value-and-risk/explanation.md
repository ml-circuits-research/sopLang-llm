# Explanation 4.7.1 — Expected value and risk

## Explanation

1. Without protection the expected cost is the probability times the loss, 15/100 × 5500 = 825 CU, and the adverse scenario carries the full 5500 CU loss.
2. With protection the 440 CU are paid for certain and the loss falls to 30% of 5500 CU, so the expected cost is 440 + 15/100 × 30/100 × 5500 = 687.5 CU.
3. The hard risk rule is applied first: an option whose adverse-scenario total exceeds 1600 CU is rejected before any expected cost is compared.
4. Both options exceed the risk limit in the adverse scenario, so neither is justified even though their expected costs differ.

Reference solution as printed in the source (template 5, 4 steps):

1. Without protection, expected cost = 0.15 × 5500 = 825 CU. The adverse-scenario loss is 5500 CU, so the 1600-CU risk limit is violated.
2. With protection, expected cost = 440 + 0.15 × 0.30 × 5500 = 687.5 CU.
3. In the adverse scenario with protection, total cost = 440 + 1650 = 2090 CU, so the risk limit is violated.
4. The hard risk rule is applied before comparing expected costs among the options that remain acceptable.

## Result

**Answer.** Expected cost without protection: 825 CU; with protection: 687.5 CU. Under the hard risk rule, the justified choice is neither option, because both violate the hard risk rule.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
