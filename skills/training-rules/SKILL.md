# Training rules for small models on synthetic data

The measured methodology of a fine-tuning series that took a small language model from zero to
reliable compilation of a domain-specific program language, arm by arm, each arm one change.
Every rule here is portable: it came from a number, and it applies to any project that teaches a
small model a task via generated data. Project-specific machinery is named in angle brackets.

## 1. The coverage law

The model answers what it has been shown, and almost nothing else: ~98-99% on plan shapes seen in
training, 12-25% on shapes that occur nowhere. The lever is coverage of plan shapes, not volume of
the same shapes. More instances of a covered plan buy recall, not generalization.

## 2. The vocabulary hypothesis

Generalization composes within a shared operator vocabulary and does not cross it: chains of
trained operators generalize at 100% on unseen chains; an unseen operation drops to first-exposure
levels; families using operations outside the vocabulary barely move, at any model scale. Grow the
vocabulary one tranche at a time, and keep a census that measures which operations the real target
data uses and which are missing.

## 3. Structural splits, decided before rendering

A split is a declaration, not a filter. The inventory is the authority: whole compositions are
named as held out before any instance is rendered, reserved compositions have zero training rows,
and the split is verified with counts after every rebuild. Never choose what to hold out after
seeing results; never hold out instances of a trained shape.

## 4. The assertion policy

A domain assertion must be an invariant the ANSWER has to satisfy - a mathematical guard tied to
correctness. Three defect classes: false guards (fire on a valid instance), disconnected
boilerplate (restate the generic contract the executor already owns), and honest cases (zero
qualifying, absent target, empty filter, tied winner - these are answers, never errors). Keep an
assertion only if it proves something about the answer; better none than a wrong one. Sampling
clauses may refuse unobservable draws, but the emitted circuit must never reject a valid answer.

## 5. Target form: move generic and recurring text out of the model

Everything the model emits that repeats identically is waste and error surface: fixed preambles,
helper lines, contract checks the executor already performs. Move the generic contract into the
executor once (the sandbox provides the probe helper; the command asserts its own input/output
contract). Move each recurring multi-line transcription into a declarative primitive the model
names instead of writes - then that primitive's error class becomes impossible, not merely rarer.
Single-line expressions stay inline; the rule is about big repeated code, not about renaming
one-liners.

## 6. Retries are deployment, not measurement

The deployed interface may retry a failed plan (parse/wrapper/execution failures) with the full
numbered failure history fed back. The scored evaluations stay first-shot by contract. Measure the
retry recovery rate; on a small model retries may convert failures to execution without
converting them to correct answers - know which one you are buying.

## 7. Training economics

Stop at the measured peak: when selection scores plateau at ~60-70% of the planned steps, the rest
buys nothing. Use validation during training (score a small unseen slice at every save) with
patience 5-10 saves, cap epochs at the measured peak, and save at a cadence that keeps selection
cheap. Do not cut the dataset or the per-family dose: coverage is the gain, and it is measured.

## 8. Base selection: measured shootout, size ceiling until exhausted

Choose the base by a measured shootout, not branding: the same eval statements answered in prose
by every candidate, scored against the printed answers. A base must beat the incumbent on
reasoning while holding the emission quality the task needs. Stay in a size class until it is
exhausted and shown insufficient - scale raised in-vocabulary recall but never moved the
vocabulary boundary, so scale is a multiplier of proven data, not a substitute for it.

## 9. Reporting and model identity

Percentages always carry their counts; decomposed numbers beat aggregates (per family, per plan
cluster, per book); when comparing two numbers, name both sides and what changed between them.
Record each arm's hypothesis before running it. A trained model's identity is: its size, its
base model, its training-data version, and the date and time its training finished - reported
as one sentence, never as a bare checkpoint number or an internal experiment id alone. The data
version is the counter in the dataset's VERSION file with its human label (what changed), and
it enters the arm name (`exp-NNN-<size>-<base>-<dataVersion>`), so the name alone tells the
owner what runs.

## 10. Operations discipline

Launch, disk, and watch discipline live in the `night-orchestration` skill: one worker at a time,
preflight before every launch, result artifacts as completion signals, proactive pruning, and a
health check before and after every action.
