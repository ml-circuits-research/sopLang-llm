# Explanation 976 — Coalition formation: case 1

## Explanation

1. The stated seats are A=8, B=3, C=2, and a coalition is winning when its seat total reaches 7.
2. Enumerating every non-empty subset and keeping the ones that reach the threshold gives the winning coalitions.
3. A winning coalition is minimal exactly when dropping any of its members leaves the rest below 7; one coalition passes A (8).

Reference solution as printed in the source (family N21, 3 steps):

1. Majority threshold=7.
2. Add seats for each possible coalition.
3. Minimal winning coalitions: [('A', 8)].

## Result

**Answer.** A with 8 seats.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
