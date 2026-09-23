# Training runbook of the sopLang-llm fine-tuning series

The end-to-end procedure, one arm at a time. Every step names the command and what its
output must prove. Read `skills/training-rules/SKILL.md` first; this file is the how.

## 0. Decide the arm

One arm = one change: one hypothesis (a data tranche, a base model, a recipe parameter).
Name it `exp-NNN-<slug>` and record the hypothesis in `evaluation/registry/phase4-analysis.md`
before running anything. If a change alters the parser or runtime, it is a version
increment with a dataset migration, not an arm.

## 1. Extend the generator (data arms only)

All in `teacher/procedural/`:

- **Operator** (in `compositions.mjs`): one object with `takes`, `returns`,
  `apply(values|value, parameters)`, `sentence(parameters)`, and a `clause` the sampler can
  satisfy by retrying. One authority per operator; the family must derive from it.
- **Composition**: a chain of operators in `COMPOSITIONS`, with `depths` equal to the chain
  length. Reserve 3-4 compositions in `HELD_OUT` (whole, never trained). Add pair entries in
  `COMPOSITION_PAIRS` where two compositions differ by one decisive word.
- **Verify the inventory**: `assertInventoryIsWellFormed()` must pass — chains well-typed,
  no duplicates, held-out ids declared. It is called when the generator loads, so a broken
  inventory fails the build.

For non-chain families (`text.mjs`, `contrastive.mjs`, `aggregation.mjs`, ...): the family
object carries `id`, `name` (slugs to the id), `sample`, `statement`, `parse`, `solve`,
`render`, `compute`, `explain`. `parse` must round-trip exactly what `sample` drew (only the
parameters the chain uses are drawn), and must refuse a statement naming a different
operation.

## 2. Verify the families before any build

Run the direct checks (add them to `tests/` so the next tranche inherits them):

- statement parse round-trips the drawn slots exactly (0 failures over ≥20 draws);
- the circuit agrees with the independent oracle on ≥20 sampled instances;
- a wrong-operation statement is refused by the partner's parse.

## 3. Rebuild and export

```bash
node /tmp/rebuild-all.mjs           # or the equivalent per-source pilot loop
node training-data/verify.mjs       # must print verify: OK
node training/export.mjs            # regenerates training/data/*.jsonl
npm test                            # 300+ tests, all green
```

Never rebuild while an evaluation chain is reading `training-data/`.

## 4. Train

```bash
bash training/environment/start-detached.sh train exp-NNN-slug \
  --epochs 3 --lr 1e-4 --batch-size 4 --grad-accum 8 \
  --gradient-checkpointing --save-steps 90 \
  --extra-data training/data/preservation-10.jsonl
```

The recipe is frozen across arms so the only variable is the change under test. A different
base model adds `--base-model <dir> --model-manifest training/environment/base-model-<size>.json`
(pin the manifest first with `pin_base_model.py`; convert the base with
`tools/llamacpp/convert_hf_to_gguf.py`). Restart the guards beside the run.

## 5. The evaluation chain

The chain runs after training (start it manually with `bash evaluation/start-chain.sh
exp-NNN-slug` if the automatic start missed — it has, twice):

1. **Selection:** every saved checkpoint is scored on the 339-row validation slice; the
   winner is the highest oracle match, parse validity as the tiebreaker.
2. **Holdout:** the winner is scored on the sealed `training-data/*/eval/**` items; report
   `oracle match` decomposed into reserved compositions / old procedural family / books —
   never the aggregate alone.
3. **Probes:** the capability probes (`capability-probes.jsonl`) are part of the same pass.

## 6. The fair baselines

Ask each untrained base the eval statements in prose and compare with the printed answers:

```bash
node evaluation/run-prose-eval.mjs --experiment cmp-base-holdout-prose-05 \
  --gguf training/checkpoints/base-f16.gguf --port 8131
# and the same with base-1.5b-f16.gguf for the larger base
```

## 7. The retry sweep (before the next training round)

```bash
for n in 0 1 2; do
  node evaluation/run-diagnostic.mjs --experiment retry-sweep-$n \
    --gguf evaluation/registry/<winner-gguf> --per-structure 5 --retries $n --port $((8150+n)) --concurrency 4
done
```

Compare the `normal` condition rates across the three runs: that is the measured value of
the deployed retry loop. The scored metrics stay `--retries 0`.

## 8. Report and clean up

- Write the arm into `phase4-analysis.md` with every number decomposed and compared against
  the previous arms; write the owner-facing answer into `raspuns.md`; update `training/STATE.md`.
- Commit everything. Stop the guards when nothing is queued. Prune the non-winner GGUF
  conversions of the closed experiment, keeping the winner and the logs.
- Re-run the operation census (`node evaluation/census.mjs`) so the coverage gap stays current.

## 9. The chat (deployment surface)

`node evaluation/chat.mjs` serves the latest experiment's winner by default, shows the four
blocks (0.5B base yellow, 0.5B student cyan, 1.5B base magenta, 1.5B student green — the
1.5B pair appears when its winner exists), each with tokens and request-to-answer time, and
retries failed plans with the full failure history (`--retries N`, default 2). Every answered question is appended
to `evaluation/registry/chat-history.jsonl` (override the path with the `SOPLANG_CHAT_HISTORY`
environment variable), the up arrow recalls saved questions across sessions, and `/history [N]`
lists the last N turns with every model's answer. The lanes scan upward for free ports and
never kill a port held by another model; the main port reclaims its own. `--no-1.5b` skips
the 1.5B pair, `--single` keeps only the student.
