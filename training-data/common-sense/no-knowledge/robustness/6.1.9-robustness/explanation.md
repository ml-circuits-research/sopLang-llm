# Explanation 6.1.9 — Robustness

## Explanation

1. The weighted mean of a strategy adds, over the scenarios Normal, Difficult,, Severe, the scenario probability times the outcome, with probabilities 50%/30%/20%, so a likely scenario moves the mean more than an unlikely one.
2. The robustness rule is separate from that average: a strategy is acceptable only when every one of its scenario results reaches the threshold of 65, and A and B and C fall below it.
3. The decision then compares the weighted means of the acceptable strategies only, and the threshold leaves no strategy to choose from.
4. Dropping a strategy with a high average is therefore not a contradiction, because an average rewards likely performance while the threshold forbids an unacceptably weak outcome in any single scenario.

Reference solution as printed in the source (template 19, 4 steps):

1. Weighted means are A=76.0, B=76.5, C=60.0 using weights 0.50/0.30/0.20.
2. Minimum scenario results are A=55, B=60, C=50. Against the threshold 65, acceptable strategies are none.
3. Among acceptable strategies, the highest weighted mean is not applicable because none are acceptable.
4. Average performance and robustness are different criteria: the average rewards likely performance, while the threshold forbids an unacceptably weak outcome in any scenario.

## Result

**Answer.** Weighted means: A=76.0, B=76.5, C=60.0. After the robustness threshold, the choice is none of the strategies.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
