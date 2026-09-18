# Explanation 8.8.10 — Expected value and risk

## Explanation

1. Without protection the expected cost is the probability times the loss, 12/100 × 4000 = 480 CU, and the adverse scenario carries the full 4000 CU loss.
2. With protection the 320 CU are paid for certain and the loss falls to 20% of 4000 CU, so the expected cost is 320 + 12/100 × 20/100 × 4000 = 416 CU.
3. The hard risk rule is applied first: an option whose adverse-scenario total exceeds 1600 CU is rejected before any expected cost is compared.
4. Without protection the adverse scenario exceeds the limit, so the protective measure is the only option that survives the hard risk rule.

Reference solution as printed in the source (template 5, 4 steps):

1. Without protection, expected cost = 0.12 × 4000 = 480 CU. The adverse-scenario loss is 4000 CU, so the 1600-CU risk limit is violated.
2. With protection, expected cost = 320 + 0.12 × 0.20 × 4000 = 416 CU.
3. In the adverse scenario with protection, total cost = 320 + 800 = 1120 CU, so the risk limit is satisfied.
4. The hard risk rule is applied before comparing expected costs among the options that remain acceptable.

## Result

**Answer.** Expected cost without protection: 480 CU; with protection: 416 CU. Under the hard risk rule, the justified choice is the protective measure.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
