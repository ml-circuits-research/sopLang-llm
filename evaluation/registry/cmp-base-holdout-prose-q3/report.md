# Prose evaluation — cmp-base-holdout-prose-q3

Artifact: `training/checkpoints/base-qwen3-17b-f16.gguf`. Items: 705 (every eval statement).

The model was asked to answer each statement directly in prose; the completion
was compared with the printed answer of the problem. A non-numeric answer is
credited only by normalized containment; a numeric answer is credited only when
every number the printed answer states appears in the completion.

| metric | numerator | items | rate |
| --- | --- | --- | --- |
| printed answer matched | 357 | 705 | 50.6% |
| generation failed | 322 | 705 | 45.7% |

| book | items | matched | rate |
| --- | --- | --- | --- |
| adult-reasoning | 10 | 0 | 0.0% |
| common-sense | 50 | 14 | 28.0% |
| decompose-to-solve | 100 | 1 | 1.0% |
| logical-reasoning | 10 | 0 | 0.0% |
| mathematical-thinking | 10 | 5 | 50.0% |
| procedural-arithmetic | 480 | 337 | 70.2% |
| scientific-reasoning | 25 | 0 | 0.0% |
| world-as-a-system | 20 | 0 | 0.0% |
