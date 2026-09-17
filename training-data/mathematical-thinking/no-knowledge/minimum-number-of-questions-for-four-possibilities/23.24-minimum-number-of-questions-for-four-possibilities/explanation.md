# Explanation 23.24 — Minimum number of questions for four possibilities

## Explanation

1. Each yes/no question has two answers, so one question can separate at most two of the 4 boxes.
2. Two questions have four possible answer sequences, one for each box, so two well-chosen questions are enough and one is never enough.

Reference solution as printed in the source (chapter 23, 4 steps):

1. With one question there are only two possible outcomes: yes or no.
2. Four boxes cannot receive four distinct outcomes from only two answers.
3. With two questions there are four possible answer combinations.
4. We can assign one combination to each box, so two questions can be sufficient.

## Result

**Answer.** At least 2 questions are necessary; 2 can be sufficient.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
