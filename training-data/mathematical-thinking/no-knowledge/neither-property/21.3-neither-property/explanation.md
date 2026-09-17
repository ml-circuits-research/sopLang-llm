# Explanation 21.3 — Neither Property

## Explanation

1. The 7 tokens described by the rule are exactly those that are red, have a triangle, or have both.
2. Everything else in the group of 12 tokens satisfies neither property.
3. That complement has 12 - 7 = 5 tokens.

Reference solution as printed in the source (chapter 21, 4 steps):

1. Mentally divide all tokens into two groups: those with at least one of the properties and those with neither.
2. The first group has 7 tokens.
3. The second group has 12-7=5.
4. The two groups cover all 12 tokens and do not overlap.

## Result

**Answer.** 5 tokens.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
