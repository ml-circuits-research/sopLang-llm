# Explanation 218 — A small sample is noisy — North Copse — case 8

## Explanation

1. North Copse lists 2 mornings, 1 late and 1 on time, so the record is almost all noise at n = 2.
2. Jules hardens those mornings into a bus type, and Ned reads the one miss as proof of a useless service; both claims outrun the list.
3. Kat is right that a type needs more cases or a mechanism, and one miss only refutes “never late,” a sentence nobody was owed.

Reference solution as printed in the source (section 22, 5 steps):

1. Sample size is part of inductive strength.
2. Types need more cases or a mechanism.
3. One miss refutes “never late,” which nobody was owed.
4. Do not let annoyance do the counting.
5. Stop at the edge of the list.

## Result

**Answer.** Almost nothing as a type. n = 2 is almost all noise. A single miss is not a destiny.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
