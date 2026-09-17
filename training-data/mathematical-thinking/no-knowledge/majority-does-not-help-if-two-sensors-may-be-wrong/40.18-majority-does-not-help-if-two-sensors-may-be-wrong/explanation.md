# Explanation 40.18 — Majority does not help if two sensors may be wrong

## Explanation

1. The majority answer is still yes, but now up to 2 sensors may be wrong.
2. The two sensors that agree could be exactly the 2 faulty ones, and the single dissenting sensor could be the only correct one.
3. With that fault bound the majority value is not guaranteed, so the answer is no.

Reference solution as printed in the source (chapter 40, 4 steps):

1. The assumption allows two errors.
2. The true value could be “no.”
3. Then both sensors saying “yes” are wrong, while the third is correct.
4. This scenario respects the limit, so majority no longer guarantees the truth.

## Result

**Answer.** No.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
