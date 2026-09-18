# Explanation 4.4.10 — Expected value and risk

## Explanation

1. Without protection the expected cost is the probability times the loss, 15/100 × 5500 = 825 CU, and the adverse scenario carries the full 5500 CU loss.
2. With protection the 220 CU are paid for certain and the loss falls to 25% of 5500 CU, so the expected cost is 220 + 15/100 × 25/100 × 5500 = 426.25 CU.
3. The hard risk rule is applied first: an option whose adverse-scenario total exceeds 2100 CU is rejected before any expected cost is compared.
4. Without protection the adverse scenario exceeds the limit, so the protective measure is the only option that survives the hard risk rule.

Reference solution as printed in the source (template 5, 4 steps):

1. Without protection, expected cost = 0.15 × 5500 = 825 CU. The adverse-scenario loss is 5500 CU, so the 2100-CU risk limit is violated.
2. With protection, expected cost = 220 + 0.15 × 0.25 × 5500 = 426.25 CU.
3. In the adverse scenario with protection, total cost = 220 + 1375 = 1595 CU, so the risk limit is satisfied.
4. The hard risk rule is applied before comparing expected costs among the options that remain acceptable.

## Result

**Answer.** Expected cost without protection: 825 CU; with protection: 426.25 CU. Under the hard risk rule, the justified choice is the protective measure.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
