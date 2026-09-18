# Explanation 195 — Provenance and chain of custody: case 5

## Explanation

1. Read the 4 dated record entries and order them by day.
2. Follow the object through its 3 handoffs, checking that each handoff leaves the object with the holder the next one starts from.
3. Every handoff names both sides and connects to the previous holder, so the chain is continuous.
4. The appended check, when present, is a separate arithmetic question answered in the labelled suffix.

Reference solution as printed in the source (family N14, 3 steps):

1. Read the transfers in time order.
2. Check that every transfer links the previous holder to the next.
3. Every handoff names both sides and connects continuously. Cross-domain check: 11−4=7 independent reports remain.

## Result

**Answer.** The chain is complete under the stated rule. Cross-domain answer: 7 independent reports.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
