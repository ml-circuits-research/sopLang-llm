# Explanation 37.22 — Compare two groups by percentage, not absolute count

## Explanation

1. The absolute counts cannot be compared directly because the classes answered different numbers of questions, so the shares are compared instead.
2. Class A has 8/10 correct and class B has 15/20 correct.
3. The larger proportion belongs to class A, even though the other class has more correct answers in absolute terms.

Reference solution as printed in the source (chapter 37, 4 steps):

1. A: 8/10=80/100=80%.
2. B: 15/20=3/4=75%.
3. 8<15 as an absolute count, but the classes have different sizes.
4. 80%>75%, so A has the larger proportion.

## Result

**Answer.** Class A.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
