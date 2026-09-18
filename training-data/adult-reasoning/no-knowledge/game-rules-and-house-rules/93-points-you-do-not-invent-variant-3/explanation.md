# Explanation 93 — Points you do not invent — variant 3

## Explanation

1. The bridge the referee of the Maple Ward hall calls incomplete is taken down and scores nothing, so Kara keeps the starting 10 points and never collects the 3 a correct bridge would pay.
2. Saying “don’t put it there” about another player’s plan costs 2 once per turn, which brings the score to 8.
3. The extra piece came from the common pile, so the turn ended when it was returned; everything done after that adds nothing, and the claim of a win is invented.
4. 8 is below the 12 points the hall rules require, so there is no win.

Reference material as printed in the source:

Points arrive only through written channels. The referee closes the dispute about the bridge. −2 applies once. The 12 threshold is missed even before the penalty (10 < 12). The claim 10+3 ignores the “incomplete” verdict.

## Result

**Answer.** Incomplete bridge = 0. Forbidden talk = −2. Left with 8. Continuing after the extra piece is forbidden anyway. 8 < 12.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
