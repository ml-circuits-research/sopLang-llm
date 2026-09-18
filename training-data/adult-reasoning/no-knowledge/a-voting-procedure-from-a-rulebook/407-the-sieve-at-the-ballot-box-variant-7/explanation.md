# Explanation 407 — The sieve at the ballot box — variant 7

## Explanation

1. Ned has been a member for 26 days, which is below the 30 the rulebook requires, so Ned is not a valid voter even though the dues are paid.
2. The vote sent by phone is not a secret vote on a stamped paper, so it cannot enter the count.
3. Only 19 valid members are present, below the floor of 20, and the rulebook reconvenes the round in Forest Parish on that ground alone.
4. The paper with two stamps is void under the same rulebook, but the presence shortfall already decides the round.

Reference material as printed in the source:

A sieve with three meshes. Who fails one hole never reaches the box. Presence is counted after the filters, not by who “dropped by”.

## Result

**Answer.** Ned has 26<30 → does not vote. The phone is not a paper. 19<20 → reconvene. The double paper is void, but the round already falls on presence.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
