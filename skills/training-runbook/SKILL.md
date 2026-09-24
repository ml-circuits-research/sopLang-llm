# Training runbook for small models on synthetic data

The end-to-end procedure, one arm at a time, portable across projects. Read the
`training-rules` skill first; this file is the how. Project-specific paths and commands are named
in angle brackets; the operational tools (preflight, watchers, disk guard, health check) come from
the `night-orchestration` skill.

## 0. Design the arm

One arm = one change: one hypothesis (a data tranche, a base model, a recipe parameter). Name it
and record the hypothesis before running anything. The name carries what the owner needs to
understand what runs: `exp-NNN-<size>-<base>-<dataVersion>`, for example
`exp-018-1.7b-qwen3-dv3`. The data version is the counter in the dataset's VERSION file,
bumped at every dataset change; the version's human label (what changed) lives beside it and is
what the owner sees, not the number alone. A parser or executor change is a version increment
with a data migration, not an arm. The chain records the training timestamps and the data
version in the evaluation manifest, so any report or interface can show when a model was
trained and on which data version - checkpoint numbers are implementation detail, never the
identity of a model.

## 1. Extend the generator (data arms only)

One authority per operator: one object carrying its input type, output type, the computation, the
sentence it renders, and the clause the sampler must satisfy. Compositions are declared chains of
operators with their depths; reserve a few whole compositions as held out before rendering. The
inventory validates itself on load - a broken inventory fails the build, not the night.

## 2. Verify the families before any build

Write the checks as tests so the next tranche inherits them: statement parse round-trips the drawn
parameters exactly; the generated circuit agrees with the independent oracle on 20+ samples; a
statement naming a different operation is refused. Run only the targeted tests.

## 3. Rebuild and export

Regenerate the dataset from the declared sources, verify every answer reproduces, export the
training rows, run the suite. Never rebuild while an evaluation chain reads the data.

## 4. Train

Launch detached through the night-orchestration tools: preflight first (no second worker, disk
headroom, valid resume), then the frozen recipe. The recipe is frozen across arms so the only
variable is the change under test. A different base model adds its pinned manifest.

## 5. The evaluation chain

1. Selection: every saved checkpoint scored on the validation slice; winner by primary metric,
   validity as tiebreaker; never by training loss.
2. Holdout: the winner on the sealed held-out items, reported decomposed (reserved compositions,
   old families, real target data) - never the aggregate alone.
3. Probes: capability probes as part of the same pass.

The completion signal is the metrics artifact - a failed chain also writes "done" in its log.

## 6. The fair baselines

Ask each untrained base the eval statements in prose and compare against the printed answers. The
compiled student and the prose base answer the same items their own way; asking an untrained base
to emit the target language is meaningless.

## 7. The retry sweep (before the next round)

Run the scored runner on the previous winner with 0, 1, and 2 retries over the same suite and
compare: that is the measured value of the deployed retry loop. The scored metrics stay 0.

## 8. Report and clean up

Write the arm into the analysis file with every number decomposed and compared; the owner-facing
file holds only the latest status. Prune the closed arm completely (per the disk discipline: keep
the winner artifact, the logs, the reports - nothing else). Run the operation census so the
coverage gap stays current.

## 9. The deployment surface

Serve the newest winner by default; show every trained model side by side with its timing; keep
the untrained bases behind an explicit command; persist the interaction history to disk; never
leave model servers running after the interface closes (the reaper watches the parent). Every
model block states the model's identity as the owner reads it: size, base, data version, and
training finish time, derived from the pinned base manifest and the evaluation manifest - the
checkpoint number stays internal.
