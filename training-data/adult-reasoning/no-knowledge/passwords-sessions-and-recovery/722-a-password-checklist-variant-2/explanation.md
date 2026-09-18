# Explanation 722 — A password checklist — variant 2

## Explanation

1. Mira chooses “CasaMea2011”, and the guide asks for at least 10 characters with a capital, a digit, and a symbol.
2. The password is long enough and mixes capitals with digits, but it carries no symbol and comes from the last three, so two rules fail together.
3. The recovery answer is taken from the dog’s name on the profile photo, which the public profile shows, and the machine at the library keeps the session open after the visit.
4. The password is also sent back by email, and the guide states that an administrator never asks for the password that way.

Reference material as printed in the source:

A checklist, point by point. “Complicated enough in my head” is not a criterion.

## Result

**Answer.** No symbol. Reuse. Public recovery. Session left open. Email with the password. Length and capital/digit may be fine.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
