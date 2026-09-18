# Explanation 5.5.5 — Expected value and risk

## Explanation

1. Without protection the expected cost is the probability times the loss, 15/100 × 7000 = 1050 CU, and the adverse scenario carries the full 7000 CU loss.
2. With protection the 440 CU are paid for certain and the loss falls to 20% of 7000 CU, so the expected cost is 440 + 15/100 × 20/100 × 7000 = 650 CU.
3. The hard risk rule is applied first: an option whose adverse-scenario total exceeds 1700 CU is rejected before any expected cost is compared.
4. Both options exceed the risk limit in the adverse scenario, so neither is justified even though their expected costs differ.

Reference solution as printed in the source (template 5, 4 steps):

1. Without protection, expected cost = 0.15 × 7000 = 1050 CU. The adverse-scenario loss is 7000 CU, so the 1700-CU risk limit is violated.
2. With protection, expected cost = 440 + 0.15 × 0.20 × 7000 = 650 CU.
3. In the adverse scenario with protection, total cost = 440 + 1400 = 1840 CU, so the risk limit is violated.
4. The hard risk rule is applied before comparing expected costs among the options that remain acceptable.

## Result

**Answer.** Expected cost without protection: 1050 CU; with protection: 650 CU. Under the hard risk rule, the justified choice is neither option, because both violate the hard risk rule.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
