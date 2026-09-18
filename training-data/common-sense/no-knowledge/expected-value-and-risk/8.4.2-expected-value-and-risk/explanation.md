# Explanation 8.4.2 — Expected value and risk

## Explanation

1. Without protection the expected cost is the probability times the loss, 10/100 × 7000 = 700 CU, and the adverse scenario carries the full 7000 CU loss.
2. With protection the 400 CU are paid for certain and the loss falls to 25% of 7000 CU, so the expected cost is 400 + 10/100 × 25/100 × 7000 = 575 CU.
3. The hard risk rule is applied first: an option whose adverse-scenario total exceeds 2300 CU is rejected before any expected cost is compared.
4. Without protection the adverse scenario exceeds the limit, so the protective measure is the only option that survives the hard risk rule.

Reference solution as printed in the source (template 5, 4 steps):

1. Without protection, expected cost = 0.10 × 7000 = 700 CU. The adverse-scenario loss is 7000 CU, so the 2300-CU risk limit is violated.
2. With protection, expected cost = 400 + 0.10 × 0.25 × 7000 = 575 CU.
3. In the adverse scenario with protection, total cost = 400 + 1750 = 2150 CU, so the risk limit is satisfied.
4. The hard risk rule is applied before comparing expected costs among the options that remain acceptable.

## Result

**Answer.** Expected cost without protection: 700 CU; with protection: 575 CU. Under the hard risk rule, the justified choice is the protective measure.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
