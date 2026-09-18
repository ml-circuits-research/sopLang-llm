# Explanation 791 — 90% of whom? — variant 1

## Explanation

1. The quoted sentence speaks only about the 20 customers who replied, so 90% of them is about 18 people, not a fact about the 400 sales.
2. Drew drops that limit and turns the result into "90% of customers are satisfied", which claims a share of everybody.
3. The remaining 380 customers never replied, so their opinion is unknown and cannot be counted on either side.

Reference material as printed in the source:

The percent’s base is in the clause “who replied”. Reflex: “90% of whom?”.

## Result

**Answer.** Of 20 respondents (≈18 people), not of 400. Non-response is unknown.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
