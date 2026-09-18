# Explanation 614 — Which institution has the role? Organize the ballot count

## Explanation

1. The requested action is "organize the ballot count", and the task offers Election Committee and Public Works Office as the two candidates.
2. The stated function of Election Committee is "administers elections", which covers that action; no other stated function does.
3. The other candidate is not the first match, because the constitution assigns it a different function and power alone never routes a request.
4. So the request goes first to the Election Committee, whose stated role is the one that authorizes this action.

Reference solution as printed in the source (family C5, 3 steps):

1. Identify the action: organize the ballot count.
2. Find the role whose definition contains that function: Election Committee.
3. Public Works Office has a different stated role, so it is not the first match. Cross-domain check: compare 8 with 6; 8≥6 is true.

## Result

**Answer.** The request should go first to the Election Committee. Cross-domain answer: quorum is met.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
