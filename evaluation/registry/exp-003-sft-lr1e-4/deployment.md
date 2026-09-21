# Deployment measurement, exp-003-sft-lr1e-4

Winner `checkpoint-540` of the selection table, quantized from `/home/salboaie/work/sopLang-llm/evaluation/registry/exp-003-sft-lr1e-4/gguf/checkpoint-540.gguf` (F16).
Every row below — accuracy, throughput, and memory — was measured on that row's own artifact in one server session on this host (`aarch64 host, 20 cores`, 8 threads, greedy decoding, 265 holdout items, one generated attempt per item).

| quant | artifact | items | parse | graph | completion | oracle | probes | generated tok/s | prompt tok/s | first token ms | peak RSS GiB |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Q8_0 | `/home/salboaie/work/sopLang-llm/evaluation/registry/exp-003-sft-lr1e-4/gguf/checkpoint-540-q8-0.gguf` | 265 | 100.0% | 100.0% | 40.4% | 0.0% | 1/10 | 160.9 | 4613 | 19 | 2.69 |
| Q4_K_M | `/home/salboaie/work/sopLang-llm/evaluation/registry/exp-003-sft-lr1e-4/gguf/checkpoint-540-q4-k-m.gguf` | 265 | 100.0% | 100.0% | 40.4% | 0.0% | 1/10 | 176.2 | 2483 | 36 | 2.75 |

Whole-task latency per item (mean of the per-item generations) is in each artifact's own metrics file; the prompt-processing figure uses the same fixed prompt for every row (`prompt_n`/`prompt_ms` of the native completion endpoint with `n_predict: 1`), and the first-token time is that prompt time plus the single predicted token.

Per-artifact evidence: `<artifact registry folder>/{items/holdout.jsonl,items/capability-probes.jsonl,metrics.json,probes.md,server.log}`. Quantization loss is the difference between a row and the F16 selection table of the same checkpoint; it is reported here rather than assumed.
