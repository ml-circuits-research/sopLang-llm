# Explanation 842 — Applying a rule with an exception: Noah

## Explanation

1. The exception is checked first: during an evacuation drill nobody may enter, so it overrides ordinary eligibility.
2. No evacuation drill is active, so the general rule applies: age ≥ 14 and an adult permit must both hold.
3. The age test is 14 ≥ 14, which is True, and the permit test is False.
4. The rule joins the two conditions with AND, so entry is not allowed: at least one test fails.

Reference solution as printed in the source (family C1, 4 steps):

1. Age test: 14≥14 is True.
2. Permit test is False.
3. Because the general rule uses AND, both tests must pass.
4. Therefore entry is not allowed.

## Result

**Answer.** No, Noah may not enter.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
