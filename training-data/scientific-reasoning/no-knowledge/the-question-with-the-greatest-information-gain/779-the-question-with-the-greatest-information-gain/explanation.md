# Explanation 779 — The question with the greatest information gain

## Explanation

1. A question about a property held by 2 of the 4 candidates separates them into 2 and 2, so one answer leaves at most 2 candidates.
2. The candidates are nested, so the three properties are held by one, two, and three candidates: asking about either extreme leaves three candidates in the worst case, and only the property held by two candidates leaves two.
3. The printed question “can it actively shorten?” is therefore the one with the greatest guaranteed information, reported as the 2/2 split.
4. Counting the candidates that a question does not separate is what makes the worst case visible; a question about a rare property looks useful but eliminates almost nobody when the answer is YES.

Reference solution as printed in the source (form 34, 4 steps):

1. The question about “is rigid” produces the split 1/3.
2. About “can transmit force”: 3/1; about “can actively shorten”: 2/2.
3. In the worst case, the optimal question leaves only 2 candidates.
4. The most balanced split maximizes the information guaranteed by a single answer.

## Result

**Answer.** The optimal question is “can it actively shorten?”, with split 2/2.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
