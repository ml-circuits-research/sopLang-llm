# Explanation 115 — Elimination by clues

## Explanation

1. Each clue fixes the value of one property for the unknown case, so the case that must be identified is the one whose recorded values match all of them.
2. Applying the clues one after another removes the cases that contradict them: after “the pollution source is reduced = YES” only A, B, D remain; after “water is monitored = YES” only A, D remain; after “the habitat is not destroyed of intervention = YES” only D remains.
3. No case is eliminated by a property the clues leave open, and the surviving case D agrees with every clue at once.
4. A single remaining case is the answer; while two or more survive, the clues would not identify the unknown case.

Reference solution as printed in the source (form 5, 5 steps):

1. We take the first clue and eliminate any case that has the opposite value for that property.
2. after applying the clue “the pollution source is reduced = YES”, the compatible cases are: A, B, D.
3. after applying the clue “water is monitored = YES”, the compatible cases are: A, D.
4. after applying the clue “the habitat is not destroyed of intervention = YES”, the compatible cases are: D.
5. after all clues are applied, only one case remains: D.

## Result

**Answer.** Case D.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
