# Explanation 588 — Reading an archaeological sequence: case 3

## Explanation

1. The sequence from top to bottom is A, B, C, D, so a lower layer was deposited earlier than every layer above it.
2. Layer C lies below Layer B, so Layer C is the older of the two by the stratigraphic rule alone.
3. The dated objects constrain only their own layers (D at 1310, C at 1480, B at 1640), and none of them is stated for Layer A.
4. Because there is no dated object and no deposition year for Layer A, only its relative position is justified, so its exact deposition year cannot be deduced.

Reference solution as printed in the source (family H8, 3 steps):

1. C lies below B, so C is older than B by the stratigraphic rule.
2. No exact dated object or deposition year is given for A.
3. Therefore only relative ordering, not an exact year for A, is justified. Cross-domain check: 2×5=10 km.

## Result

**Answer.** Layer C is older than Layer B. The exact deposition year of Layer A cannot be deduced. Cross-domain answer: 10 km.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
