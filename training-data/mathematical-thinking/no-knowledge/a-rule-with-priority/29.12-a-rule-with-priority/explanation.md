# Explanation 29.12 — A rule with priority

## Explanation

1. The rules are ordered and the first applicable one wins, so the chain must be scanned from the top and stopped at the first match.
2. For the value 0 the first rule applies immediately, which means the later even rule and the default label are never reached.
3. The output is therefore the label stop, not the even branch.

Reference solution as printed in the source (chapter 29, 4 steps):

1. 0 can be considered even under the usual definition given by grouping into pairs.
2. But the first rule tested is x=0.
3. It is true and has priority.
4. We never reach the parity test.

## Result

**Answer.** “stop”.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
