# Proposal — what to do next if the current experiments fail

Written 2026-09-26. This is the stop-or-continue decision document. Two experiments
are in flight; their outcomes decide the next step. No numbers here are invented:
pending measurements are marked PENDING.

## The two pending experiments

1. Agent-eval (benchmark sanity check): one agent wrote circuits by hand for 20 holdout
   problems of the two stuck books (without seeing the answers); the circuits were executed
   on the real runtime and scored against the recorded answers by the benchmark's own
   matcher. RESULT (measured 2026-09-26): 2 of 20 pass. The 18 failures are phrasing:
   the computations are right (10 items print the exact same numbers) but the recorded
   answers carry unit words, punctuation, and prose wrappers that no solver can derive
   from the statement. Conclusion: the two books' answer comparison is exact-phrase based,
   so the benchmark measures phrase reproduction, not computation, for those books.
2. The simplified-statements training run: Qwen3-1.7B trained on the two stuck books with
   one number per sentence and no distractor sentences. Holdout verdict: PENDING (~18:30 UTC).

## The stop rule
If EITHER experiment fails, we stop the dataset-design line of work. We do not launch
another training arm on a restructured dataset. The proposal below is what we do instead.

## The agent-eval FAILED (measured): the books' answer comparison is exact-phrase based
The benchmark is not broken in its computation — a competent writer computed about 18 of
20 items correctly. It is broken in its COMPARISON for the two books: the recorded answers
carry wording the statement does not determine. What we will do (next session):
1. Make the books' answer comparison value-based: extract the value-bearing tokens (numbers
   plus the verdict word) from both sides and compare those, exactly as the procedural book
   effectively does, OR canonicalize every recorded answer of the books to a
   statement-derivable form (the dv11 compression extended to all book families).
2. Re-run this agent-eval on the SAME 20 items. The pass criterion: a competent writer
   reaches 20 of 20. Until then, no training, no further arms.
3. Only after the benchmark passes the writer test do we reconsider training the model.

## If the agent-eval passes but the simplified-statements run fails
The benchmark is fine and the dataset design levers are exhausted (structure, style,
answers, statements all measured). The small model is not learning the statement-to-circuit
mapping for the two stuck books. What we would do:
1. Stop dataset restructuring. Accept the measured best (65.2% on the holdout, the container
   run) as the session's result and write it into the article as the headline finding.
2. Propose, for the NEXT session, teaching with in-context demonstrations: give the model
   one worked example (statement + circuit) of the same family before asking it to compile
   the target item, and measure whether the zero books move under that protocol.
3. Keep the wire documentation, the container abstraction, the abstraction-learning loop,
   and the infrastructure repairs as the session's other deliverables.

## What we do NOT do
- No further one-shot dataset restructurings (structure/style/answers/statements) for the
  stuck books: four arms measured, four nulls.
- No invented numbers in the article: every recorded figure stays measured.
