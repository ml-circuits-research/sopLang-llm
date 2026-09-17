# Explanation 21.22 — Classification into Three Non-Overlapping Boxes

## Explanation

1. A classification is non-overlapping only when each rule selects exactly the numbers of its own box.
2. The proposed rule for B also selects 7, 8, 9 from other boxes, so it overlaps them.
3. Restricting that rule to its intended range 4–6 removes the overlap.

Reference solution as printed in the source (chapter 21, 4 steps):

1. According to the rule for B, 7, 8, and 9 go into B because they are greater than 3.
2. According to the rule for C, the same numbers also go into C.
3. Therefore, some objects would go into two boxes.
4. B also needs an upper bound: greater than 3 and at most 6.

## Result

**Answer.** The rule for B must be limited to 4–6.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
