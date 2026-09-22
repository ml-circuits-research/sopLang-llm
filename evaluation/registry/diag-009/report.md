# Four-condition diagnostic — diag-009

Artifact: `/home/salboaie/work/sopLang-llm/evaluation/registry/exp-009-mix10/gguf/checkpoint-728.gguf`. Suite: diagnostic-suite-1.0.0, seed 20260922, 60 problems (10 per structure).

The **normal** condition is the statement alone through the recorded compiled-plan profile: it is the only deployable score here.
The **values**, **plan**, and **both** conditions are oracle-assisted diagnostics — they supply input the deployed system would not have — and their numbers must never be quoted as task performance.

| condition | oracle-assisted | matched | items | rate | parse valid | executed |
| --- | --- | --- | --- | --- | --- | --- |
| normal | no | 8 | 60 | 13.3% | 100.0% | 78.3% |
| values | yes | 9 | 60 | 15.0% | 100.0% | 91.7% |
| plan | yes | 8 | 60 | 13.3% | 100.0% | 60.0% |
| both | yes | 10 | 60 | 16.7% | 100.0% | 61.7% |

## Paired outcome against the normal condition

| structure | problems | normal ok | rescued by values | rescued by plan | rescued by both | still failing |
| --- | --- | --- | --- | --- | --- | --- |
| filter-total | 10 | 1 | 0 | 0 | 0 | 9 |
| filter-count | 10 | 7 | 1 | 3 | 3 | 0 |
| filter-largest-double | 10 | 0 | 0 | 0 | 0 | 10 |
| filter-total-add-rate | 10 | 0 | 0 | 0 | 0 | 10 |
| filter-count-per-unit | 10 | 0 | 4 | 0 | 0 | 6 |
| filter-largest-add-rate | 10 | 0 | 0 | 0 | 0 | 10 |

## First divergence (normal condition)

| divergence | items |
| --- | --- |
| stopped_after_filter | 20 |
| missing_final_stage | 18 |
| runtime_failure | 13 |
| none | 8 |
| wrong_values_or_operation | 1 |
