# Four-condition diagnostic — diag-pairs-fixed

Artifact: `/home/salboaie/work/sopLang-llm/evaluation/registry/exp-010-contrastive/gguf/checkpoint-450.gguf`. Suite: diagnostic-pairs-1.0.0, seed 20260922, 12 pairs (4 per kind, 3 kinds).

The **normal** condition is the statement alone through the recorded compiled-plan profile: it is the only deployable score here.
The **values**, **plan**, and **both** conditions are oracle-assisted diagnostics — they supply input the deployed system would not have — and their numbers must never be quoted as task performance.

| condition | oracle-assisted | matched | items | rate | parse valid | executed |
| --- | --- | --- | --- | --- | --- | --- |
| normal | no | 12 | 24 | 50.0% | 100.0% | 91.7% |
| values | yes | 8 | 24 | 33.3% | 100.0% | 83.3% |
| plan | yes | 11 | 24 | 45.8% | 100.0% | 70.8% |
| both | yes | 6 | 24 | 25.0% | 100.0% | 87.5% |

## Paired accuracy (normal condition: the statement alone)

A pair counts only when both of its members answer correctly.

| pair kind | pairs | both correct | one correct | neither | paired accuracy |
| --- | --- | --- | --- | --- | --- |
| boundary-inclusion-pair | 4 | 3 | 1 | 0 | 75.0% |
| direction-pair | 4 | 0 | 1 | 3 | 0.0% |
| rate-vs-absolute-pair | 4 | 1 | 2 | 1 | 25.0% |
| **all** | **12** | **4** | | | **33.3%** |

## Each pair, both members

| pair | values | oracle | above/left answer | right answer | outcome |
| --- | --- | --- | --- | --- | --- |
| boundary-inclusion-pair-01 | 2, 21, 35, 19, 35, 34, 16 | 5 / 6 | correct | correct | both correct |
| boundary-inclusion-pair-02 | 19, 16, 12, 32, 36 | 4 / 5 | correct | correct | both correct |
| boundary-inclusion-pair-03 | 35, 31, 15, 31, 8, 27, 2, 16 | 6 / 7 | correct | correct | both correct |
| boundary-inclusion-pair-04 | 24, 26, 33, 16, 23, 6, 23, 4 | 5 / 6 | correct | answer_mismatch | one correct |
| direction-pair-01 | 4, 21, 35, 9, 28 | 70 / 56 | execution_error | correct | one correct |
| direction-pair-02 | 7, 9, 19, 31, 31, 20, 41, 2 | 82 / 40 | execution_error | answer_mismatch | neither |
| direction-pair-03 | 20, 28, 39, 21, 12, 37, 18, 7 | 78 / 56 | answer_mismatch | answer_mismatch | neither |
| direction-pair-04 | 14, 36, 31, 22, 15, 8, 21 | 72 / 42 | answer_mismatch | answer_mismatch | neither |
| rate-vs-absolute-pair-01 | 39, 6, 30, 39, 39, 14, 33 | 189 / 185 | answer_mismatch | answer_mismatch | neither |
| rate-vs-absolute-pair-02 | 33, 35, 39, 4, 27, 6, 36 | 187 / 180 | answer_mismatch | correct | one correct |
| rate-vs-absolute-pair-03 | 22, 38, 22, 26, 10, 22 | 143 / 140 | answer_mismatch | correct | one correct |
| rate-vs-absolute-pair-04 | 11, 2, 17, 24, 26, 37, 33, 10 | 132 / 130 | correct | correct | both correct |

## First divergence (normal condition)

| divergence | items |
| --- | --- |
| none | 12 |
| wrong_values_or_operation | 6 |
| stopped_after_filter | 3 |
| runtime_failure | 2 |
| missing_final_stage | 1 |
