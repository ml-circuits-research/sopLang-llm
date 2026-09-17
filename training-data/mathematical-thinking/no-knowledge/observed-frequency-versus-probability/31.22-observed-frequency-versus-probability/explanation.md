# Explanation 31.22 — Observed frequency versus probability

## Explanation

1. A probability describes the chance on each individual trial; it constrains the rate over many trials, not the exact result of a small batch.
2. Every observed result keeps the stated probability, so the observed run has probability greater than zero and is fully compatible with the rule.
3. A run of 4 tosses landing the same way is just one of the possible outcomes and contradicts nothing, so the answer is no.

Reference solution as printed in the source (chapter 31, 4 steps):

1. The rule does not say that every 4 tosses must contain exactly two A results.
2. The sequence AAAA is possible, though less common than some groups of sequences.
3. A small batch can be unbalanced.
4. The observation does not contradict the stated probability.

## Result

**Answer.** No.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
