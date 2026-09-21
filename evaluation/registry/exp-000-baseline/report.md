# Baseline of the untuned base model

Experiment `exp-000-baseline`, checkpoint `base`.
Sample: 50 holdout examples, seed 20260918, the same items in both modes.

## Direct answers

| class | items |
| --- | --- |
| answer_mismatch | 50 |

Direct-answer match rate: 0.0%.

## Compiled-plan mode (zero shot)

| rate | value |
| --- | --- |
| parse_validity | 0.0% |
| graph_validity | 0.0% |
| runtime_completion | 0.0% |
| oracle_match | 0.0% |

| class | items |
| --- | --- |
| generation_transport_error | 0 |
| wrapper_rejected | 1 |
| parse_invalid | 49 |
| graph_invalid | 0 |
| execution_error | 0 |
| answer_mismatch | 0 |
| answer_match | 0 |

## Capability probes

Probe suite `capability-probes-1.0.0`: 4 of 10 passed.

| kind | passed | items |
| --- | --- | --- |
| instruction | 2 | 4 |
| javascript | 2 | 6 |

## Efficiency

| measure | value |
| --- | --- |
| generatedTokens | 30256 |
| promptTokens | 18278 |
| calls | 110 |
| wallClockMs | 248077 |

Accuracy and speed above come from the same served artifact.
