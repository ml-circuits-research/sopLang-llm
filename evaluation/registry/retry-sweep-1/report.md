# Four-condition diagnostic — retry-sweep-1

Artifact: `/home/salboaie/work/sopLang-llm/evaluation/registry/exp-012-census/gguf/checkpoint-720.gguf`. Suite: diagnostic-suite-1.0.0, seed 20260922, 30 problems (5 per structure).

The **normal** condition is the statement alone through the recorded compiled-plan profile: it is the only deployable score here.
The **values**, **plan**, and **both** conditions are oracle-assisted diagnostics — they supply input the deployed system would not have — and their numbers must never be quoted as task performance.

| condition | oracle-assisted | matched | items | rate | parse valid | executed |
| --- | --- | --- | --- | --- | --- | --- |
| normal | no | 17 | 30 | 56.7% | 100.0% | 93.3% |
| values | yes | 20 | 30 | 66.7% | 100.0% | 96.7% |
| plan | yes | 15 | 30 | 50.0% | 100.0% | 80.0% |
| both | yes | 20 | 30 | 66.7% | 100.0% | 96.7% |

## Paired outcome against the normal condition

| structure | problems | normal ok | rescued by values | rescued by plan | rescued by both | still failing |
| --- | --- | --- | --- | --- | --- | --- |
| filter-total | 5 | 0 | 0 | 0 | 0 | 5 |
| filter-count | 5 | 5 | 0 | 0 | 0 | 0 |
| filter-largest-double | 5 | 5 | 0 | 0 | 0 | 0 |
| filter-total-add-rate | 5 | 0 | 1 | 0 | 2 | 3 |
| filter-count-per-unit | 5 | 2 | 2 | 0 | 3 | 0 |
| filter-largest-add-rate | 5 | 5 | 0 | 0 | 0 | 0 |

## First divergence (normal condition)

| divergence | items |
| --- | --- |
| none | 17 |
| wrong_values_or_operation | 11 |
| runtime_failure | 2 |
