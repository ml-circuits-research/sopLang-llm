# Explanation 479 — Coalition formation: case 4

## Explanation

1. The stated seats are A=6, B=6, C=2, and a coalition is winning when its seat total reaches 8.
2. Enumerating every non-empty subset and keeping the ones that reach the threshold gives the winning coalitions.
3. A winning coalition is minimal exactly when dropping any of its members leaves the rest below 8; the coalitions that pass are AB (12), AC (8), BC (8).

Reference solution as printed in the source (family N21, 3 steps):

1. Majority threshold=8.
2. Add seats for each possible coalition.
3. Minimal winning coalitions: [('AB', 12), ('AC', 8), ('BC', 8)].

## Result

**Answer.** AB with 12 seats; AC with 8 seats; BC with 8 seats.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
