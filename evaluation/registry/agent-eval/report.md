# Agent-eval: can a competent circuit-writer pass the benchmark?

Run 2026-09-26. 20 holdout items (10 decompose-to-solve, 10 common-sense), the two books
on which every trained model scores zero. One agent wrote the circuits from the statements
alone (the recorded answers were withheld from it); the circuits were then executed on the
real runtime and compared with the recorded answers through the benchmark's own matcher.

## Result: 2 of 20 pass, 18 fail, 0 copies.

The two passing items are the families whose recorded answers were already compressed to a
bare value form ("52 minutes: feasible."). The 18 failures are almost entirely phrasing:
10 of them print the EXACT same numbers as the recorded answer and differ only in unit
words, punctuation, or sentence wrapper; the rest print the correct final value plus extra
intermediate numbers (e.g. "P(event present | positive) = 30.2% (170 true positives of 562)"
against a recorded "Approximately 30.2% of positive alerts are true positives."). The
computation was right in about 18 of 20 items.

## What this proves

The benchmark's answer comparison is exact-phrase based, and the recorded answers of these
two books carry wording that a competent solver cannot derive from the statement (unit
words, wrappers, en-dashes, prose). A correct computation fails unless it reproduces the
recorded wording verbatim. This is the same strictness that made every trained model score
zero on these books: the books measure phrase reproduction, not computation. The procedural
book scores high because its answers are bare numbers and yes/no verdicts.

## Decision

Per the owner's stop rule (an experiment failed -> stop), the dataset-design line stops
here. The next step, written in proposal.md: make the books' answer comparison value-based
(or canonicalize every recorded answer to a statement-derivable form), re-run this
experiment until a competent writer passes 20/20, and only then reconsider training.
