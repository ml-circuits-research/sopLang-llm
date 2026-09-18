# Explanation 738 — Three switches — variant 8

## Explanation

1. The terms give the Account switch exactly one job: it turns off the news email, and nothing else in the terms is tied to it.
2. Photos are governed by their own clause — they stay public while they are in the app — so Ben's belief that the switch makes them private is not supported.
3. View history is kept 12 months and only then deleted, so turning the news off cannot delete it at once.
4. The email list is not sold, which is a separate promise and does not change with the switch either.

Reference material as printed in the source:

Each sentence has an object. {a} bundled three switches. Reading is unbundling.

## Result

**Answer.** It stops news. It does not change photos. It does not delete history before 12 months.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
