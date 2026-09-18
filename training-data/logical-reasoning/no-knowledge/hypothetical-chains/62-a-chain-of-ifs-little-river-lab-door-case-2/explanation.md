# Explanation 62 — A chain of ifs — Little River lab door — case 2

## Explanation

1. The card carries three links: if the red key is issued then the inner light comes on; if the inner light is on then the lock may be turned; if the lock is turned then the archive opens.
2. Ben is issued the red key, so the first antecedent is present and the chain transfers that presence forward link by link.
3. The last consequent is the conclusion the card forces: the archive opens.
4. Cara denied the front of the first link and treated that denial as a proof of the opposite end, but the card never says the key is the only possible door, so Cara is writing a second document.

Reference solution as printed in the source (section 7, 5 steps):

1. If A then B, if B then C, if C then D, therefore if A then D.
2. A is present for the person with the key.
3. Denying A does not prove not-D.
4. Chains transfer presence forward.
5. Copy each link; do not jump.

## Result

**Answer.** The archive opens. Cara denied the front of the first link and treated that as a proof of the opposite end. The card did not say the key is the only possible door.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
