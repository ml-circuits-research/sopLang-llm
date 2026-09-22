# Four-condition diagnostic — diag-pairs-010

Artifact: `/home/salboaie/work/sopLang-llm/evaluation/registry/exp-010-contrastive/gguf/checkpoint-450.gguf`. Suite: diagnostic-pairs-1.0.0, seed 20260922, 24 pairs (8 per kind, 3 kinds).

The **normal** condition is the statement alone through the recorded compiled-plan profile: it is the only deployable score here.
The **values**, **plan**, and **both** conditions are oracle-assisted diagnostics — they supply input the deployed system would not have — and their numbers must never be quoted as task performance.

| condition | oracle-assisted | matched | items | rate | parse valid | executed |
| --- | --- | --- | --- | --- | --- | --- |
| normal | no | 23 | 48 | 47.9% | 100.0% | 91.7% |
| values | yes | 3 | 48 | 6.3% | 100.0% | 81.3% |
| plan | yes | 16 | 48 | 33.3% | 100.0% | 89.6% |
| both | yes | 6 | 48 | 12.5% | 100.0% | 72.9% |

## Paired accuracy (normal condition: the statement alone)

A pair counts only when both of its members answer correctly.

| pair kind | pairs | both correct | one correct | neither | paired accuracy |
| --- | --- | --- | --- | --- | --- |
| boundary-inclusion-pair | 8 | 7 | 1 | 0 | 87.5% |
| direction-pair | 8 | 0 | 1 | 7 | 0.0% |
| rate-vs-absolute-pair | 8 | 1 | 5 | 2 | 12.5% |
| **all** | **24** | **8** | | | **33.3%** |

## Each pair, both members

| pair | values | oracle | above/left answer | right answer | outcome |
| --- | --- | --- | --- | --- | --- |
| boundary-inclusion-pair-01 | 2, 21, 35, 19, 35, 34, 16 | 5 / 6 | correct | correct | both correct |
| boundary-inclusion-pair-02 | 19, 16, 12, 32, 36 | 4 / 5 | correct | correct | both correct |
| boundary-inclusion-pair-03 | 35, 31, 15, 31, 8, 27, 2, 16 | 6 / 7 | correct | correct | both correct |
| boundary-inclusion-pair-04 | 24, 26, 33, 16, 23, 6, 23, 4 | 5 / 6 | correct | answer_mismatch | one correct |
| boundary-inclusion-pair-05 | 38, 17, 11, 2, 39 | 3 / 4 | correct | correct | both correct |
| boundary-inclusion-pair-06 | 19, 10, 25, 4, 26, 14, 33 | 3 / 4 | correct | correct | both correct |
| boundary-inclusion-pair-07 | 31, 32, 33, 21, 3, 33, 18, 16 | 6 / 7 | correct | correct | both correct |
| boundary-inclusion-pair-08 | 32, 25, 34, 27, 3 | 3 / 4 | correct | correct | both correct |
| direction-pair-01 | 4, 21, 35, 9, 28 | 70 / 56 | execution_error | correct | one correct |
| direction-pair-02 | 7, 9, 19, 31, 31, 20, 41, 2 | 82 / 40 | execution_error | answer_mismatch | neither |
| direction-pair-03 | 20, 28, 39, 21, 12, 37, 18, 7 | 78 / 56 | answer_mismatch | answer_mismatch | neither |
| direction-pair-04 | 14, 36, 31, 22, 15, 8, 21 | 72 / 42 | answer_mismatch | answer_mismatch | neither |
| direction-pair-05 | 18, 8, 10, 29, 3, 32, 18 | 64 / 36 | answer_mismatch | execution_error | neither |
| direction-pair-06 | 25, 6, 39, 19, 31 | 78 / 38 | answer_mismatch | answer_mismatch | neither |
| direction-pair-07 | 39, 36, 34, 26, 33, 33, 7 | 78 / 52 | answer_mismatch | answer_mismatch | neither |
| direction-pair-08 | 11, 23, 40, 29, 25 | 80 / 50 | execution_error | answer_mismatch | neither |
| rate-vs-absolute-pair-01 | 39, 6, 30, 39, 39, 14, 33 | 189 / 185 | answer_mismatch | answer_mismatch | neither |
| rate-vs-absolute-pair-02 | 33, 35, 39, 4, 27, 6, 36 | 187 / 180 | answer_mismatch | correct | one correct |
| rate-vs-absolute-pair-03 | 22, 38, 22, 26, 10, 22 | 143 / 140 | answer_mismatch | correct | one correct |
| rate-vs-absolute-pair-04 | 11, 2, 17, 24, 26, 37, 33, 10 | 132 / 130 | correct | correct | both correct |
| rate-vs-absolute-pair-05 | 11, 19, 12, 5, 2, 36, 15, 40 | 121 / 120 | answer_mismatch | correct | one correct |
| rate-vs-absolute-pair-06 | 40, 31, 40, 3, 5, 40, 2, 39 | 209 / 200 | answer_mismatch | correct | one correct |
| rate-vs-absolute-pair-07 | 33, 14, 5, 37, 18, 16, 17 | 77 / 80 | answer_mismatch | answer_mismatch | neither |
| rate-vs-absolute-pair-08 | 10, 33, 34, 33, 20 | 132 / 130 | answer_mismatch | correct | one correct |

## First divergence (normal condition)

| divergence | items |
| --- | --- |
| none | 23 |
| stopped_after_filter | 14 |
| wrong_values_or_operation | 6 |
| runtime_failure | 4 |
| missing_final_stage | 1 |
