# Explanation 694 — Provenance and chain of custody: case 4

## Explanation

1. Read the 4 dated record entries and order them by day.
2. Follow the object through its 3 handoffs, checking that each handoff leaves the object with the holder the next one starts from.
3. The day-5 record fails the rule, so the chain has a gap that limits certainty.
4. The appended check, when present, is a separate arithmetic question answered in the labelled suffix.

Reference solution as printed in the source (family N14, 3 steps):

1. Read the transfers in time order.
2. Check that every transfer links the previous holder to the next.
3. The day-5 record lacks a sender, so the chain has a gap. Cross-domain check: compare 8 with 5; 8≥5 is true. Mixed-domain verification: 71+5=76.

## Result

**Answer.** The chain is incomplete because the day-5 sender is missing. Cross-domain answer: quorum is met. Mixed-domain answer: 76 map sheets.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
