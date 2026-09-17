# Explanation 38.24 — Detect a missing letter using the length field

## Explanation

1. The length field states how many letters should follow, so comparing it with the letters actually present reveals a transmission problem.
2. The field 5 promises 5 letters, but only 3 are present.
3. Because the promise is not met, the message is incomplete or corrupted.

Reference solution as printed in the source (chapter 38, 4 steps):

1. The format requires five letters after the prefix.
2. Three are visible.
3. The message does not satisfy the format.
4. We cannot know exactly which letters are missing, but we can detect incompleteness.

## Result

**Answer.** The message is incomplete or corrupted.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
