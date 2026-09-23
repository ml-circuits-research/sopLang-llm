# Training rules of the sopLang-llm fine-tuning series

The measured knowledge of the series, distilled from the experiments and their analyses
(`evaluation/registry/phase4-analysis.md` is the record). Every rule here was learned from a
number; each entry names the experiment or finding it comes from.

## 1. The coverage law

The model answers what it has been shown, and almost nothing else. Measured on the
validation slice of every arm: 98-99% on plan fingerprints seen in training, 12.5-25% on
plan fingerprints that occur nowhere in the training rows. The export holds 941 distinct
plans across ~9700 rows, distributed from 1.7 to 100 rows per plan.

**Consequence:** the lever is coverage of plan shapes, not volume of the same shapes. More
instances of an already-covered plan buy recall, not generalization.

## 2. The vocabulary hypothesis (finding D-L and the census arms)

The diagnostic (diag-009) showed the model completes the nearest memorized family instead of
applying the operation the statement asks for. The composition inventory (exp-011) then
showed why: compositions that reuse the trained operators generalize at 100% on unseen
chains, and compositions using new operators generalize at 60% at first exposure. The book
holdout barely moves because its plans use operations outside the generated vocabulary.

**Consequence:** generalize within a vocabulary, one operator tranche at a time. The
operation census (`evaluation/census.mjs`) is the compass: it measures which operations the
book families perform and which are missing; each tranche adds the missing ones as declared,
composable operators. Time arithmetic, graph traversal, probability, and two-dimensional
geometry are the known gaps; they need a two-input chain shape.

## 3. Structural splits, decided before rendering

A split is a declaration, not a filter. The inventory (`teacher/procedural/compositions.mjs`)
is the authority: compositions are listed, the reserved ones are named in `HELD_OUT`, and
the split is applied to whole compositions before any statement is rendered. A reserved
composition must have **zero training rows**; a bug where the hash-only walk put reserved
compositions into training was found and fixed before the next arm ran.

**Consequence:** never choose what to hold out after seeing results; never hold out
instances of a trained composition; verify the split with counts after every rebuild.

## 4. The assertion policy (the owner's rule, applied by the audit)

A domain assertion inside a compute body must be an invariant the ANSWER has to satisfy —
a clear mathematical guard tied to correctness (a remainder smaller than the divisor, a
count between zero and the word length, a total divisible by its count). Three defect
classes were audited and fixed:

- **False guards:** an assertion that can fire on a valid instance (the reference defect:
  `occurrences >= 1` after a character-count of a substring, killing a correct 0).
- **Disconnected boilerplate:** checks that restate the generic contract the jsEval command
  already owns (non-empty slots, non-empty string, integer, positive).
- **Honest cases:** zero qualifying scores, an absent target, an empty filter, a tied
  winner — these are answers ("No scores qualify, so an exact average cannot be computed.",
  "0 records were kept."), never execution errors.

**Consequence:** keep an assertion only if it proves something about the answer; better none
than a wrong one. Sampling-time clauses may still refuse unobservable draws, but the emitted
circuit must never reject a valid answer.

## 5. The target form

Trained targets carry the computation and the family's own domain assertions, and nothing
else. The fixed probe preamble was removed (it was 18.96% of target tokens, identical in
every occurrence), and the probe helper line was removed too: the `jsEval` command
(version 2.1.0) asserts the generic input/output contract and provides `probe` in the
sandbox, so a body writes bare `probe(...)` calls. The chat profile is
`compiled-plan-chat-4`. Any parser or runtime change requires a version increment and a
dataset migration.

## 5b. Declarative wires replace big JavaScript (owner directive, 2026-09-23)

From the wire-typed generation onward, every multi-line transcription in the procedural
generator emits a declarative wire command instead of a hand-written jsEval body:
`pathExists` and `neighbourCount` emit `graphPath`, `probability` emits `fraction`, and the
filter-then-summarize stage pairs emit `aggregate`. The one-line operator transcriptions
stay jsEval — the directive is about big JavaScript, not about renaming single expressions.
The model learns to use the wires because the training targets carry them, and each wire
makes its error class impossible instead of merely rarer (proposal_wires.md is the evidence).
A new wire command is a parser/runtime change with a version increment and a dataset
migration — never a silent addition.

## 5c. Base selection: the shootout and the 2B ceiling (owner decision, 2026-09-23)

The next base is chosen by a measured shootout, not by branding: the prose baseline on the
same 585 eval items for every candidate — 0.5B coder (63), 1.5B coder (30), 1.5B general,
Qwen3-1.7B — and the winner must beat the incumbent on reasoning while holding code emission
(the procedural recall the coder base delivers). No jump to the 4B and 8B classes until the
sub-2B class is exhausted and shown not to be enough: scale raised in-vocabulary recall
(322 vs 258 at 1.5B) but never moved the vocabulary boundary (books 2 of 225 at both sizes),
so scale is a multiplier of proven data, not a substitute for it.

## 6. The four-model comparison

The bases and the students are different instruments:

- Untrained bases answer in **prose** (`Answer the problem directly and briefly.`); asking
  them for SOP Lang is unfair and meaningless.
- Fine-tuned students **compile** under the recorded profile; the executed answer is
  compared with the printed answer, never the code.

Measured prose baselines on the 585 eval statements: 0.5B base 63 (10.8%), 1.5B base 30
(5.1%). The compiled students are measured on the same items by their chains.

## 7. Retries are deployment, not measurement

The deployed chat retries a failed plan (wrapper-rejected, parse-invalid, execution-error)
up to `--retries` extra times (default 2), each retry carrying the full numbered history of
the previous failures. The scored evaluations stay single-shot: the metrics are first-shot
by contract, so `--retries 0` is the historical default of the runners. The recovery rate
is measured (`/stats`: retries recovered of failed first shots), not assumed.

## 8. Training economics

Measured on exp-012: the model peaked at step ~450-630 of 912 (epoch 1.5-2.1) and the last
third added nothing. The planned reductions, to apply from the next arm:

- **Validation during training:** score a small unseen slice at every save, stop when it
  plateaus (patience 5-10 saves, not 2).
- **Two epochs as the cap**, three only when validation says so.
- **Save every ~150 steps** instead of 90, halving the selection cost.

Do not cut the dataset or the dose per family: coverage is the gain, and it is measured.

## 9. Hygiene

- One trainer at a time; long jobs detached (`start-detached.sh`); guards (watchdog,
  disk guard) beside any queued run.
- After an experiment closes, prune the non-winner GGUF conversions; keep each winner,
  the base GGUF, and every log, report, metric and item.
- A dataset rebuild or export regeneration must never run while an evaluation chain reads
  `training-data/`.
