# Explanation 876 — Map scale 1:10000

## Explanation

1. The scale 1:10000 means that one centimetre on the map represents 10000 centimetres in reality.
2. Multiplying the measured 6 cm by 10000 gives 60000 real centimetres.
3. Dividing 60000 cm by 100,000 cm per kilometre gives 0.6 km, and a scale is a ratio rather than an added distance.

Reference solution as printed in the source (family N1, 2 steps):

1. Real centimetres=6×10000=60000.
2. Convert to kilometres: 60000÷100,000=0.6.

## Result

**Answer.** 0.6 km.

**Verification.** exact_verified: the executed circuit produced this answer, and the family computation reproduced it from the statement. The independence limitation of this class is stated in `report.md`.

**Program.** `solution.sop` (compiled values in `slots`, computation in `jsEval`).
