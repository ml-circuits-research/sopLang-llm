# Explanation 9.2.6 — Expected value and risk

## Explanation

1. Without protection the expected cost is the probability times the loss, 10/100 × 7000 = 700 CU, and the adverse scenario carries the full 7000 CU loss.
2. With protection the 340 CU are paid for certain and the loss falls to 30% of 7000 CU, so the expected cost is 340 + 10/100 × 30/100 × 7000 = 550 CU.
3. The hard risk rule is applied first: an option whose adverse-scenario total exceeds 1900 CU is rejected before any expected cost is compared.
4. Both options exceed the risk limit in the adverse scenario, so neither is justified even though their expected costs differ.
5. Under the hard risk rule, the justified choice is neither option, because both violate the hard risk rule.

Reference solution as printed in the source (template 5, 4 steps):

1. Without protection, expected cost = 0.10 × 7000 = 700 CU. The adverse-scenario loss is 7000 CU, so the 1900-CU risk limit is violated.
2. With protection, expected cost = 340 + 0.10 × 0.30 × 7000 = 550 CU.
3. In the adverse scenario with protection, total cost = 340 + 2100 = 2440 CU, so the risk limit is violated.
4. The hard risk rule is applied before comparing expected costs among the options that remain acceptable.

**Source answer.** Expected cost without protection: 700 CU; with protection: 550 CU. Under the hard risk rule, the justified choice is neither option, because both violate the hard risk rule. — the source prints the answer in a prose sentence; the shipped answer keeps only the value-bearing tokens, and the removed prose moves into the explanation. The shipped answer is computed from the statement, and this example is `computed_verified` rather than `exact_verified`.

## Result

**Answer.** Expected cost without protection: 700 CU; with protection: 550 CU. Justified choice: neither option, because both violate the hard risk rule.

**Verification.** computed_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
