# Explanation 9.9.5 — Expected value and risk

## Explanation

1. Without protection the expected cost is the probability times the loss, 5/100 × 5500 = 275 CU, and the adverse scenario carries the full 5500 CU loss.
2. With protection the 340 CU are paid for certain and the loss falls to 20% of 5500 CU, so the expected cost is 340 + 5/100 × 20/100 × 5500 = 395 CU.
3. The hard risk rule is applied first: an option whose adverse-scenario total exceeds 2400 CU is rejected before any expected cost is compared.
4. Without protection the adverse scenario exceeds the limit, so the protective measure is the only option that survives the hard risk rule.

Reference solution as printed in the source (template 5, 4 steps):

1. Without protection, expected cost = 0.05 × 5500 = 275 CU. The adverse-scenario loss is 5500 CU, so the 2400-CU risk limit is violated.
2. With protection, expected cost = 340 + 0.05 × 0.20 × 5500 = 395 CU.
3. In the adverse scenario with protection, total cost = 340 + 1100 = 1440 CU, so the risk limit is satisfied.
4. The hard risk rule is applied before comparing expected costs among the options that remain acceptable.

## Result

**Answer.** Expected cost without protection: 275 CU; with protection: 395 CU. Under the hard risk rule, the justified choice is the protective measure.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
