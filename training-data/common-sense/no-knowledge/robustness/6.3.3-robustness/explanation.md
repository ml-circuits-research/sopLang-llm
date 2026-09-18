# Explanation 6.3.3 — Robustness

## Explanation

1. The weighted mean of a strategy adds, over the scenarios Normal, Difficult,, Severe, the scenario probability times the outcome, with probabilities 50%/30%/20%, so a likely scenario moves the mean more than an unlikely one.
2. The robustness rule is separate from that average: a strategy is acceptable only when every one of its scenario results reaches the threshold of 60, and A and C fall below it.
3. The decision then compares the weighted means of the acceptable strategies only, and the largest mean among them belongs to B, so the choice is B.
4. Dropping a strategy with a high average is therefore not a contradiction, because an average rewards likely performance while the threshold forbids an unacceptably weak outcome in any single scenario.

Reference solution as printed in the source (template 19, 4 steps):

1. Weighted means are A=72.0, B=86.0, C=68.5 using weights 0.50/0.30/0.20.
2. Minimum scenario results are A=50, B=60, C=55. Against the threshold 60, acceptable strategies are B.
3. Among acceptable strategies, the highest weighted mean is B.
4. Average performance and robustness are different criteria: the average rewards likely performance, while the threshold forbids an unacceptably weak outcome in any scenario.

## Result

**Answer.** Weighted means: A=72.0, B=86.0, C=68.5. After the robustness threshold, the choice is B.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
