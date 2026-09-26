# Proposal — what to do next if the current experiments fail

Written 2026-09-26. This is the stop-or-continue decision document. Two experiments
are in flight; their outcomes decide the next step. No numbers here are invented:
pending measurements are marked PENDING.

## The two pending experiments

1. Agent-eval (benchmark sanity check): one agent writes circuits by hand for 20 holdout
   problems of the two stuck books (without seeing the answers); a second, independent
   agent executes and scores them against the recorded answers. Result: PENDING.
2. The simplified-statements training run: Qwen3-1.7B trained on the two stuck books with
   one number per sentence and no distractor sentences. Holdout verdict: PENDING (~18:30 UTC).

## The stop rule
If EITHER experiment fails, we stop the dataset-design line of work. We do not launch
another training arm on a restructured dataset. The proposal below is what we do instead.

## If the agent-eval fails (a competent writer cannot pass the benchmark)
The benchmark itself is the problem: the statements do not determine a computable answer
for a competent reader, or the recorded answers are not derivable from the statements.
What we would do:
1. Open the failing items one by one and classify the failure: ambiguous question, missing
   number, or a wrong recorded answer.
2. Fix the families at the source (the statement generators in teacher/sources/ and the
   family parse/solve in teacher/families/), re-run the validation gate (training-data/verify.mjs),
   and re-run the agent-eval on the SAME 20 items until a competent writer passes 20/20.
3. Only after the benchmark is provably solvable by hand do we consider training again.

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
