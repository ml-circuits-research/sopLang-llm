# exp-001-overfit-lr1e-4 — gate evidence (PLAN.md T5d)

Artifacts of this entry: two F16 GGUFs and their served gate runs on the same 300
items (`items/overfit-subset.jsonl`, greedy decoding, one attempt per item plus the
client's single transport retry, `max_tokens` 2048), `metrics.json`, `report.md`.

Recipe: subset `training/overfit/overfit-subset.jsonl`, lr 1e-4, cosine with warmup,
effective batch 32 (per-device 4 x accumulation 8 to fit the degraded device pool),
gradient checkpointing, bf16, seed 3407. The 20-epoch reference at lr 2e-5 is
`../exp-001-overfit/gates.md`.

## Gate 1 — training loss below 0.05 with a strongly falling curve: PASS

The first episode early-stopped at step 100 of 320 with `final_loss: 0.00413`; the
extension then ran to step 271 (`final_loss: 0.00032`), where the memory guard
stopped it with `checkpoint-271` on disk. The curve has no plateau: 0.930 (10),
0.417 (20), 0.228 (30), 0.114 (40), 0.054 (50), 0.029 (60), 0.0175 (70), 0.0124
(80), 0.0064 (90), 0.0041 (100), 0.00032 (270). Peak device memory 16.249 GiB.
Evidence: `training/checkpoints/exp-001-overfit-lr1e-4/{train-log.jsonl,run-manifest.json,memory-stops.jsonl}`.

## Gate 2 — at least 95% `answer_match` on the overfit items: PASS

Final round, artifact `training/checkpoints/exp-001-overfit-lr1e-4-step271-f16.gguf`
(the step-271 checkpoint): 300 items, parse validity 100.0%, graph validity 100.0%,
runtime completion 96.3%, oracle match 94.7%. On the **284 rows the trainer actually
saw the rate is 100.0% (284/284)**; the 16 subset folders that the D11 validation
slice excluded score 0.0% (11 `execution_error`, 5 `answer_mismatch`), which is the
signature of memorization rather than generalization. Efficiency: 168,102 generated
tokens, 61,913 prompt tokens, 300 calls, 108.63 tokens/s, cost per correct result
591.9 generated tokens.

Intermediate round, artifact `training/checkpoints/exp-001-overfit-lr1e-4-f16.gguf`
(the step-100 checkpoint, replaced in the registry by the final round above): 268/300
overall; 268/284 (94.4%) on the trained rows, two items short of the gate before the
extension.

## Gate 3 — served rendering equals the training rendering: PASS

For three items (`adult-reasoning`, `logical-reasoning`, `world-as-a-system`) the
server's `/apply-template` output equals the trainer tokenizer's
`apply_chat_template(..., add_generation_prompt=True)` rendering character for
character, and `/tokenize` returns identical id sequences (353, 207, 213 tokens).
Verified against both served checkpoints.

## Diagnosis of the failed first recipe, and what it fixed

`../exp-001-overfit/gates.md` records the first run at lr 2e-5: the loss plateaued at
0.179, programs parsed at 100% but reproduced only the shared probe scaffold, and the
per-row values were invented (5.0% oracle match). Raising the learning rate to 1e-4
on the same subset, profile, and recipe shape closed gates 1, 2, and 3, so the
limiting factor was the optimization budget, not the dataset, tokenizer, chat
template, loss mask, wrapper, or serving path. The full run of T8 starts from this
recipe with the plan's lower rate as its first member, and the learning-rate decision
for the rest of the series is open (the plan's `exp-003` at lr 1e-5 is in question).
