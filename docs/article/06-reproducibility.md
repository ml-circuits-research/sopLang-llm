# 6. Reproducibility

The artifact is the repository itself, and the method's most unusual claim — that the whole experiment loop was run by a coding agent — is reproducible in the same sense as the data: the procedure, the gates, and the skills are all shipped. Every number in this article is reproducible from source, and the commands below are the exact ones the series uses. No GPU is required to verify the data or to reproduce an analysis; only training and serving need one.

## The coding-agent methodology

The loop is not a human's lab notebook; it is a set of portable skills the agent executes, each with a written contract:

- `skills/training-rules/` — the measured laws (the coverage law, the vocabulary hypothesis, the one-change-per-arm rule) that any generated-data fine-tuning project inherits.
- `skills/training-runbook/` — the end-to-end procedure: design the arm, name it (`exp-NNN-<size>-<base>-<dataVersion>`), record the hypothesis before running, bump the `VERSION` counter with a human label, and let the manifest record which data version a checkpoint actually saw.
- `skills/wire-discovery/` — ranks recurring `jsEval` shapes by (frequency × mean-lines × error-share) so the next wire proposal is decided by measurement.
- `skills/data-quality/` — a deterministic scanner that flags bodies which outgrown a single wire (the bloat indicator), with no model calls and no server.
- `skills/night-orchestration/` — the discipline for unattended runs.

The gates are the load-bearing part of the method, and each one encodes a lost night:

1. **One worker at a time.** The launcher refuses a second concurrent worker, rather than warning.
2. **A preflight gate** checks for no other worker, no duplicate supervision, enough disk, and no resume from an incomplete checkpoint.
3. **The completion signal is an artifact, never a log line** — a failed chain also writes "done"; the watcher waits for the result artifact, not for the log tail.
4. **A disk guard** warns below 40 GiB and stops work below 16 GiB; **the watcher keeps waiting** on a stale failure line instead of exiting.

## Repository layout

| path | what it is |
| --- | --- |
| `runtime/` | the SOP Lang kernel: parser, dependency analyzers, graph builder and scheduler, epoch loop, value store, container store, transaction layer, JavaScript sandbox (`kernel.mjs`, `executor.mjs`, `graph.mjs`, `containers.mjs`, `metaprogramming.mjs`, `values.mjs`, `schema.mjs`). |
| `wires/` | the wire command registry and standard vocabulary (`wires/standard/`: `jsEval`, `literal`, `graphPath`, `aggregate`, `fraction`, `input`, `modelCall`, and the container commands). |
| `teacher/` | the teaching pipeline: the family generator (`teacher/families/`), the procedural composition inventory (`teacher/procedural/compositions.mjs` and sibling family modules), and the dataset builder. |
| `training-data/` | the generated suite: statements, reference `solution.sop` circuits, manifests, and the `VERSION` counter with its human label. |
| `evaluation/` | the evaluation core (`run-eval.mjs`, `run-diagnostic.mjs`, `analyze-holdout.mjs`), the census, the diagnostic suites, and the per-arm registry (`evaluation/registry/exp-*`). |
| `skills/` | the portable methodology, reusable outside this project: `training-rules`, `training-runbook`, `night-orchestration`, `wire-discovery`, `data-quality`. |
| `docs/specs/` | the language contracts: `DS002-sop-lang-core.md` (wires, dependencies, epochs, metaprogramming, runtime contract) and `DS004-wire-types.md` (the wire vocabulary). |
| `vision/` | the research handbook and the seeded books, treated as read-only source material. |

## The verification contract

Data is verified in every phase, and the same gates run after every change:

```bash
# 1. Every shipped circuit executes and reproduces its printed answer.
node training-data/verify.mjs

# 2. Family round-trip and oracle tests hold the generator honest.
node --test tests/procedural.test.mjs
node --test tests/composition-tranche.test.mjs
node --test tests/scheduling-tranche.test.mjs
```

`verify.mjs` scans every `solution.sop`, executes each circuit without model bindings, and compares the executed answer with the manifest's printed answer — the reactivity judgment (a perturbed `slots` literal must change the answer) is what distinguishes a plan from a template.

## Reproducing an analysis

```bash
# The per-item failure analysis of any closed arm.
node evaluation/analyze-holdout.mjs --experiment exp-012-census

# The wire-shape census over the shipped circuits.
node skills/wire-discovery/scripts/discover-wires.mjs

# The bloat indicator over the shipped bodies.
node skills/data-quality/scripts/static-check.mjs
```

The semantic re-score is documented in `summary.md`; its per-model and per-book tables are the source of every "exact → semantic" number in this article.

## The identities that matter

A trained model's identity is never a bare checkpoint number. It is stated as one sentence: size, base model, data version (the `training-data/VERSION` counter with its human label), and the date and time training finished. The arm name carries the same information (`exp-018-1.7b-qwen3-dv4`), and the evaluation manifest records the data version the checkpoint was actually trained on — the series caught a traceability defect (a report naming a dataset snapshot no evaluated item came from) and recorded the fix as decision D-H.

## What is and is not reproducible

The data, the runtime, the verification, and every analysis are deterministic and reproducible from source. Neural generation is *not* bit-for-bit reproducible: the project distinguishes exact replay (substituting a recorded response only when the definition hash, command identity, and dependency hashes all match) from a fresh rerun, and records which one a trace entry is. The claims in this article are claims about measured behavior of named artifacts, each traceable to its own `run-manifest.json` and per-item records — not about a promise of identical token streams.
