# Explanation 180 — The trap of affirming the back — Kalmford — case 10

## Explanation

1. The card says rain suffices for a wet pavement, and the pavement is wet.
2. Sol and Wes read the wet pavement as proof of rain, which affirms the back of the card.
3. The street-cleaning truck is a second door to the same wet pavement, so the observed back does not select rain.
4. The card would force rain only if it read "wet only if rain", and it does not.

Reference solution as printed in the source (section 18, 5 steps):

1. If A then B. B observed. A is not forced.
2. A rival path blocks the proof.
3. Matching the then-clause feels like confirmation.
4. Feeling is not the link.
5. “Wet only if rain” would be a different sentence.

## Result

**Answer.** No. Sol and Wes affirm the back. The card gives rain as one sufficient path, not the only path.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
