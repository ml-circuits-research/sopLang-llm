# Reader-facing experiments and archived evidence

The manuscripts use descriptive experimental names. This supplement preserves the exact repository identifiers needed for reconstruction. Letters are local to each article: the Open Research Europe manuscript centers its Experiment A on model choice, while the Machine Learning and Informatica manuscripts center theirs on vocabulary. These are selected views of shared research, not independent replications.

| Manuscript | Reader-facing comparison | Contrast |
| --- | --- | --- |
| 01-machine-learning | A | Add specialized commands |
| 01-machine-learning | B | Split target computations |
| 01-machine-learning | C | Change the adapted base model |
| 02-informatica | A | Add specialized commands |
| 02-informatica | B | Split target computations |
| 04-open-research-europe | A | Change the adapted base model |
| 04-open-research-europe | Analysis B | Restricted answer-equivalence diagnostics |

## Exact condition identities

| Contrast | Condition | Archived identifier | Base release | Data version | Training finish, UTC |
| --- | --- | --- | --- | --- | --- |
| Add specialized commands | General code | exp-014-deep-chains | Qwen/Qwen2.5-Coder-1.5B-Instruct | 2 | 2026-09-23T17:10:57Z (approximate) |
| Add specialized commands | Specialized wires | exp-016-wires | Qwen/Qwen2.5-Coder-1.5B-Instruct | 3 | 2026-09-24T08:14:49Z |
| Split target computations | Compact targets | exp-021-1.7b-qwen3-dv7 | Qwen/Qwen3-1.7B | 7 | 2026-09-25T15:44:50Z |
| Split target computations | Split targets | exp-022-1.7b-qwen3-dv8 | Qwen/Qwen3-1.7B | 8 | 2026-09-25T20:45:14Z |
| Change the adapted base model | 0.5B model | exp-026-0.5b-qwen2.5coder-dv13 | Qwen/Qwen2.5-Coder-0.5B-Instruct | 13 | 2026-09-26T20:07:03Z |
| Change the adapted base model | 1.7B model | exp-027-1.7b-qwen3-dv13 | Qwen/Qwen3-1.7B | 13 | 2026-09-27T00:07:16Z |
| Restricted answer-equivalence diagnostics | Coalitions | exp-027-1.7b-qwen3-dv13 | Qwen/Qwen3-1.7B | 13 | 2026-09-27T00:07:16Z |
| Restricted answer-equivalence diagnostics | Scheduling | exp-021-1.7b-qwen3-dv7 | Qwen/Qwen3-1.7B | 7 | 2026-09-25T15:44:50Z |

The early base-to-adapted reference comparisons use `cmp-base-holdout-prose-05` with `exp-012-census`, and `cmp-base-holdout-prose-15` with `exp-013-1.5b`. Each pair has 585 shared identifiers and unchanged expected answers. The first compares the Qwen2.5-Coder-0.5B-Instruct release with its SOP Lang adaptation; the second uses Qwen2.5-Coder-1.5B-Instruct. The additional Qwen3 response-availability audit uses `cmp-base-holdout-prose-q3` and is kept separate because 322 of 705 requests have no completion. Full model identities, retained settings, selections, and timestamps are in [baseline-results.json](baseline-results.json); the analysis and semantic limits are described in [baseline-audit.md](../audit/baseline-audit.md).

Percentages in the manuscripts are calculated from integer counts in [results.json](results.json) and [baseline-results.json](baseline-results.json). Denominators appear in table captions or population definitions. The use of percentages does not change the sampled population or the distinction between original outcomes and retrospective diagnostics.
